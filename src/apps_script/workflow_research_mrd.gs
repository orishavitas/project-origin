function generateMrdForRow(rowIndex, parsedDataOverride) {
  const config = getConfig();
  const systemPrompt = getFileTextById(config.originFileId);
  const researchPrompt = getPromptText(config.promptsFolderId, "04_research.md");
  const mrdPrompt = getPromptText(config.promptsFolderId, "05_generate_mrd.md");

  const parsedData = parsedDataOverride || getParsedDataForRow(rowIndex);
  const researchUserPrompt = renderPrompt(researchPrompt, {
    parsed_data_json: JSON.stringify(parsedData),
    product_name: parsedData.product_concept ? parsedData.product_concept.name : "",
    product_summary: parsedData.product_concept ? parsedData.product_concept.summary : "",
    product_category: parsedData.product_concept ? parsedData.product_concept.category : "",
    target_markets: joinList(parsedData.extracted_data && parsedData.extracted_data.target_markets),
    device_compatibility: joinList(parsedData.extracted_data && parsedData.extracted_data.technical_requirements && parsedData.extracted_data.technical_requirements.device_compatibility),
    target_price_range: formatTargetPrice(parsedData.extracted_data && parsedData.extracted_data.target_price)
  });
  const researchOutput = callGemini(systemPrompt, researchUserPrompt, { temperature: 0.7 });

  const mrdUserPrompt = renderPrompt(mrdPrompt, {
    parsed_data_json: JSON.stringify(parsedData),
    research_output_json: JSON.stringify(researchOutput)
  });
  const mrdOutput = callGemini(systemPrompt, mrdUserPrompt, { temperature: 0.5 });

  const docUrl = createMrdDoc(mrdOutput, parsedData);
  updateRequestRow(rowIndex, {
    "MRD Link": docUrl,
    Status: "Draft Ready"
  });

  sendDraftNotification(parsedData, docUrl);
}

function createMrdDoc(mrdOutput, parsedData) {
  const config = getConfig();
  const productName = parsedData.product_concept && parsedData.product_concept.name ? parsedData.product_concept.name : "MRD";
  const folder = DriveApp.getFolderById(config.driveParentFolderId);
  const templateFile = DriveApp.getFileById(config.templateDocId);
  const copy = templateFile.makeCopy(`MRD - ${productName}`, folder);
  const doc = DocumentApp.openById(copy.getId());

  doc.getBody().setText(formatMrdText(mrdOutput));
  doc.saveAndClose();
  return doc.getUrl();
}

function formatMrdText(mrdOutput) {
  if (!mrdOutput) {
    return "MRD output was empty.";
  }
  const sections = [
    ["Purpose & Vision", mrdOutput.purpose_and_vision],
    ["Problem Statement", mrdOutput.problem_statement],
    ["Target Market & Use Cases", mrdOutput.target_market_and_use_cases],
    ["Target Users", mrdOutput.target_users],
    ["Product Description", mrdOutput.product_description],
    ["Key Requirements", mrdOutput.key_requirements],
    ["Design & Aesthetics", mrdOutput.design_and_aesthetics],
    ["Target Price", mrdOutput.target_price],
    ["Risks and Thoughts", mrdOutput.risks_and_thoughts],
    ["Competition to Review", mrdOutput.competition_to_review],
    ["Additional Considerations", mrdOutput.additional_considerations],
    ["Success Criteria", mrdOutput.success_criteria]
  ];

  return sections
    .map(([title, content]) => `${title}\n${content || "TBD"}\n`)
    .join("\n");
}

function sendDraftNotification(parsedData, docUrl) {
  const to = parsedData.sender && parsedData.sender.email ? parsedData.sender.email : "";
  if (!to) {
    return;
  }
  const productName = parsedData.product_concept && parsedData.product_concept.name ? parsedData.product_concept.name : "your request";
  const subject = `MRD Draft Ready for Review: ${productName}`;
  const body = [
    `Hi ${parsedData.sender && parsedData.sender.name ? parsedData.sender.name : "there"},`,
    "",
    `The MRD for ${productName} is ready for your review:`,
    docUrl,
    "",
    "Please review and reply with one of:",
    "1. Approve as-is",
    "2. Request revisions (include specific changes)",
    "3. Put on hold",
    "",
    "— Origin"
  ].join("\n");
  GmailApp.sendEmail(to, subject, body);
}

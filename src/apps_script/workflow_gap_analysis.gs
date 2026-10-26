function processClarificationReplies() {
  const config = getConfig();
  const clarificationLabel = getOrCreateLabel(config.clarificationLabel);
  const query = `label:${config.clarificationLabel} is:unread newer_than:14d`;
  const threads = GmailApp.search(query);

  const systemPrompt = getFileTextById(config.originFileId);
  const parsePrompt = getPromptText(config.promptsFolderId, "01_parse_email.md");
  const gapPrompt = getPromptText(config.promptsFolderId, "02_gap_analysis.md");

  threads.forEach((thread) => {
    const rowIndex = findRowByThreadId(thread.getId());
    if (!rowIndex) {
      return;
    }

    const message = thread.getMessages()[thread.getMessageCount() - 1];
    const existingParsed = getParsedDataForRow(rowIndex);
    const emailData = buildEmailData(message);
    const userPrompt = renderPrompt(parsePrompt, emailData);
    const replyParsed = callGemini(systemPrompt, userPrompt, { temperature: 0.2 });
    const merged = mergeParsedData(existingParsed, replyParsed);

    updateRequestRow(rowIndex, {
      "Parsed Data": JSON.stringify(merged),
      Status: "Research"
    });

    const gapUserPrompt = renderPrompt(gapPrompt, {
      parsed_request_json: JSON.stringify(merged),
      round_number: 2,
      previous_questions_if_any: ""
    });
    const gapAnalysis = callGemini(systemPrompt, gapUserPrompt, { temperature: 0.2 });
    if (gapAnalysis && gapAnalysis.decision === "clarify") {
      updateRequestRow(rowIndex, { Status: "Clarification" });
      return;
    }

    generateMrdForRow(rowIndex, merged);
    thread.markRead();
    thread.removeLabel(clarificationLabel);
  });
}

function sendClarificationEmail(parsed, clarificationEmail) {
  if (!clarificationEmail) {
    return;
  }
  const to = parsed.sender && parsed.sender.email ? parsed.sender.email : "";
  if (!to) {
    return;
  }
  const subject = clarificationEmail.subject || `Quick Questions: ${parsed.product_concept && parsed.product_concept.name ? parsed.product_concept.name : ""}`;
  const body = clarificationEmail.body || clarificationEmail.email_body || "";
  GmailApp.sendEmail(to, subject, body);
}

function mergeParsedData(baseData, updateData) {
  const merged = JSON.parse(JSON.stringify(baseData || {}));
  if (!merged.extracted_data) {
    merged.extracted_data = {};
  }
  if (updateData && updateData.extracted_data) {
    Object.keys(updateData.extracted_data).forEach((key) => {
      if (!merged.extracted_data[key] && updateData.extracted_data[key]) {
        merged.extracted_data[key] = updateData.extracted_data[key];
      }
    });
  }
  return merged;
}

function getParsedDataForRow(rowIndex) {
  const sheet = getRequestsSheet();
  const { map } = getHeaderMap(sheet);
  const parsedColumn = map["Parsed Data"];
  if (!parsedColumn) {
    throw new Error("Missing Parsed Data column.");
  }
  const value = sheet.getRange(rowIndex, parsedColumn).getValue();
  return value ? safeJsonParse(value) : {};
}

function processNewRequests() {
  const config = getConfig();
  const systemPrompt = getFileTextById(config.originFileId);
  const parsePrompt = getPromptText(config.promptsFolderId, "01_parse_request.md");
  const gapPrompt = getPromptText(config.promptsFolderId, "02_gap_analysis.md");

  // Find rows that are "New" or empty status
  const newRowIndices = findRowsByStatus(["New", ""]);
  const sheet = getRequestsSheet();
  const { map } = getHeaderMap(sheet);

  newRowIndices.forEach((rowIndex) => {
    // Read the raw request from the sheet
    // Assuming "Raw Request" column holds the user input string (from Form or manual entry)
    // If coming from Form, this might be "Raw Request" or some specific question column. 
    // We'll trust utils.gs map lookup.
    const rowValues = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rawRequest = rowValues[map["Raw Request"] - 1];

    if (!rawRequest) {
      // Empty request, skip or mark invalid
      return;
    }

    const requestData = {
      request_body: rawRequest,
      timestamp: toIsoDate(new Date())
    };

    const userPrompt = renderPrompt(parsePrompt, requestData);
    const parsed = callGemini(systemPrompt, userPrompt, { temperature: 0.2 });

    // Update row with initial parsed data
    updateRequestRow(rowIndex, {
      "Request Name": parsed.product_concept && parsed.product_concept.name,
      "Requestor": parsed.sender && parsed.sender.name,
      "Department": parsed.sender && parsed.sender.department,
      "Target Market": joinList(parsed.extracted_data && parsed.extracted_data.target_markets),
      "Target Price": formatTargetPrice(parsed.extracted_data && parsed.extracted_data.target_price),
      "Parsed Data": JSON.stringify(parsed),
      "Scope Flags": JSON.stringify(parsed.scope_flags || []),
      "Status": "Processing" // Temporary status while we run gap analysis
    });

    // Run Gap Analysis immediately
    const gapUserPrompt = renderPrompt(gapPrompt, {
      parsed_request_json: JSON.stringify(parsed),
      round_number: 1,
      previous_questions_if_any: ""
    });
    const gapAnalysis = callGemini(systemPrompt, gapUserPrompt, { temperature: 0.2 });

    if (gapAnalysis && gapAnalysis.decision === "clarify") {
      // Write questions to "Questions" column
      const questions = gapAnalysis.clarification ? 
        gapAnalysis.clarification.questions.map(q => `${q.number}. ${q.question}`).join("\n") : 
        "Please provide more details.";
      
      updateRequestRow(rowIndex, { 
        "Status": "Needs Clarification",
        "Questions": questions
      });
    } else {
      updateRequestRow(rowIndex, { "Status": "Research" });
      generateMrdForRow(rowIndex, parsed);
    }
  });
}

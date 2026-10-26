function processClarificationUpdates() {
  const config = getConfig();
  const systemPrompt = getFileTextById(config.originFileId);
  const parsePrompt = getPromptText(config.promptsFolderId, "01_parse_request.md");
  const gapPrompt = getPromptText(config.promptsFolderId, "02_gap_analysis.md");

  // Find rows where user has provided answers (Status = "Clarification Provided" or "Updated")
  const updatedRowIndices = findRowsByStatus(["Clarification Provided", "Updated"]);
  const sheet = getRequestsSheet();
  const { map } = getHeaderMap(sheet);

  updatedRowIndices.forEach((rowIndex) => {
    const existingParsed = getParsedDataForRow(rowIndex);
    
    // Read the "Answers" or "Raw Request" (if they appended to it)
    // We assume the user updates the "Raw Request" with new info or there is an "Answers" column.
    // For simplicity, let's assume they append to "Raw Request" or we look at "Answers" column if it exists.
    // Let's stick to reading "Raw Request" + "Answers" combined as the new input state.
    
    const rowValues = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rawRequest = rowValues[map["Raw Request"] - 1] || "";
    const answers = map["Answers"] ? rowValues[map["Answers"] - 1] : ""; // Optional column for answers
    
    const combinedInput = `Original Request: ${rawRequest}\n\nAdditional Info/Answers: ${answers}`;
    
    const requestData = {
      request_body: combinedInput,
      timestamp: toIsoDate(new Date())
    };

    // Re-parse the request with the new info
    const userPrompt = renderPrompt(parsePrompt, requestData);
    const replyParsed = callGemini(systemPrompt, userPrompt, { temperature: 0.2 });
    
    // Merge logic remains similar
    const merged = mergeParsedData(existingParsed, replyParsed);

    updateRequestRow(rowIndex, {
      "Parsed Data": JSON.stringify(merged),
      "Status": "Processing Update"
    });

    // Re-run Gap Analysis (Round 2 force, or increment if we tracked rounds)
    const gapUserPrompt = renderPrompt(gapPrompt, {
      parsed_request_json: JSON.stringify(merged),
      round_number: 2, // Assume this solves it or we force proceed after this
      previous_questions_if_any: ""
    });
    const gapAnalysis = callGemini(systemPrompt, gapUserPrompt, { temperature: 0.2 });

    if (gapAnalysis && gapAnalysis.decision === "clarify") {
      // Still need more info?
      // If we want to allow loop:
      const questions = gapAnalysis.clarification ? 
        gapAnalysis.clarification.questions.map(q => `${q.number}. ${q.question}`).join("\n") : 
        "Still need details.";
        
      updateRequestRow(rowIndex, { 
        Status: "Needs Clarification",
        Questions: questions 
      });
    } else {
      updateRequestRow(rowIndex, { Status: "Research" });
      generateMrdForRow(rowIndex, merged);
    }
  });
}

function mergeParsedData(baseData, updateData) {
  const merged = JSON.parse(JSON.stringify(baseData || {}));
  if (!merged.extracted_data) {
    merged.extracted_data = {};
  }
  if (updateData && updateData.extracted_data) {
    Object.keys(updateData.extracted_data).forEach((key) => {
      // If new data has non-empty value, overwrite or fill gap
      if (updateData.extracted_data[key]) {
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

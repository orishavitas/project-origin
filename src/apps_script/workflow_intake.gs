function processNewEmails() {
  const config = getConfig();
  const processedLabel = getOrCreateLabel(config.processedLabel);
  const clarificationLabel = getOrCreateLabel(config.clarificationLabel);
  const query = `to:${config.intakeEmail} is:unread newer_than:14d`;
  const threads = GmailApp.search(query);

  const systemPrompt = getFileTextById(config.originFileId);
  const parsePrompt = getPromptText(config.promptsFolderId, "01_parse_email.md");
  const gapPrompt = getPromptText(config.promptsFolderId, "02_gap_analysis.md");
  const clarificationPrompt = getPromptText(config.promptsFolderId, "03_clarification.md");

  threads.forEach((thread) => {
    if (thread.hasLabel(processedLabel)) {
      return;
    }

    const message = thread.getMessages()[0];
    if (!isNewRequest(message, clarificationLabel)) {
      thread.addLabel(processedLabel);
      return;
    }

    const emailData = buildEmailData(message);
    const userPrompt = renderPrompt(parsePrompt, emailData);
    const parsed = callGemini(systemPrompt, userPrompt, { temperature: 0.2 });

    const rowIndex = appendRequestRow(parsed, emailData, thread.getId());
    sendAcknowledgementEmail(parsed, emailData);

    const gapUserPrompt = renderPrompt(gapPrompt, {
      parsed_request_json: JSON.stringify(parsed),
      round_number: 1,
      previous_questions_if_any: ""
    });
    const gapAnalysis = callGemini(systemPrompt, gapUserPrompt, { temperature: 0.2 });

    if (gapAnalysis && gapAnalysis.decision === "clarify") {
      const clarificationUserPrompt = renderPrompt(clarificationPrompt, {
        gap_analysis_json: JSON.stringify(gapAnalysis),
        product_name: parsed.product_concept ? parsed.product_concept.name : "",
        requestor_name: parsed.sender ? parsed.sender.name : "",
        requestor_email: parsed.sender ? parsed.sender.email : "",
        tracker_link: SpreadsheetApp.openById(config.sheetId).getUrl(),
        clarification_round: 1
      });
      const clarificationEmail = callGemini(systemPrompt, clarificationUserPrompt, { temperature: 0.2 });
      sendClarificationEmail(parsed, clarificationEmail);
      updateRequestRow(rowIndex, { Status: "Clarification" });
      thread.addLabel(clarificationLabel);
    } else {
      updateRequestRow(rowIndex, { Status: "Research" });
      generateMrdForRow(rowIndex, parsed);
    }

    thread.addLabel(processedLabel);
    thread.markRead();
  });
}

function isNewRequest(message, clarificationLabel) {
  const subject = message.getSubject() || "";
  if (subject.toLowerCase().startsWith("re:")) {
    return false;
  }
  const thread = message.getThread();
  if (clarificationLabel && thread.hasLabel(clarificationLabel)) {
    return false;
  }
  return true;
}

function buildEmailData(message) {
  return {
    sender_email: message.getFrom(),
    email_subject: message.getSubject(),
    email_body: message.getPlainBody(),
    timestamp: toIsoDate(message.getDate()),
    thread_id: message.getThread().getId(),
    message_id: message.getId(),
    attachments_json: JSON.stringify([])
  };
}

function sendAcknowledgementEmail(parsed, emailData) {
  const to = parsed.sender && parsed.sender.email ? parsed.sender.email : emailData.sender_email;
  if (!to) {
    return;
  }
  const name = parsed.sender && parsed.sender.name ? parsed.sender.name : "there";
  const productName = parsed.product_concept && parsed.product_concept.name ? parsed.product_concept.name : "your request";
  const subject = `Product Request Received: ${productName}`;
  const body = [
    `Hi ${name},`,
    "",
    `Thanks for submitting your product research request for ${productName}.`,
    "",
    "I've logged this and will begin analysis. I may follow up with a few clarifying questions.",
    "",
    "— Origin"
  ].join("\n");
  GmailApp.sendEmail(to, subject, body);
}

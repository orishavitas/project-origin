const CONFIG_KEYS = {
  apiKey: "GEMINI_API_KEY",
  originFileId: "ORIGIN_FILE_ID",
  promptsFolderId: "PROMPTS_FOLDER_ID",
  sheetId: "SHEET_ID",
  sheetName: "SHEET_NAME",
  intakeEmail: "INTAKE_EMAIL",
  templateDocId: "MRD_TEMPLATE_DOC_ID",
  driveParentFolderId: "DRIVE_PARENT_FOLDER_ID",
  processedLabel: "PROCESSED_LABEL",
  clarificationLabel: "CLARIFICATION_LABEL"
};

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  const config = {
    apiKey: props.getProperty(CONFIG_KEYS.apiKey),
    originFileId: props.getProperty(CONFIG_KEYS.originFileId),
    promptsFolderId: props.getProperty(CONFIG_KEYS.promptsFolderId),
    sheetId: props.getProperty(CONFIG_KEYS.sheetId),
    sheetName: props.getProperty(CONFIG_KEYS.sheetName) || "Product Requests",
    intakeEmail: props.getProperty(CONFIG_KEYS.intakeEmail),
    templateDocId: props.getProperty(CONFIG_KEYS.templateDocId),
    driveParentFolderId: props.getProperty(CONFIG_KEYS.driveParentFolderId),
    processedLabel: props.getProperty(CONFIG_KEYS.processedLabel) || "Origin/Processed",
    clarificationLabel: props.getProperty(CONFIG_KEYS.clarificationLabel) || "Origin/Clarification"
  };

  const required = [
    "apiKey",
    "originFileId",
    "promptsFolderId",
    "sheetId",
    "intakeEmail",
    "templateDocId",
    "driveParentFolderId"
  ];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(`Missing required Script Properties: ${missing.join(", ")}`);
  }
  return config;
}

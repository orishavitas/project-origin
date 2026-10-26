const CONFIG_KEYS = {
  apiKey: "GEMINI_API_KEY",
  originFileId: "ORIGIN_FILE_ID",
  promptsFolderId: "PROMPTS_FOLDER_ID",
  sheetId: "SHEET_ID",
  sheetName: "SHEET_NAME",
  templateDocId: "MRD_TEMPLATE_DOC_ID",
  driveParentFolderId: "DRIVE_PARENT_FOLDER_ID"
};

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  const config = {
    apiKey: props.getProperty(CONFIG_KEYS.apiKey),
    originFileId: props.getProperty(CONFIG_KEYS.originFileId),
    promptsFolderId: props.getProperty(CONFIG_KEYS.promptsFolderId),
    sheetId: props.getProperty(CONFIG_KEYS.sheetId),
    sheetName: props.getProperty(CONFIG_KEYS.sheetName) || "Product Requests",
    templateDocId: props.getProperty(CONFIG_KEYS.templateDocId),
    driveParentFolderId: props.getProperty(CONFIG_KEYS.driveParentFolderId)
  };

  const required = [
    "apiKey",
    "originFileId",
    "promptsFolderId",
    "sheetId",
    "templateDocId",
    "driveParentFolderId"
  ];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(`Missing required Script Properties: ${missing.join(", ")}`);
  }
  return config;
}

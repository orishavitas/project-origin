function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
}

function getFileTextById(fileId) {
  return DriveApp.getFileById(fileId).getBlob().getDataAsString();
}

function getPromptText(promptsFolderId, fileName) {
  const files = DriveApp.getFolderById(promptsFolderId).getFilesByName(fileName);
  if (!files.hasNext()) {
    throw new Error(`Prompt file not found: ${fileName}`);
  }
  return files.next().getBlob().getDataAsString();
}

function renderPrompt(template, data) {
  return Object.keys(data).reduce((text, key) => {
    const value = data[key] === undefined || data[key] === null ? "" : String(data[key]);
    return text.replace(new RegExp(`{{${key}}}`, "g"), value);
  }, template);
}

function getRequestsSheet() {
  const config = getConfig();
  const sheet = SpreadsheetApp.openById(config.sheetId).getSheetByName(config.sheetName);
  if (!sheet) {
    throw new Error(`Sheet not found: ${config.sheetName}`);
  }
  return sheet;
}

function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((header, index) => {
    if (header) {
      map[String(header).trim()] = index + 1;
    }
  });
  return { map, count: headers.length };
}

function toIsoDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

function appendRequestRow(parsed, rawRequestText) {
  const sheet = getRequestsSheet();
  const { map, count } = getHeaderMap(sheet);
  const row = new Array(count).fill("");

  setCell(row, map, "Request Name", parsed.product_concept && parsed.product_concept.name);
  setCell(row, map, "Status", "New");
  setCell(row, map, "Requestor", parsed.sender && parsed.sender.name);
  setCell(row, map, "Department", parsed.sender && parsed.sender.department);
  setCell(row, map, "Target Market", joinList(parsed.extracted_data && parsed.extracted_data.target_markets));
  setCell(row, map, "Target Price", formatTargetPrice(parsed.extracted_data && parsed.extracted_data.target_price));
  setCell(row, map, "MRD Link", "");
  setCell(row, map, "Raw Request", rawRequestText);
  setCell(row, map, "Parsed Data", JSON.stringify(parsed));
  setCell(row, map, "Scope Flags", JSON.stringify(parsed.scope_flags || []));
  setCell(row, map, "Created", toIsoDate(new Date()));
  setCell(row, map, "Last Updated", toIsoDate(new Date()));

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function updateRequestRow(rowIndex, updates) {
  const sheet = getRequestsSheet();
  const { map } = getHeaderMap(sheet);
  const rowRange = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
  const row = rowRange.getValues()[0];

  Object.keys(updates).forEach((key) => {
    if (map[key]) {
      row[map[key] - 1] = updates[key];
    }
  });

  if (map["Last Updated"]) {
    row[map["Last Updated"] - 1] = toIsoDate(new Date());
  }
  rowRange.setValues([row]);
}

function findRowsByStatus(statuses) {
  const sheet = getRequestsSheet();
  const { map } = getHeaderMap(sheet);
  const statusColumn = map["Status"];
  if (!statusColumn) {
    throw new Error("Missing Status column.");
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  const statusValues = sheet.getRange(2, statusColumn, lastRow - 1, 1).getValues();
  const matchingRows = [];
  
  const targetStatuses = Array.isArray(statuses) ? statuses : [statuses];
  
  statusValues.forEach((val, index) => {
    const status = String(val[0]).trim();
    if (targetStatuses.includes(status) || (targetStatuses.includes("") && status === "")) {
      matchingRows.push(index + 2); // +2 because 0-index + 1 header
    }
  });
  
  return matchingRows;
}

function setCell(row, map, header, value) {
  if (!map[header]) {
    return;
  }
  row[map[header] - 1] = value === undefined || value === null ? "" : value;
}

function joinList(list) {
  return Array.isArray(list) ? list.join(", ") : "";
}

function formatTargetPrice(targetPrice) {
  if (!targetPrice) {
    return "";
  }
  if (typeof targetPrice === "string") {
    return targetPrice;
  }
  if (typeof targetPrice === "number") {
    return String(targetPrice);
  }
  if (typeof targetPrice === "object") {
    return JSON.stringify(targetPrice);
  }
  return "";
}

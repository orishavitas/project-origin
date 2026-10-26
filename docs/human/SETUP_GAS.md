# Project Origin - Google Apps Script Setup

> **Purpose:** Set up the Google Workspace + Gemini automation stack for Project Origin

---

## 1. Prerequisites

- Google Workspace account with access to Gmail, Sheets, Drive, and Docs
- Gemini API key (Google AI Studio)
- A Google Sheet prepared with the columns listed in `docs/human/MVP_SPEC.md`

---

## 2. Create Required Google Assets

1. **Google Sheet** (request tracker)
   - Name it `Product Requests`
   - Add columns as defined in `MVP_SPEC.md` §4.1
2. **Google Drive folders**
   - Create `Product Research/` and `_Templates/`
3. **MRD Template Doc**
   - Create `MRD_Template.gdoc` in `_Templates/`

---

## 3. Create Apps Script Project

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Replace the default file with the contents of `src/apps_script/`

---

## 4. Set Script Properties

Open **Project Settings → Script properties** and add:

- `GEMINI_API_KEY`
- `ORIGIN_FILE_ID` (Drive file ID containing `docs/machine/ORIGIN.md`)
- `PROMPTS_FOLDER_ID` (Drive folder ID containing `docs/machine/PROMPTS/` files)
- `SHEET_ID`
- `SHEET_NAME` (optional, default: `Product Requests`)
- `INTAKE_EMAIL`
- `MRD_TEMPLATE_DOC_ID`
- `DRIVE_PARENT_FOLDER_ID`
- `PROCESSED_LABEL` (optional, default: `Origin/Processed`)
- `CLARIFICATION_LABEL` (optional, default: `Origin/Clarification`)

---

## 5. Install Time-Driven Triggers

In **Apps Script → Triggers**:

- `processNewEmails` → Every 5 minutes
- `processClarificationReplies` → Every 10 minutes

---

## 6. Quick Test

1. Send an email to the intake address with a complete product request
2. Confirm a row appears in the sheet and a confirmation email is sent
3. If gaps exist, confirm clarification email is sent
4. If no gaps, confirm an MRD Doc is created and linked

---

## 7. Troubleshooting

- **No rows added:** Verify `SHEET_ID`, `SHEET_NAME`, and trigger permissions
- **Gemini errors:** Check `GEMINI_API_KEY` and that prompt files are reachable
- **Emails not found:** Confirm intake address and Gmail search query scope
- **Doc not created:** Verify `MRD_TEMPLATE_DOC_ID` and `DRIVE_PARENT_FOLDER_ID`

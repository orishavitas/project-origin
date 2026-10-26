# Project Origin - MVP Specification

> **Version:** 1.0  
> **Target:** 4-6 week build  
> **Last Updated:** January 2025

---

## 1. MVP Definition

The MVP proves the core value proposition: **automated intake and MRD generation from Sheet requests.**

### 1.1 In Scope

- ✅ Email intake monitoring
- ✅ Request parsing and gap analysis
- ✅ Google Sheets row creation
- ✅ Clarification loop (1 round)
- ✅ Basic competitive research
- ✅ MRD draft generation (Google Doc)
- ✅ Draft notification to requestor

### 1.2 Out of Scope (Phase 2+)

- ⏳ Multiple revision rounds
- ⏳ PRD generation
- ⏳ Meeting scheduling
- ⏳ Project folder creation
- ⏳ Escalation automation
- ⏳ Stale request handling

---

## 2. Technical Architecture
> **Machine Reference:** [`ORIGIN.md`](../machine/ORIGIN.md) §Context

### 2.1 Component Overview

| Component | Tool | Purpose |
|-----------|------|---------|
| Automation Engine | Google Apps Script | Workflow orchestration, triggers, API calls |
| Task Tracking | Google Sheets | Request status, assignment, history |
| Document Storage | Google Drive | MRD storage, sharing, versioning |
| AI Processing | Gemini API | Parsing, research, MRD generation |
| Email | Gmail API | Intake monitoring, sending responses |

### 2.2 Data Flow

```
[Email Intake]
     ↓
[Apps Script Trigger]
     ↓
[Gemini: Parse Request] ←── PROMPTS/01_parse_request.md
     ↓
[Google Sheets: Create Row]
     ↓
[Gemini: Gap Analysis] ←── PROMPTS/02_gap_analysis.md
     ↓
[Gaps Found?]
  ├─ YES → [Update Sheet with Questions] ←── (Questions generated in Step 2)
  │            ↓
  │        [Wait for Reply]
  │            ↓
  └─ NO ──────┴───→ [Gemini: Research] ←── PROMPTS/04_research.md
                        ↓
                    [Gemini: Generate MRD] ←── PROMPTS/05_generate_mrd.md
                        ↓
                    [Google Drive: Create Doc]
                        ↓
                    [Send Notification Email]
```

---

## 3. Google Apps Script Workflow Specifications
> **Machine Reference:** [`PROMPTS/`](../machine/PROMPTS/) for Gemini API payloads

### 3.1 Script 1: Email Intake

**Trigger:** Time-driven trigger (poll every 5 minutes)  
**Filter:** Emails to product-requests@compulocks.com

| Step | Script Function | Action |
|------|-----------------|--------|
| 1 | `processNewRequests()` | Poll Sheet for new requests |
| 2 | - | (Logic folded into processNewRequests) |
| 3 | `callGemini()` | Parse request → [`01_parse_request.md`](../machine/PROMPTS/01_parse_request.md) |
| 4 | `appendRequestRow()` | Add row with parsed data |
| 5 | - | (Acknowledgment via Sheet status update) |
| 6 | `callGemini()` | Gap analysis → [`02_gap_analysis.md`](../machine/PROMPTS/02_gap_analysis.md) |
| 7 | `hasCriticalGaps()` | Check for critical gaps |
| 8 | `updateRequestRow()` | Write clarification questions to sheet |

### 3.2 Script 2: Clarification Response Handler

**Trigger:** Time-driven trigger (poll for replies)

| Step | Script Function | Action |
|------|-----------------|--------|
| 1 | `processClarificationUpdates()` | Poll Sheet for updated requests |
| 2 | `findRequestRowByThreadId()` | Lookup row by Thread ID |
| 3 | `callGemini()` | Merge new info with existing data |
| 4 | `updateRequestRow()` | Update row with merged data |
| 5 | `queueMrdGeneration()` | Trigger Script 3 |

### 3.3 Script 3: MRD Generation

**Trigger:** Script queue or status change in sheet

| Step | Script Function | Action |
|------|-----------------|--------|
| 1 | `getRequestRow()` | Get row data |
| 2 | `callGemini()` | Competitive research → [`04_research.md`](../machine/PROMPTS/04_research.md) |
| 3 | `callGemini()` | Generate MRD → [`05_generate_mrd.md`](../machine/PROMPTS/05_generate_mrd.md) |
| 4 | `createMrdDoc()` | Create document from template |
| 5 | `populateMrdDoc()` | Populate with MRD content |
| 6 | `updateRequestRow()` | Update row: doc link, status = "Draft Ready" |
| 7 | `sendDraftNotification()` | Send draft notification |

---

## 4. Google Sheets Configuration

### 4.1 Sheet: Product Requests

**Columns:**

| Column | Type | Purpose |
|--------|------|---------|
| Request Name | Text | Product concept (from email subject) |
| Status | Dropdown | New / Clarification / Research / Draft Ready / Review / Approved / Rejected |
| Requestor | Text | Who submitted (name/email) |
| Requestor Email | Email | For external notifications |
| Department | Dropdown | Sales / Marketing / R&D |
| Target Market | Text | Retail, Hospitality, Healthcare, etc. |
| Target Price | Number | USD target price point |
| Priority | Dropdown | High / Medium / Low |
| MRD Link | Link | Google Doc URL |
| Email Thread ID | Text | For reply matching (hidden/protected) |
| Raw Request | Text | Original request text |
| Parsed Data | JSON | JSON from Gemini parsing |
| Scope Flags | Text | Any scope concerns flagged |
| Created | Date | Auto timestamp |
| Last Updated | Date | Auto timestamp |

**Tabs/Views:**
- All Requests
- Active (Status != Completed/Rejected)
- Pending Clarification
- Draft Ready

---

## 5. Google Drive Structure

```
📁 Product Research/
  📁 _Templates/
    📄 MRD_Template.gdoc
    📄 PRD_Template.gdoc (Phase 2)
  📁 Active Requests/
    📁 [YYYY-MM] [Product Name]/
      📄 MRD - [Product Name].gdoc
      📁 Research/
        📄 Competitive Analysis.gdoc
  📁 Archive/
    📁 Approved/
    📁 Rejected/
```

**Naming Convention:**
- Folder: `[YYYY-MM] [Product Name]` (e.g., "2025-01 AI Floor Stand")
- MRD: `MRD - [Product Name]`
- Versions: Use Google Docs version history, not separate files

---

## 6. Gemini API Integration
> **Machine Reference:** [`PROMPTS/`](../machine/PROMPTS/) for full prompt specifications

### 6.1 API Configuration

| Setting | Value |
|---------|-------|
| Model | gemini-1.5-pro-latest |
| Max Output Tokens | 8192 |
| Temperature | 0.2 (parsing), 0.7 (research/generation) |
| Endpoint | https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent |

### 6.2 Apps Script Request Template

```javascript
const response = UrlFetchApp.fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
  {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    })
  }
);
```

---

## 7. Testing Plan

### 7.1 Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-01 | Complete request with all details | Sheet row updated, MRD generated, no clarification needed |
| TC-02 | Request missing target market | Sheet status 'Needs Clarification', Questions column updated |
| TC-03 | Request for non-standard product category | Processed with scope flag in Google Sheets |
| TC-04 | Clarification reply received | Sheet row updated, MRD generation triggered |
| TC-05 | MRD generated for standard product | Google Doc created with all 12 sections populated |
| TC-06 | Email from unknown sender | Processed normally, department = Unknown |
| TC-07 | Duplicate request (same thread) | Ignored, no duplicate item created |
| TC-08 | API timeout during processing | Retry occurs, eventually succeeds or fails gracefully |

### 7.2 Pilot Users

Start with 3-5 internal users:
- 1-2 from Sales
- 1 from Marketing
- 1-2 from R&D

---

## 8. Implementation Checklist

### Week 1-2: Setup

- [ ] Create dedicated intake Form (or Sheet)
- [ ] Set up Google Sheets with columns
- [ ] Create Google Drive folder structure
- [ ] Copy MRD template to Templates folder
- [ ] Set up Google Apps Script project
- [ ] Configure API credentials (Gemini, Gmail, Drive, Sheets)

### Week 2-3: Build Workflows

- [ ] Build Script 1: Email Intake
- [ ] Build Script 2: Clarification Handler
- [ ] Build Script 3: MRD Generation
- [ ] Test each workflow in isolation

### Week 3-4: Integration & Testing

- [ ] Connect workflows end-to-end
- [ ] Run all test cases
- [ ] Fix bugs and edge cases
- [ ] Tune Gemini prompts based on output quality

### Week 4-5: Pilot

- [ ] Onboard pilot users
- [ ] Process real requests
- [ ] Gather feedback
- [ ] Iterate on issues

### Week 5-6: Stabilization

- [ ] Address pilot feedback
- [ ] Document procedures
- [ ] Prepare for wider rollout

---

*Cross-reference: Implementation details are encoded in machine-readable format at [`docs/machine/`](../machine/)*

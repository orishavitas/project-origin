# Project Origin - MVP Specification

> **Version:** 1.0  
> **Target:** 4-6 week build  
> **Last Updated:** January 2025

---

## 1. MVP Definition

The MVP proves the core value proposition: **automated intake and MRD generation from email requests.**

### 1.1 In Scope

- ✅ Email intake monitoring
- ✅ Request parsing and gap analysis
- ✅ Monday.com item creation
- ✅ Clarification email workflow (1 round)
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
| Automation Engine | n8n | Workflow orchestration, triggers, API calls |
| Task Tracking | Monday.com | Request status, assignment, history |
| Document Storage | Google Drive | MRD storage, sharing, versioning |
| AI Processing | Claude API | Parsing, research, MRD generation |
| Email | Gmail API | Intake monitoring, sending responses |

### 2.2 Data Flow

```
[Email Intake]
     ↓
[n8n Trigger]
     ↓
[Claude: Parse Email] ←── PROMPTS/01_parse_email.md
     ↓
[Monday.com: Create Item]
     ↓
[Claude: Gap Analysis] ←── PROMPTS/02_gap_analysis.md
     ↓
[Gaps Found?]
  ├─ YES → [Send Clarification Email] ←── PROMPTS/03_clarification.md
  │            ↓
  │        [Wait for Reply]
  │            ↓
  └─ NO ──────┴───→ [Claude: Research] ←── PROMPTS/04_research.md
                          ↓
                    [Claude: Generate MRD] ←── PROMPTS/05_generate_mrd.md
                          ↓
                    [Google Drive: Create Doc]
                          ↓
                    [Send Notification Email]
```

---

## 3. n8n Workflow Specifications
> **Machine Reference:** [`PROMPTS/`](../machine/PROMPTS/) for Claude API payloads

### 3.1 Workflow 1: Email Intake

**Trigger:** Gmail Trigger (poll every 5 minutes)  
**Filter:** Emails to product-requests@compulocks.com

| Step | Node Type | Action |
|------|-----------|--------|
| 1 | Gmail Trigger | Poll inbox for new emails |
| 2 | Filter | Check if email is new request (not reply) |
| 3 | HTTP Request (Claude) | Parse email → [`01_parse_email.md`](../machine/PROMPTS/01_parse_email.md) |
| 4 | Monday.com | Create item with parsed data |
| 5 | Gmail | Send acknowledgment email |
| 6 | HTTP Request (Claude) | Gap analysis → [`02_gap_analysis.md`](../machine/PROMPTS/02_gap_analysis.md) |
| 7 | IF | Check for critical gaps |
| 8 | Gmail (conditional) | Send clarification request → [`03_clarification.md`](../machine/PROMPTS/03_clarification.md) |

### 3.2 Workflow 2: Clarification Response Handler

**Trigger:** Gmail Trigger (replies to clarification emails)

| Step | Node Type | Action |
|------|-----------|--------|
| 1 | Gmail Trigger | Poll for reply emails (thread ID match) |
| 2 | Monday.com | Get existing item by thread ID |
| 3 | HTTP Request (Claude) | Merge new info with existing data |
| 4 | Monday.com | Update item with merged data |
| 5 | Webhook | Trigger Workflow 3 |

### 3.3 Workflow 3: MRD Generation

**Trigger:** Webhook from Workflow 1/2 or Monday.com status change

| Step | Node Type | Action |
|------|-----------|--------|
| 1 | Monday.com | Get item data |
| 2 | HTTP Request (Claude) | Competitive research → [`04_research.md`](../machine/PROMPTS/04_research.md) |
| 3 | HTTP Request (Claude) | Generate MRD → [`05_generate_mrd.md`](../machine/PROMPTS/05_generate_mrd.md) |
| 4 | Google Docs | Create document from template |
| 5 | Google Docs | Populate with MRD content |
| 6 | Monday.com | Update item: doc link, status = "Draft Ready" |
| 7 | Gmail | Send draft notification |

---

## 4. Monday.com Configuration

### 4.1 Board: Product Requests

**Columns:**

| Column | Type | Purpose |
|--------|------|---------|
| Request Name | Text | Product concept (from email subject) |
| Status | Status | New Request / Clarification Sent / In Research / Draft Ready / Under Review / Approved / Rejected |
| Requestor | People | Who submitted (auto-linked if in Monday) |
| Requestor Email | Email | For external notifications |
| Department | Dropdown | Sales / Marketing / R&D |
| Target Market | Tags | Retail, Hospitality, Healthcare, etc. |
| Target Price | Numbers | USD target price point |
| Priority | Status | High / Medium / Low |
| MRD Link | Link | Google Doc URL |
| Email Thread ID | Text | For reply matching (hidden) |
| Raw Request | Long Text | Original email body |
| Parsed Data | Long Text | JSON from Claude parsing |
| Scope Flags | Tags | Any scope concerns flagged |
| Created | Date | Auto timestamp |
| Last Updated | Date | Auto timestamp |

**Groups:**
- Active Requests
- Pending Clarification
- In Research
- Ready for Review
- Completed
- Archive

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

## 6. Claude API Integration
> **Machine Reference:** [`PROMPTS/`](../machine/PROMPTS/) for full prompt specifications

### 6.1 API Configuration

| Setting | Value |
|---------|-------|
| Model | claude-sonnet-4-20250514 |
| Max Tokens | 4096 (parsing), 8192 (MRD generation) |
| Temperature | 0.3 (parsing), 0.5 (research/generation) |
| Endpoint | https://api.anthropic.com/v1/messages |

### 6.2 n8n HTTP Request Template

```json
{
  "method": "POST",
  "url": "https://api.anthropic.com/v1/messages",
  "headers": {
    "x-api-key": "{{ $credentials.claudeApiKey }}",
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  },
  "body": {
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 4096,
    "system": "[Load from ORIGIN.md]",
    "messages": [{"role": "user", "content": "[Load from PROMPTS/XX.md]"}]
  }
}
```

---

## 7. Testing Plan

### 7.1 Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-01 | Complete request email with all details | Monday item created, MRD generated, no clarification needed |
| TC-02 | Request email missing target market | Clarification email sent asking for market |
| TC-03 | Request for non-standard product category | Processed with scope flag in Monday.com |
| TC-04 | Clarification reply received | Monday item updated, MRD generation triggered |
| TC-05 | MRD generated for standard product | Google Doc created with all 12 sections populated |
| TC-06 | Email from unknown sender | Processed normally, department = Unknown |
| TC-07 | Duplicate email (same thread) | Ignored, no duplicate item created |
| TC-08 | API timeout during processing | Retry occurs, eventually succeeds or fails gracefully |

### 7.2 Pilot Users

Start with 3-5 internal users:
- 1-2 from Sales
- 1 from Marketing
- 1-2 from R&D

---

## 8. Implementation Checklist

### Week 1-2: Setup

- [ ] Create dedicated intake email address
- [ ] Set up Monday.com board with columns
- [ ] Create Google Drive folder structure
- [ ] Copy MRD template to Templates folder
- [ ] Set up n8n instance (cloud or self-hosted)
- [ ] Configure API credentials (Claude, Gmail, Google Drive, Monday.com)

### Week 2-3: Build Workflows

- [ ] Build Workflow 1: Email Intake
- [ ] Build Workflow 2: Clarification Handler
- [ ] Build Workflow 3: MRD Generation
- [ ] Test each workflow in isolation

### Week 3-4: Integration & Testing

- [ ] Connect workflows end-to-end
- [ ] Run all test cases
- [ ] Fix bugs and edge cases
- [ ] Tune Claude prompts based on output quality

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

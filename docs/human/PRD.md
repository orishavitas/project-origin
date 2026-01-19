# Project Origin - Product Requirements Document

> **Version:** 1.0  
> **Owner:** Ori Shavit, R&D  
> **Status:** Draft  
> **Last Updated:** January 2025

---

## 1. Executive Summary

Project Origin automates Compulocks' product research workflow. The system receives requests via email, gathers missing information, conducts market research, and generates MRDs from templates—reducing manual overhead while ensuring consistent documentation quality.

**Core value:** Transform unstructured product ideas into structured, actionable MRDs ready for senior management review.

---

## 2. Problem Statement

### Current State
- Product research requests arrive through multiple channels with inconsistent information
- R&D manually gathers market data, competitive analysis, and customer requirements
- MRD creation is time-consuming; quality varies by author
- No standardized intake means requests fall through cracks
- Approval workflow relies on manual scheduling and follow-up

### Desired State
- Single intake point with structured data collection
- Automated research gathering and competitive analysis
- Consistent, template-based MRD generation
- Automated workflow from intake to senior management review
- Complete audit trail and organized project folders

---

## 3. Users & Stakeholders

| User | Role | Primary Interaction |
|------|------|---------------------|
| Sales Team | Submit requests from customer feedback | Email intake, review drafts |
| Marketing Team | Submit requests from market opportunities | Email intake, review drafts |
| R&D Team | Submit technical requests, review/refine MRDs | Email, Monday.com, revision workflow |
| Head of R&D | Present final PRDs to senior management | Review queue, meeting scheduler |
| Senior Management | Approve/reject product concepts | Meeting attendance, decisions |

---

## 4. Functional Requirements

### 4.1 Intake System
> **Machine Reference:** [`PROMPTS/01_parse_email.md`](../machine/PROMPTS/01_parse_email.md), [`SCHEMAS/request.json`](../machine/SCHEMAS/request.json)

- Monitor dedicated intake email (product-requests@compulocks.com)
- Parse product concept, target market, use case, specifications from email body and attachments
- Identify requestor department from email signature/domain
- Create Monday.com item for every request with timestamp and source

### 4.2 Information Gathering
> **Machine Reference:** [`PROMPTS/02_gap_analysis.md`](../machine/PROMPTS/02_gap_analysis.md), [`PROMPTS/03_clarification.md`](../machine/PROMPTS/03_clarification.md)

- Compare request against MRD template requirements to identify gaps
- Send structured follow-up emails for missing details (max 5 questions, max 2 rounds)
- Track responses and update request record
- Escalate stale requests after 7 days

### 4.3 Market Research
> **Machine Reference:** [`PROMPTS/04_research.md`](../machine/PROMPTS/04_research.md)

- Search and document competing products from known competitors
- Gather pricing data for comparable products
- Identify target verticals and estimate market opportunity
- Flag potential IP concerns for R&D review

### 4.4 Document Generation
> **Machine Reference:** [`PROMPTS/05_generate_mrd.md`](../machine/PROMPTS/05_generate_mrd.md), [`SCHEMAS/mrd_output.json`](../machine/SCHEMAS/mrd_output.json)

- Populate MRD template with gathered information (12-section format)
- Generate preliminary PRD from approved MRD (Phase 2)
- Maintain revision history with timestamps and change summaries
- Create documents in designated Drive folder with proper naming

### 4.5 Review Workflow

- Email requestor when draft MRD is ready
- Accept revision requests via email reply
- Update MRD based on feedback and notify of changes
- Record requestor approval and advance to next stage

### 4.6 Approval Process (Phase 2+)

- Maintain queue of MRDs ready for senior management review
- Integrate with calendar to schedule review meetings
- Capture approve/reject/revise decisions with notes
- Create structured project folder upon approval

---

## 5. Validation & Safety Rules
> **Machine Reference:** [`ORIGIN.md`](../machine/ORIGIN.md) §Safety Rules, [`SCHEMAS/validation_rules.json`](../machine/SCHEMAS/validation_rules.json)

### 5.1 Scope Validation

All requests are accepted for processing. Scope concerns are flagged, not blocked:

| Flag Level | Condition | Action |
|------------|-----------|--------|
| 🟢 Green | Fits product line (enclosures, mounts, stands, locks, charging) | Standard processing |
| 🟡 Yellow | Outside typical categories, low MOQ signals, unusual materials | Note in MRD, continue |
| 🔴 Red | Requestor insists after yellow flag, IP concerns | Process + notify Senior R&D Designer |

### 5.2 Escalation Triggers

| Condition | Notify |
|-----------|--------|
| Requestor insists on out-of-scope (1st time) | Senior R&D Designer |
| Repeated boundary violations (3+) | IT, Regional Sales Mgr, SVP Marketing, SVP Sales |
| Request stale >7 days | Requestor (reminder) |
| Request stale >14 days | Department head |

### 5.3 MRD Completion Criteria

MRD is valid when all 12 sections have content:
1. Purpose & Vision
2. Problem Statement
3. Target Market & Use Cases
4. Target Users
5. Product Description
6. Key Requirements
7. Design & Aesthetics
8. Target Price
9. Risks and Thoughts
10. Competition to Review
11. Additional Considerations
12. Success Criteria

---

## 6. System Architecture
> **Machine Reference:** [`ORIGIN.md`](../machine/ORIGIN.md) §Context

| Component | Technology | Purpose |
|-----------|------------|---------|
| Automation Engine | n8n | Workflow orchestration, triggers, API calls |
| Task Tracking | Monday.com | Request status, assignment, history |
| Document Storage | Google Drive | MRD storage, sharing, versioning |
| AI Processing | Claude API | Parsing, research, MRD generation |
| Email | Gmail API | Intake monitoring, responses |
| Calendar | Google Calendar | Meeting scheduling (Phase 2) |

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Request-to-Draft Time | < 48 hours | Monday.com timestamps |
| MRD Completion Rate | > 90% | Completed vs. abandoned |
| Revision Cycles | < 3 average | Version count |
| Requestor Satisfaction | > 4/5 rating | Post-approval survey |
| Senior Management Approval Rate | > 70% | Approved vs. rejected |

---

## 8. Out of Scope (v1.0)

- Integration with ERP/manufacturing systems
- Automated cost estimation or BOM generation
- CAD/design file generation
- External customer-facing intake
- Multi-language support
- Mobile app interface

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI generates inaccurate competitive data | High | Human review required before approval |
| Email parsing misses key information | Medium | Structured follow-up questions fill gaps |
| Low adoption by requestors | High | Training, clear communication on benefits |
| API rate limits or downtime | Medium | Queue system, retry logic, fallback notifications |
| Confidential data in AI processing | Medium | Claude API data not used for training |

---

## 10. Implementation Timeline

| Phase | Scope | Duration |
|-------|-------|----------|
| **Phase 1 (MVP)** | Email intake, Monday.com integration, basic MRD generation | 4-6 weeks |
| **Phase 2** | Full MRD workflow: research, revisions, approval tracking | 4-6 weeks |
| **Phase 3** | PRD generation, meeting scheduling, project folders | 4-6 weeks |

---

*Cross-reference: This document's requirements are implemented in the machine-readable specifications at [`docs/machine/`](../machine/)*

# ROADMAP.md - Project Origin Implementation

> **Purpose:** Phased implementation plan with milestones  
> **Pattern:** Based on GSD (Get Shit Done) roadmap structure

---

## Overview

```
Phase 1 (MVP)          Phase 2 (Full MRD)       Phase 3 (PRD + Approval)
[4-6 weeks]            [4-6 weeks]              [4-6 weeks]
     │                      │                        │
     ▼                      ▼                        ▼
Sheet → MRD Draft      Revisions + Research     PRD + Meetings + Folders
```

---

## Phase 1: MVP ⬅️ CURRENT

**Goal:** Prove core value - request in, MRD draft out  
**Duration:** 4-6 weeks  
**Status:** 🔵 In Progress

### Milestones

#### 1.1 Infrastructure Setup (Week 1-2)
- [ ] Set up Google Sheets for tracking (Product Requests)
- [ ] Create Google Drive folder structure
- [ ] Copy MRD template to Templates folder
- [ ] Set up Google Apps Script project
- [ ] Configure API credentials (Gemini, Drive, Sheets)

**Deliverable:** Working infrastructure, all APIs connected

#### 1.2 Build Workflows (Week 2-3)
- [ ] Script 1: Request Intake
  - [ ] Time-driven trigger (15 mins)
  - [ ] Gemini parsing (01_parse_request.md)
  - [ ] Google Sheets updates
- [ ] Script 2: Clarification Handler
  - [ ] Gap analysis (02_gap_analysis.md)
  - [ ] Sheet-based questions logic
  - [ ] Response processing
- [ ] Script 3: MRD Generation
  - [ ] Research (04_research.md)
  - [ ] MRD generation (05_generate_mrd.md)
  - [ ] Google Doc creation
  - [ ] Sheet status update (Draft Ready)

**Deliverable:** Three workflows operational in isolation

#### 1.3 Integration & Testing (Week 3-4)
- [ ] Connect workflows end-to-end
- [ ] Run test cases (TC-01 through TC-08)
- [ ] Fix bugs and edge cases
- [ ] Tune prompts based on output quality
- [ ] Document any schema updates

**Deliverable:** End-to-end flow working

#### 1.4 Pilot (Week 4-5)
- [ ] Onboard 3-5 pilot users
- [ ] Process real requests
- [ ] Gather feedback
- [ ] Iterate on issues

**Deliverable:** Real requests processed, feedback collected

#### 1.5 Stabilization (Week 5-6)
- [ ] Address pilot feedback
- [ ] Document procedures
- [ ] Prepare for Phase 2

**Deliverable:** MVP stable, ready for wider use

### Phase 1 Success Criteria
- [ ] Intake working reliably via Sheet
- [ ] MRD drafts generated within 48 hours
- [ ] Pilot users report positive experience
- [ ] <5 critical bugs in production

---

## Phase 2: Full MRD Workflow

**Goal:** Complete MRD lifecycle with revisions and approval tracking  
**Duration:** 4-6 weeks  
**Status:** 🔘 Planned

### Milestones

#### 2.1 Revision Workflow
- [ ] Handle revision requests via Sheet update
- [ ] Update MRD
- [ ] Track revision history
- [ ] Support multiple revision rounds

#### 2.2 Enhanced Research
- [ ] Add web search capability
- [ ] Deeper competitive analysis
- [ ] Price trend tracking
- [ ] Market sizing estimates

#### 2.3 Approval Tracking
- [ ] Capture requestor approval in Sheet
- [ ] Queue approved MRDs for review
- [ ] Track status through Google Sheets
- [ ] Sheet-based notifications/dashboards

#### 2.4 Escalation Automation
- [ ] Implement escalation rules
- [ ] Stale request flagging (7 days)
- [ ] Scope violation tracking

### Phase 2 Success Criteria
- [ ] Full revision cycle working
- [ ] Escalations firing correctly
- [ ] <3 average revision cycles
- [ ] Requestor satisfaction >4/5

---

## Phase 3: PRD + Approval Process

**Goal:** Complete product development workflow  
**Duration:** 4-6 weeks  
**Status:** 🔘 Planned

### Milestones

#### 3.1 PRD Generation
- [ ] Create PRD template
- [ ] Build PRD generation prompt
- [ ] Auto-generate from approved MRD
- [ ] Version control for PRDs

#### 3.2 Meeting Scheduling
- [ ] Calendar integration (Optional)
- [ ] Draft meeting agendas
- [ ] Attach relevant documents
- [ ] Meeting preparation summary

#### 3.3 Project Folder Creation
- [ ] Structured folder template
- [ ] Auto-populate on approval
- [ ] Archive rejected/stale requests
- [ ] Documentation organization

#### 3.4 Reporting & Analytics
- [ ] Dashboard for request status
- [ ] Time-to-completion metrics
- [ ] Approval rate tracking
- [ ] Volume trends

### Phase 3 Success Criteria
- [ ] PRDs generated automatically
- [ ] Project folders organized consistently
- [ ] >70% senior management approval rate

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| AI generates inaccurate data | Medium | High | Human review required | R&D |
| Low adoption by requestors | Medium | High | Training, communication | Ori |
| API rate limits | Low | Medium | Queue system, retry logic | IT |
| Parsing misses info | Medium | Medium | Clarification workflow | System |

---

## Dependencies

| Dependency | Required By | Status | Notes |
|------------|-------------|--------|-------|
| IT: Apps Script approvals | Phase 1.1 | Pending | Workspace permissions/scopes |
| API keys: Gemini | Phase 1.1 | Pending | Google AI Studio / Vertex AI |
| API keys: Google | Phase 1.1 | Pending | Workspace admin |
| MRD template access | Phase 1.1 | ✅ Done | Template reviewed |

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2025-01-19 | Initial roadmap created | Project kickoff |
| 2026-01-22 | Removed email dependencies | Pivot to Sheet-based workflow |

---

*Update this roadmap as phases complete and requirements evolve.*

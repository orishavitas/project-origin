# STATE.md - Project Origin Living Memory

> **Purpose:** Persistent state that survives session boundaries  
> **Updated:** 2025-01-20  
> **Pattern:** Based on GSD (Get Shit Done) state management

---

## Current Position

**Phase:** 1 - MVP  
**Status:** In Progress  
**Last Session:** 2025-01-20  
**Next Action:** Deploy Apps Script project, configure Script Properties, test with real email

---

## Active Decisions

| Decision | Made | Rationale |
|----------|------|-----------|
| Intake email address | Pending | Need IT to create product-requests@compulocks.com |
| Apps Script execution | Pending | Confirm Workspace permissions and quotas |
| Gemini model | gemini-1.5-pro-latest | Balance of speed and quality for MVP |
| Research data source | Deferred | Using Gemini training data for MVP; Perplexity/SerpAPI for Phase 2 |

---

## Blockers

| Blocker | Owner | Status | Notes |
|---------|-------|--------|-------|
| IT: Intake email | IT | Pending | Need product-requests@compulocks.com |
| IT: Apps Script approvals | IT | Pending | Ensure Gmail/Drive/Sheets scopes approved |
| API credentials | Ori | Pending | Gemini API key and Google asset IDs |

---

## Completed Items

| Item | Date | Notes |
|------|------|-------|
| PRD v1.0 | 2025-01-19 | Human + machine docs complete |
| Design Guide v1.0 | 2025-01-19 | Behavior rules defined |
| MVP Spec v1.0 | 2025-01-19 | Implementation plan ready |
| Schema definitions | 2025-01-19 | request.json, parsed_data.json, mrd_output.json |
| Chained prompts | 2025-01-19 | 5 prompts: parse → gap → clarify → research → generate |
| **Apps Script modules** | 2025-01-20 | Intake, clarification, MRD generation scripts |
| **Setup documentation** | 2025-01-20 | Apps Script setup guide |

---

## Session Log

### Session 2 - 2025-01-20
**Focus:** Apps Script workflow implementation

**Completed:**
- Created Apps Script modules for intake, clarification handling, and MRD generation
- Email intake with Gmail polling, Gemini parsing, Sheets integration, gap analysis, conditional clarification
- Clarification reply handler with thread matching, data merging, second-round handling
- MRD generation with research, document formatting, Google Docs creation, notification
- Created Apps Script setup guide with triggers and Script Properties
- Updated README with workflow documentation

**Technical Decisions:**
- Load prompts from Drive for centralized prompt management
- Use time-driven triggers for polling and retries
- Include fallback/error handling for Gemini and Drive APIs
- Temperature 0.3 for parsing, 0.5 for research/generation
- Max tokens: 4096 for parsing/research, 8192 for MRD generation

**Known Limitations Documented:**
- Research uses Claude's training data, not live search
- Prices in competitive analysis may be outdated
- Clarification reply matching depends on Gmail thread IDs

**Next Session:**
- Get IT to set up intake email
- Configure Script Properties and test workflows
- Run end-to-end test with real email

---

### Session 1 - 2025-01-19
**Focus:** Documentation and specification  
**Completed:**
- Created human-readable docs (PRD, Design Guide, MVP Spec)
- Created machine-readable specs (ORIGIN.md, schemas, prompts)
- Established cross-reference pattern between human/machine docs

**Decisions Made:**
- Split docs into human/ and machine/ directories
- Use JSON schemas for validation
- Implement chained prompting (5 steps)

---

## Context for Next Session

When resuming work on Project Origin:

1. **Apps Script code is ready** in `src/apps_script/` - copy into Apps Script editor
2. **Follow SETUP_GAS.md** for Script Properties and triggers
3. **Test sequence:** intake → clarification → MRD generation

**Key files to reference:**
- `docs/human/SETUP_GAS.md` - Full setup instructions
- `docs/human/MVP_SPEC.md` - Implementation checklist

**Open questions:**
- IT availability for email setup?
- Confirm Apps Script quota/permissions with IT?
- Pilot user list finalized?
- Do we need Perplexity/SerpAPI for real-time research in MVP or Phase 2?

---

## Metrics (Future)

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| Request-to-Draft Time | <48h | N/A | Not yet measuring |
| MRD Completion Rate | >90% | N/A | Not yet measuring |
| Revision Cycles | <3 avg | N/A | Not yet measuring |
| Gemini API cost/MRD | <$0.25 | ~$0.15-0.20 | Estimated from token counts |

---

*This file is updated after each work session. Load it at the start of new sessions for context continuity.*

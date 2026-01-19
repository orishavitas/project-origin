# STATE.md - Project Origin Living Memory

> **Purpose:** Persistent state that survives session boundaries  
> **Updated:** Automatically after each work session  
> **Pattern:** Based on GSD (Get Shit Done) state management

---

## Current Position

**Phase:** 1 - MVP  
**Status:** Not Started  
**Last Session:** N/A  
**Next Action:** Set up infrastructure (intake email, Monday.com board)

---

## Active Decisions

| Decision | Made | Rationale |
|----------|------|-----------|
| Intake email address | Pending | Need IT to create product-requests@compulocks.com |
| n8n hosting | Pending | Cloud vs. self-hosted TBD based on IT capacity |
| Claude model | claude-sonnet-4-20250514 | Balance of speed and quality for MVP |

---

## Blockers

| Blocker | Owner | Status | Notes |
|---------|-------|--------|-------|
| None currently | - | - | - |

---

## Completed Items

| Item | Date | Notes |
|------|------|-------|
| PRD v1.0 | 2025-01-19 | Human + machine docs complete |
| Design Guide v1.0 | 2025-01-19 | Behavior rules defined |
| MVP Spec v1.0 | 2025-01-19 | Implementation plan ready |
| Schema definitions | 2025-01-19 | request.json, parsed_data.json, mrd_output.json |
| Chained prompts | 2025-01-19 | 5 prompts: parse → gap → clarify → research → generate |

---

## Session Log

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

**Next Session:**
- Set up intake email
- Create Monday.com board
- Configure n8n instance

---

## Context for Next Session

When resuming work on Project Origin:

1. **Human docs** are in `docs/human/` - stakeholder-readable
2. **Machine docs** are in `docs/machine/` - AI-executable
3. **Schemas** define data contracts between workflow steps
4. **Prompts** are chained: 01 → 02 → 03(conditional) → 04 → 05

**Key files to reference:**
- `docs/human/MVP_SPEC.md` - Implementation checklist
- `docs/machine/ORIGIN.md` - System prompt for all Claude calls
- `docs/machine/PROMPTS/` - Individual workflow step prompts

**Open questions:**
- IT availability for email setup?
- Preferred n8n hosting approach?
- Pilot user list finalized?

---

## Metrics (Future)

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| Request-to-Draft Time | <48h | N/A | Not yet measuring |
| MRD Completion Rate | >90% | N/A | Not yet measuring |
| Revision Cycles | <3 avg | N/A | Not yet measuring |

---

*This file is updated after each work session. Load it at the start of new sessions for context continuity.*

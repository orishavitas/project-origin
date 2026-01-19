# Project Origin

**Automated Product Research System for Compulocks**

---

## Quick Navigation

| I want to... | Go to |
|--------------|-------|
| Understand the product | [`docs/human/PRD.md`](docs/human/PRD.md) |
| See AI behavior rules | [`docs/human/DESIGN_GUIDE.md`](docs/human/DESIGN_GUIDE.md) |
| Build the MVP | [`docs/human/MVP_SPEC.md`](docs/human/MVP_SPEC.md) |
| Configure Claude API | [`docs/machine/ORIGIN.md`](docs/machine/ORIGIN.md) |
| See data schemas | [`docs/machine/SCHEMAS/`](docs/machine/SCHEMAS/) |
| Use the prompts | [`docs/machine/PROMPTS/`](docs/machine/PROMPTS/) |
| Check current status | [`STATE.md`](STATE.md) |
| View implementation plan | [`ROADMAP.md`](ROADMAP.md) |

---

## Directory Structure

```
project-origin/
│
├── README.md                 ← You are here
├── STATE.md                  ← Living memory (update after each session)
├── ROADMAP.md                ← Phased implementation plan
│
└── docs/
    ├── human/                ← Stakeholder-readable documents
    │   ├── PRD.md           ← Product Requirements
    │   ├── DESIGN_GUIDE.md  ← Behavior & communication rules
    │   └── MVP_SPEC.md      ← Implementation specification
    │
    └── machine/              ← AI-executable specifications
        ├── ORIGIN.md         ← System prompt for all Claude calls
        ├── COMPETITORS.md    ← Structured competitor data
        │
        ├── SCHEMAS/          ← JSON Schema definitions
        │   ├── request.json       ← Parsed email structure
        │   ├── parsed_data.json   ← Merged request after clarification
        │   ├── mrd_output.json    ← Final MRD structure
        │   └── validation_rules.json ← Programmatic validation rules
        │
        └── PROMPTS/          ← Chained Claude prompts
            ├── 01_parse_email.md    ← Step 1: Parse incoming email
            ├── 02_gap_analysis.md   ← Step 2: Identify missing info
            ├── 03_clarification.md  ← Step 3: Generate clarification email
            ├── 04_research.md       ← Step 4: Competitive research
            └── 05_generate_mrd.md   ← Step 5: Generate MRD
```

---

## Document Relationships

### Human ↔ Machine Cross-References

Human docs reference their machine implementations:

| Human Section | Machine Reference |
|---------------|-------------------|
| PRD §4.1 Intake | `PROMPTS/01_parse_email.md`, `SCHEMAS/request.json` |
| PRD §4.2 Information Gathering | `PROMPTS/02_gap_analysis.md`, `PROMPTS/03_clarification.md` |
| PRD §4.3 Market Research | `PROMPTS/04_research.md` |
| PRD §4.4 Document Generation | `PROMPTS/05_generate_mrd.md`, `SCHEMAS/mrd_output.json` |
| Design Guide §2 Decision Logic | `ORIGIN.md` |
| Design Guide §5 Safety Rules | `ORIGIN.md`, `SCHEMAS/validation_rules.json` |

### Prompt Chain Dependencies

```
01_parse_email
      ↓
02_gap_analysis
      ↓
   [decision]
      ├── "clarify" → 03_clarification → (wait for reply) → 02_gap_analysis
      └── "proceed" → 04_research → 05_generate_mrd
```

---

## How to Use

### For n8n Implementation

1. Load `docs/machine/ORIGIN.md` as the system prompt for all Claude API calls
2. Load the appropriate prompt from `docs/machine/PROMPTS/` as the user message
3. Validate outputs against schemas in `docs/machine/SCHEMAS/`
4. Follow workflow structure in `docs/human/MVP_SPEC.md`

### For Stakeholder Review

1. Share `docs/human/PRD.md` for product understanding
2. Share `docs/human/DESIGN_GUIDE.md` for behavior expectations
3. Share `docs/human/MVP_SPEC.md` for implementation timeline

### For Development Sessions

1. Read `STATE.md` at session start for context
2. Update `STATE.md` at session end with progress
3. Check off items in `ROADMAP.md` as completed

---

## Key Concepts

**Origin:** The AI agent identity. All communications come from "Origin."

**Chained Prompts:** The 5-step workflow breaks complex tasks into focused prompts, each with a specific input/output contract.

**Human/Machine Split:** Human docs explain *what* and *why*. Machine docs specify *how* in AI-executable format.

**Validation Layer:** JSON schemas enforce data contracts between workflow steps. If output doesn't match schema, something is wrong.

---

## Getting Started

1. **Read the PRD** - Understand what we're building
2. **Review MVP Spec** - See the implementation plan
3. **Check ROADMAP** - Know the phases
4. **Update STATE** - Track your progress

---

*Last updated: 2025-01-19*

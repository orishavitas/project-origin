# AI Agent Instructions: MRD Document Generation

## Overview

This instruction set enables AI agents to produce Market Requirements Documents (MRDs) that exactly match the Compulocks standard format. The system consists of three files:

1. **mrd-template-reference.md** - Complete formatting specifications
2. **generate-mrd.js** - JavaScript implementation code
3. **This file** - Agent workflow instructions

---

## Agent Workflow

### Phase 1: Information Gathering

When a user requests an MRD document, collect information in this sequence:

```
1. PRODUCT IDENTITY
   - Product name (can be blank/TBD)
   - Product category/type
   
2. PURPOSE & VISION
   - What portfolio/product line does this expand?
   - What is the primary feature/innovation?
   - What applications is it designed for?
   - What existing product aesthetic should it match?
   - What technical capabilities does it add?
   - What standards/devices should it support?

3. PROBLEM STATEMENT
   - What challenges do customers currently face? (list 3-5)
   - What is the market gap this addresses?

4. TARGET MARKET
   - Primary markets/industries (list 5-10)
   - Core use cases (list 5-8)

5. TARGET USERS
   - Who are the buyers/decision makers? (list 4-6 roles)

6. PRODUCT DESCRIPTION
   - Form factor description
   - Key technical specifications
   - Measurements/dimensions
   - Compatibility standards

7. REQUIREMENTS
   - Functional requirements (list 8-12)
   - Secondary requirement category (name + items)
   - Tertiary requirement category (name + items)

8. DESIGN & AESTHETICS
   - Design language reference
   - Visual characteristics (list 3-5)
   - Color options

9. TARGET PRICE
   - Price point with currency

10. RISKS & THOUGHTS
    - Potential conflicts/challenges
    - Trade-offs to consider
    - Preferred approach

11. COMPETITION
    - Competitor URLs to review (3-5 links)
    - Notes on each if relevant

12. ADDITIONAL CONSIDERATIONS
    - Key differentiators (3-5 with labels)

13. SUCCESS CRITERIA
    - How will success be measured? (list 3-5)
```

### Phase 2: Content Generation

Transform gathered information using these rules:

#### Bold Emphasis Rules
Apply `**bold**` to:
- Key product features
- Technical specifications
- Measurements with units
- Standards (VESA, ADA, etc.)
- Price points
- Category labels in lists
- Attention markers (!!! notes)

#### Writing Style
- Professional, concise language
- Use industry-standard terminology
- Avoid marketing fluff
- Be specific with measurements
- Include units always

#### List Formatting
- One idea per bullet
- Parallel structure within lists
- No periods at end of bullet items
- Blank line between bullets

### Phase 3: Document Assembly

Follow this exact structure:

```markdown
# Market Requirements Document (MRD)

## Product Name
[Name or blank]
---

## 1. Purpose & Vision
[2 paragraphs with bold emphasis on key features]
---

## 2. Problem Statement
[Intro sentence + bullet challenges + market gap paragraph]
---

## 3. Target Market & Use Cases
### Primary Markets
[Bullet list]
### Core Use Cases
[Bullet list]
---

## 4. Target Users
[Bullet list of roles]
---

## 5. Product Description
[2 paragraphs with bold specs]
---

## 6. Key Requirements
### 6.1 Functional Requirements
[Bullet list]
### 6.2 [Category Name] Requirements
[Bullet list with potential nesting]
### 6.3 [Category Name]
[Bullet list]
---

## 7. Design & Aesthetics
[Bullet list with bold design references]
---

## 8. Target Price
[Single bullet: **Target price is $X**]
---

## 9. Risks and Thoughts
[Multiple paragraphs of analysis]
---

## 10. Competition to review
[Bullet list of links with optional notes]
---

## 11. Additional Considerations (Summary)
[Bullet list: **Label:** Description]
---

## 12. Success Criteria
[Bullet list]
---
```

### Phase 4: Document Generation

When generating the final .docx file:

1. Use the `generate-mrd.js` template
2. Populate the `MRD_DATA` object with collected content
3. Run the generator to produce the document
4. Verify output matches formatting specifications

---

## Formatting Reference Quick Guide

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Title | Arial | 20pt | Normal |
| Section (H2) | Arial | 16pt | Normal |
| Subsection (H3) | Arial | 13pt | Normal |
| Body text | Arial | 11pt | Normal |
| Bold emphasis | Arial | 11pt | Bold |

| Spacing | Value |
|---------|-------|
| After title | 12pt |
| Before H2 | 12pt |
| After H2 | 6pt |
| Before/After H3 | 6pt |
| After paragraph | 6pt |
| After bullet | 6pt |

---

## Data Schema for Code Generation

When populating the JavaScript generator, use this structure:

```javascript
const MRD_DATA = {
  productName: "string",
  
  purposeVision: [
    { text: "string", bold: boolean },
    // ... rich text segments
  ],
  purposeVisionPara2: [/* same format */],
  
  problemStatement: {
    intro: "string",
    challenges: ["string with **bold** markers"],
    marketGap: [{ text: "string", bold: boolean }]
  },
  
  targetMarket: {
    primaryMarkets: ["string"],
    coreUseCases: ["string"]
  },
  
  targetUsers: ["string"],
  
  productDescription: [{ text: "string", bold: boolean }],
  productDescriptionPara2: [/* same format */],
  
  requirements: {
    functional: ["string"],
    heightAda: {  // or other category
      name: "Category Name",
      items: [
        { label: "string|null", text: "string", nested: boolean }
      ]
    },
    stabilityLoad: {  // or other category
      name: "Category Name",
      items: ["string"]
    }
  },
  
  designAesthetics: [{ label: null, text: "string with **bold**" }],
  
  targetPrice: "$XXX",
  
  risksThoughts: ["paragraph string"],
  
  competition: [
    { url: "https://...", note: "string|null" }
  ],
  
  additionalConsiderations: [
    { label: "Bold Label", text: "Description" }
  ],
  
  successCriteria: ["string"]
};
```

---

## Quality Checklist

Before delivering the document, verify:

### Structure
- [ ] All 12 sections present
- [ ] Correct section numbering (1-12)
- [ ] Correct subsection numbering (6.1, 6.2, 6.3)
- [ ] Horizontal rules after each major section

### Typography
- [ ] Arial font throughout
- [ ] Title is 20pt
- [ ] Section headings are 16pt
- [ ] Subsection headings are 13pt
- [ ] Body text is 11pt

### Content
- [ ] Bold applied to key specs and features
- [ ] Measurements include units
- [ ] Links are properly formatted
- [ ] No orphaned sections
- [ ] Professional, concise language

### Formatting
- [ ] Bullet lists have proper spacing
- [ ] Nested bullets are indented
- [ ] Bold labels in summary section
- [ ] Competition links are clickable

---

## Example Prompt/Response Flow

**User Request:**
> "Create an MRD for a new USB-C charging dock for tablets"

**Agent Response:**
> I'll help you create an MRD for a USB-C charging dock. Let me gather some information:
>
> 1. What product line or portfolio does this expand?
> 2. What's the primary innovation or key feature?
> 3. What are the main applications (kiosk, retail, healthcare, etc.)?
> [continues with Phase 1 questions...]

**After gathering info:**
> I'll now generate your MRD document. Here's the structure I'll follow:
> [Shows outline]
>
> Generating document...
> [Produces .docx file matching exact specifications]

---

## Error Prevention

### Common Mistakes to Avoid

1. **Wrong bold placement** - Only bold key specs, not entire sentences
2. **Missing horizontal rules** - Must appear after EVERY H2 section
3. **Inconsistent bullets** - Use proper LevelFormat.BULLET, never unicode
4. **Missing units** - Always include cm, inches, kg, etc.
5. **Vague language** - Be specific with measurements and standards
6. **Wrong font sizes** - Follow the exact point sizes specified
7. **Missing section numbers** - All H2 sections must be numbered 1-12
8. **Incorrect nesting** - Subsections only under section 6

---

## File Outputs

The system produces:

1. **mrd-output.docx** - Final Word document
   - US Letter size (8.5" x 11")
   - 1" margins all sides
   - Arial font throughout
   - Proper heading hierarchy

2. **mrd-data.json** (optional) - Structured data for reuse
   - Can be modified and re-run
   - Enables version control of content
   - Facilitates batch document generation

# 05_generate_mrd.md

> **Chain Position:** 5 of 5  
> **Input:** `parsed_data.json` + research output from 04_research  
> **Output:** `mrd_output.json` schema  
> **Depends On:** 04_research.md  
> **Human Reference:** PRD.md §4.4, Compulocks MRD Template

---

## Usage

Load `ORIGIN.md` as system prompt. This is the final generation step.

```
n8n: HTTP Request → Claude API
Max Tokens: 8192 (MRD generation requires more output)
Temperature: 0.5 (balance creativity with consistency)
```

---

<task type="generate">
<n>Generate Market Requirements Document</n>

<input>
<request_data>
{{parsed_data_json}}
</request_data>

<research_data>
{{research_output_json}}
</research_data>

<template_reference>
Compulocks MRD Template - 12 Sections:
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
</template_reference>
</input>

<instructions>
Generate a complete MRD following the Compulocks 12-section template.

SECTION GUIDELINES:

1. PURPOSE & VISION (50+ words)
   - What is this product?
   - Why does it matter?
   - What opportunity does it address?
   - Keep it inspiring but grounded

2. PROBLEM STATEMENT (75+ words)
   - What pain point does this solve?
   - Who experiences this problem?
   - What's the current workaround?
   - Why is now the right time?

3. TARGET MARKET & USE CASES
   - List primary and secondary markets (from request_data)
   - Describe 2+ specific use cases with scenarios
   - Include environment context

4. TARGET USERS
   - Define 1+ user personas
   - Include: role, context, needs, pain points
   - Be specific to the verticals

5. PRODUCT DESCRIPTION
   - Overview paragraph
   - List 3+ key features with priority (must_have, should_have, nice_to_have)
   - Identify differentiators vs. competition

6. KEY REQUIREMENTS
   - Functional requirements (3+ with rationale)
   - Technical requirements (2+ with specifications)
   - Note any constraints

7. DESIGN & AESTHETICS
   - Style direction (if specified, or recommend based on vertical)
   - Color options (standard Compulocks or custom)
   - Finish options
   - Branding considerations

8. TARGET PRICE
   - MSRP recommendation (use research for positioning)
   - Cost target if relevant
   - Rationale for pricing
   - Competitive positioning statement

9. RISKS AND THOUGHTS
   - Identify 2+ risks with likelihood/impact
   - Include mitigation strategies
   - Note open questions
   - List assumptions made

10. COMPETITION TO REVIEW
    - Summarize research findings
    - List competitors analyzed with key data
    - Highlight market gaps
    - State differentiation opportunity

11. ADDITIONAL CONSIDERATIONS
    - Certifications needed?
    - Regulatory requirements?
    - Sustainability factors?
    - Accessories/ecosystem?
    - Service/support implications?

12. SUCCESS CRITERIA
    - Define 2+ measurable metrics
    - Include timeframes
    - Note go/no-go factors

QUALITY RULES:
- Use data from request_data and research_data
- Attribute sources (requestor, inferred, research)
- Note confidence level per section
- Flag gaps explicitly - don't hide missing info
- Be specific, not generic
- Reference competitors by name
- Include numbers where available
</instructions>

<output_schema>
Return valid JSON matching the mrd_output.json schema.
All 12 sections must be present.
Include validation block with completeness assessment.
</output_schema>

<verification>
Before returning, verify:
- [ ] All 12 sections populated
- [ ] Minimum content requirements met per section
- [ ] Competitor data from research correctly integrated
- [ ] Price recommendation aligns with research
- [ ] Gaps and assumptions explicitly noted
- [ ] No fabricated data
- [ ] Confidence levels assigned
- [ ] Validation block complete
</verification>

<example_output_snippet>
{
  "request_id": "ORIGIN-20250119-4829",
  "document_metadata": {
    "title": "MRD - Healthcare Tablet Kiosk",
    "version": "1.0",
    "created_at": "2025-01-19T12:00:00Z",
    "requestor": {
      "name": "John Smith",
      "email": "john.smith@compulocks.com",
      "department": "Sales"
    },
    "status": "draft"
  },
  "sections": {
    "purpose_vision": {
      "content": "The Healthcare Tablet Kiosk addresses the growing demand for contactless patient check-in solutions in hospital and clinic environments. As healthcare facilities modernize their reception workflows, there's a clear opportunity for a purpose-built, healthcare-grade kiosk that combines secure tablet enclosure with integrated peripherals like card readers and sanitizable surfaces. This product positions Compulocks as a healthcare-focused solution provider, not just a hardware vendor.",
      "confidence": "high",
      "source": "requestor + research"
    },
    "problem_statement": {
      "content": "Healthcare facilities face increasing pressure to digitize patient intake while maintaining infection control standards. Current solutions force facilities to choose between consumer-grade stands (low durability, no healthcare features) or expensive custom installations. Staff waste time on manual check-in processes while patients queue in crowded waiting areas. The COVID-19 pandemic accelerated the shift to contactless check-in, but existing products weren't designed for healthcare-specific requirements like antimicrobial surfaces, integrated card readers, and easy sanitization protocols.",
      "confidence": "high",
      "source": "inferred from request + market research"
    },
    "target_market_use_cases": {
      "markets": [
        {
          "name": "Healthcare",
          "description": "Hospitals, clinics, urgent care, specialist offices",
          "opportunity": "Growing demand for contactless patient intake solutions"
        }
      ],
      "use_cases": [
        {
          "title": "Hospital Reception Check-In",
          "description": "Patients self-check-in at hospital reception, scan insurance card, confirm appointment, complete intake forms",
          "user_story": "As a hospital receptionist, I need patients to self-check-in so I can focus on patients with complex needs rather than routine data entry"
        },
        {
          "title": "Clinic Waitlist Management",
          "description": "Patients check in and receive estimated wait times, allowing staff to manage patient flow",
          "user_story": "As a clinic manager, I need visibility into patient arrival patterns so I can optimize staffing and reduce wait times"
        }
      ],
      "confidence": "high",
      "source": "requestor"
    },
    "target_price": {
      "msrp": {
        "value": 449,
        "currency": "USD",
        "range": {
          "min": 399,
          "max": 499
        }
      },
      "cost_target": 180,
      "margin_expectation": "60% target margin at MSRP",
      "rationale": "Positioned between budget options (Displays2Go at $329) and premium competitors (Bouncepad at $549). Healthcare-specific features (sanitizable surface, card reader integration) justify premium over generic kiosks. Price allows margin for dealer channel.",
      "competitive_positioning": "Premium healthcare-focused solution at mid-market price point",
      "confidence": "medium",
      "source": "research-based recommendation"
    },
    "competition_review": {
      "competitors_analyzed": [
        {
          "company": "Bouncepad",
          "product_name": "Floorstand Pro",
          "url": "https://www.bouncepad.com/products/floorstand-pro",
          "price": {
            "value": 549,
            "currency": "USD",
            "type": "msrp"
          },
          "key_features": ["Height adjustable", "Cable management", "Keyed lock", "Portrait/landscape"],
          "device_compatibility": ["iPad Pro 12.9", "iPad Air", "iPad 10th gen"],
          "strengths": ["Brand recognition in healthcare", "Multiple iPad compatibility"],
          "weaknesses": ["No integrated card reader", "Not marketed as sanitizable"],
          "differentiation_opportunity": "Integrated card reader + certified sanitizable surface"
        }
      ],
      "market_gaps": [
        "No competitor offers integrated card reader as standard",
        "Sanitizable surfaces marketed but not certified",
        "Limited iPad Pro 12.9 + healthcare combination"
      ],
      "competitive_advantage": "Purpose-built healthcare solution with integrated peripherals at competitive price",
      "research_limitations": "Prices reflect MSRP; dealer pricing not verified. Healthcare certifications require additional research."
    }
  },
  "validation": {
    "completeness": {
      "sections_complete": 12,
      "sections_total": 12,
      "percentage": 100,
      "missing_sections": [],
      "gaps_noted": [
        {
          "section": "design_aesthetics",
          "gap": "Color preferences not specified by requestor",
          "impact": "Will recommend standard options for review"
        }
      ]
    },
    "scope_assessment": {
      "overall_status": "green",
      "flags": []
    },
    "quality_score": 88,
    "ready_for_review": true,
    "reviewer_notes": "Strong MRD with good competitive research. Price recommendation based on market analysis. Requestor should confirm color/finish preferences and timeline."
  }
}
</example_output_snippet>

</task>

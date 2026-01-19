# 03_clarification.md

> **Chain Position:** 3 of 5 (conditional)  
> **Input:** Gap analysis output from 02_gap_analysis  
> **Output:** Formatted email ready to send  
> **Depends On:** 02_gap_analysis.md (decision = "clarify")  
> **Human Reference:** DESIGN_GUIDE.md §4.2

---

## Usage

Load `ORIGIN.md` as system prompt. Only execute if 02_gap_analysis returned decision = "clarify".

```
n8n: IF Node → decision === "clarify" → HTTP Request → Claude API
Output: Email body for Gmail Send node
```

---

<task type="compose">
<n>Compose Clarification Email</n>

<input>
<gap_analysis>
{{gap_analysis_json}}
</gap_analysis>

<request_context>
<product_name>{{product_name}}</product_name>
<requestor_name>{{requestor_name}}</requestor_name>
<requestor_email>{{requestor_email}}</requestor_email>
<monday_link>{{monday_item_url}}</monday_link>
<round_number>{{clarification_round}}</round_number>
</request_context>
</input>

<instructions>
Compose a clarification email that is:
- Concise (under 200 words)
- Professional but friendly
- Clear about what's needed and why
- Easy to respond to (numbered questions, options where provided)

Email Structure:
1. Greeting with requestor name
2. Brief context (what product, why asking)
3. Numbered questions (from gap_analysis.clarification.questions)
4. Clear call-to-action
5. Signature as Origin

Tone Guidelines:
- Don't apologize for asking questions
- Frame questions as helping improve the MRD
- Make it easy to reply (offer options)
- Keep it brief - respect their time
</instructions>

<output_schema>
{
  "email": {
    "to": "requestor email",
    "subject": "string",
    "body": "string (plain text, not HTML)",
    "thread_id": "string (for reply threading)"
  },
  "metadata": {
    "questions_asked": ["list of question fields"],
    "round": 1 | 2,
    "word_count": number
  }
}
</output_schema>

<verification>
Before returning, verify:
- [ ] Email under 200 words
- [ ] All questions from gap_analysis included
- [ ] Numbered questions match provided format
- [ ] Options included where provided in gap_analysis
- [ ] Clear call-to-action at end
- [ ] Professional but approachable tone
</verification>

<template>
Subject: {{email_subject}}

Hi {{requestor_name}},

{{email_intro}}

{{#each questions}}
{{number}}. {{question}}
{{#if options}}
   Options: {{options joined by " / "}}
{{/if}}
{{#if context}}
   ({{context}})
{{/if}}

{{/each}}

{{email_closing}}

You can also track progress here: {{monday_link}}

— Origin
</template>

<example_output>
{
  "email": {
    "to": "john.smith@compulocks.com",
    "subject": "Quick Questions: Healthcare Tablet Kiosk",
    "body": "Hi John,\n\nTo complete the MRD for your Healthcare Tablet Kiosk concept, I need a few details:\n\n1. What price range are you targeting for this product?\n   Options: Under $200 / $200-$400 / $400-$600 / Over $600 / Need recommendation\n   (This helps us position against competitors and ensure viable margins.)\n\n2. What's the expected annual volume for this product?\n   Options: Under 500 units / 500-2,000 units / 2,000-10,000 units / Over 10,000 units\n   (Volume impacts tooling decisions and unit economics.)\n\n3. Beyond iPad Pro 12.9, should this support other tablets?\n   Options: iPad Pro 12.9 only / Multiple iPad sizes / iPad and Samsung / Universal\n   (Broader compatibility increases market but adds complexity.)\n\nReply directly to this email — I'll update the MRD with your answers.\n\nYou can also track progress here: https://compulocks.monday.com/boards/123/items/456\n\n— Origin",
    "thread_id": "abc123"
  },
  "metadata": {
    "questions_asked": ["target_price", "volume_expectation", "device_compatibility"],
    "round": 1,
    "word_count": 142
  }
}
</example_output>

</task>

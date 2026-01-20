# Origin MVP - n8n Workflow

Simple, flexible workflow that works with any prompt template.

## Setup

1. **Import the workflow**
   - Open n8n
   - Go to Workflows → Import from File
   - Select `origin_mvp_workflow.json`

2. **Add your Anthropic API key**
   - Go to Credentials → Add Credential → Header Auth
   - Name: `Anthropic API Key`
   - Header Name: `x-api-key`
   - Header Value: `your-api-key-here`
   - Update the Claude API node to use this credential

3. **Activate the workflow**

## Usage

Send a POST request to your webhook URL:

```bash
curl -X POST https://your-n8n-instance/webhook/origin \
  -H "Content-Type: application/json" \
  -d '{
    "system_prompt": "You are a helpful assistant. Respond in JSON.",
    "user_prompt": "What is 2+2?"
  }'
```

## Request Format

| Field | Required | Description |
|-------|----------|-------------|
| `system_prompt` | No | Custom system prompt (has default) |
| `user_prompt` | Yes | The user's message/request |
| `template_id` | No | Placeholder for template routing |

## Response Format

```json
{
  "success": true,
  "output": { ... },
  "raw": "raw text response",
  "model": "claude-sonnet-4-20250514",
  "usage": { "input_tokens": 10, "output_tokens": 50 },
  "processed_at": "2026-01-19T00:00:00Z"
}
```

## Templates (Placeholder)

Templates are stored in `templates/`. To use a template:

1. Create a JSON file in `templates/` with your prompt
2. Reference it by `template_id` in your request
3. Extend the "Prepare Prompt" node to load templates

See `templates/example.json` for format.

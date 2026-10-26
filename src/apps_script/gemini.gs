function callGemini(systemPrompt, userPrompt, options) {
  const config = getConfig();
  const generationConfig = {
    temperature: options && typeof options.temperature === "number" ? options.temperature : 0.2,
    maxOutputTokens: options && options.maxOutputTokens ? options.maxOutputTokens : 8192,
    responseMimeType: "application/json"
  };

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${config.apiKey}`;
  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status >= 400) {
    throw new Error(`Gemini API error ${status}: ${body}`);
  }

  const json = JSON.parse(body);
  const text = json.candidates &&
    json.candidates[0] &&
    json.candidates[0].content &&
    json.candidates[0].content.parts &&
    json.candidates[0].content.parts[0] &&
    json.candidates[0].content.parts[0].text;

  if (!text) {
    throw new Error("Gemini response missing text content.");
  }

  return safeJsonParse(text);
}

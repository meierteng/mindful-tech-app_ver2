const GEMINI_API_KEYS = process.env.GEMINI_API_KEYS
  ? process.env.GEMINI_API_KEYS.split(',').map((k) => k.trim())
  : [];

/**
 * Calls the Gemini Pro API with automatic key rotation.
 * @param {string} prompt - The user prompt.
 * @param {Array} history - Chat history (optional).
 * @returns {Promise<string>} - The generated text.
 */
export async function callGemini(prompt, history = []) {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error("No Gemini API keys configured.");
  }

  // Randomly select a starting key index
  let currentKeyIndex = Math.floor(Math.random() * GEMINI_API_KEYS.length);
  let attempts = 0;
  const maxAttempts = GEMINI_API_KEYS.length;

  while (attempts < maxAttempts) {
    const apiKey = GEMINI_API_KEYS[currentKeyIndex];
    try {
      const response = await fetchWithKey(apiKey, prompt, history);
      return response;
    } catch (error) {
      console.error(`Gemini API call failed with key index ${currentKeyIndex}:`, error.message);

      // Check if error is retryable (429, 403 quota, or network error)
      // In a real fetch scenario, we'd check response.status. 
      // Here we assume fetchWithKey throws specific errors or we inspect the error object.
      const isRetryable = error.status === 429 || error.status === 403 || error.name === 'FetchError'; // Simplified check

      if (isRetryable || attempts < maxAttempts - 1) {
        // Rotate to next key
        currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
        attempts++;
        console.log(`Retrying with key index ${currentKeyIndex}...`);
        continue;
      } else {
        // If it was the last key or not retryable (and we want to stop), throw.
        // Requirement says "Throw an error only if all keys fail." so we continue if possible.
        // But if it's a 400 Bad Request, rotation won't fix it. 
        // For now, we'll rotate on any error to be robust as requested, 
        // assuming the prompt itself isn't the issue.
        currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
        attempts++;
      }
    }
  }

  throw new Error("All Gemini API keys failed.");
}

async function fetchWithKey(apiKey, prompt, history) {
  // Using gemini-2.5-pro as requested
  const model = 'gemini-2.5-pro';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  // Transform history to Gemini format if needed
  // Gemini expects contents: [{ role: "user", parts: [{ text: ... }] }, ...]
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add the current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        // maxOutputTokens: 1000,
      }
    })
  });

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No candidates returned from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
}


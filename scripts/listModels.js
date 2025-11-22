const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables manually since we're running a standalone script
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GEMINI_API_KEYS="?([^"\n]+)"?/);
  if (match) {
    // Take the first key
    apiKey = match[1].split(',')[0].trim();
  }
} catch (e) {
  console.error("Could not read .env.local:", e.message);
  process.exit(1);
}

if (!apiKey) {
  console.error("No API Key found in .env.local");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.error("API Error:", json.error.message);
      } else if (json.models) {
        console.log("Available Gemini Models:");
        json.models.forEach(model => {
          if (model.name.includes('gemini')) {
            console.log(`- ${model.name.replace('models/', '')} (${model.displayName})`);
          }
        });
      } else {
        console.log("No models found or unexpected format:", json);
      }
    } catch (e) {
      console.error("Error parsing response:", e.message);
      console.log("Raw response:", data);
    }
  });
}).on('error', (e) => {
  console.error("Network error:", e.message);
});


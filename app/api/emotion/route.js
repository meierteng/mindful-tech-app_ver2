import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEYS?.split(',')[0]?.trim();

/**
 * Lightweight LLM-based emotion classification
 * - Uses a minimal prompt to classify user emotional tone
 * - Returns ONLY one of 5 labels, nothing else
 * - Designed for background visual guidance, not diagnosis
 */

const EMOTION_PROMPT = `You are an emotion classifier for a mindfulness app. Your job is to detect the user's current emotional TONE (not content accuracy) to guide background visuals.

RULES:
1. Output ONLY one word from: calm, anxious, sad, overwhelmed, neutral
2. No explanation, no punctuation, just the single word
3. Default to "neutral" if unclear
4. This is for ambient visuals only, not diagnosis

LABELS:
- calm: stable, peaceful, relaxed, content, at ease
- anxious: worried, tense, nervous, stressed, restless, FOMO
- sad: down, low energy, disappointed, lonely, discouraged
- overwhelmed: flooded, too much, can't cope, burned out
- neutral: factual, unclear, mixed, or no strong emotion

User message: "{USER_MESSAGE}"

Emotion:`;

export async function POST(req) {
  try {
    const { message } = await req.json();
    
    if (!message || message.trim().length < 2) {
      return NextResponse.json({ emotion: 'neutral' });
    }

    // If no API key, fall back to simple keyword detection
    if (!GEMINI_API_KEY) {
      const emotion = simpleKeywordDetection(message);
      return NextResponse.json({ emotion, source: 'keyword' });
    }

    // Call Gemini with minimal prompt
    const prompt = EMOTION_PROMPT.replace('{USER_MESSAGE}', message.slice(0, 200)); // Limit input length
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1, // Low temperature for consistent output
            maxOutputTokens: 10, // We only need one word
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Emotion API failed, using keyword fallback');
      return NextResponse.json({ 
        emotion: simpleKeywordDetection(message), 
        source: 'keyword' 
      });
    }

    const data = await response.json();
    const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || '';
    
    // Validate output is one of our labels
    const validLabels = ['calm', 'anxious', 'sad', 'overwhelmed', 'neutral'];
    const emotion = validLabels.includes(rawOutput) ? rawOutput : 'neutral';

    return NextResponse.json({ emotion, source: 'llm' });

  } catch (error) {
    console.error('Emotion classification error:', error);
    return NextResponse.json({ emotion: 'neutral', source: 'error' });
  }
}

/**
 * Simple keyword fallback when LLM is unavailable
 */
function simpleKeywordDetection(text) {
  const t = text.toLowerCase();
  
  if (/anxious|anxiety|worry|worried|nervous|stressed|panic|scared|afraid|tense|restless|fomo/i.test(t)) {
    return 'anxious';
  }
  if (/sad|down|upset|lonely|depressed|hopeless|cry|tears|empty|hollow|disappointed/i.test(t)) {
    return 'sad';
  }
  if (/overwhelmed|too much|exhausted|burnout|can't cope|drowning|flooded|overloaded/i.test(t)) {
    return 'overwhelmed';
  }
  if (/calm|peaceful|relaxed|serene|tranquil|settled|grounded|better|lighter|at ease/i.test(t)) {
    return 'calm';
  }
  
  return 'neutral';
}


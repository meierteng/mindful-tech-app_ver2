import { NextResponse } from 'next/server';
import { callGemini } from '@/utils/geminiClient';

export async function POST(req) {
  try {
    const { prompt, history, systemPrompt } = await req.json();
    
    // Construct the full history context including the system prompt
    // For Gemini Pro via REST, we can simulate a system prompt by 
    // having the first user message contain the instructions.
    
    let fullHistory = [];
    
    if (systemPrompt) {
      fullHistory.push({
        role: 'user',
        content: `SYSTEM INSTRUCTIONS: ${systemPrompt}\n\nPlease start the session now by welcoming the user.`
      });
      fullHistory.push({
        role: 'model',
        content: "Understood. I am ready to guide the user."
      });
    }

    if (history && history.length > 0) {
      fullHistory = fullHistory.concat(history);
    }

    const responseText = await callGemini(prompt, fullHistory);
    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


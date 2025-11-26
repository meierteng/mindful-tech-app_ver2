import { NextResponse } from 'next/server';
import { callGemini } from '@/utils/geminiClient';

/**
 * Generate MBRP-focused mock response (English)
 */
function generateMockResponse(prompt, systemPrompt, history) {
  const isFirstMessage = !history || history.length === 0;
  const messageCount = history ? history.length : 0;
  
  // Detect session type
  const isDigitalRaisin = systemPrompt?.includes('Digital Raisin') || systemPrompt?.includes('Mindful Holding');
  const isRAIN = systemPrompt?.includes('RAIN');
  const isSOBER = systemPrompt?.includes('SOBER');
  const isUrgeSurfing = systemPrompt?.includes('Urge Surfing') || systemPrompt?.includes('Wave Metaphor');
  const isLeavesOnStream = systemPrompt?.includes('Leaves on a Stream');
  
  let reply = '';
  
  if (isFirstMessage) {
    if (isDigitalRaisin) {
      reply = "Welcome to Day 1. Today we break the autopilot. Please sit comfortably with your phone nearby. Ready?";
    } else if (isRAIN) {
      reply = "Welcome back. Before we start, quick check: Are you feeling Hungry, Angry, Lonely, or Tired right now?";
    } else if (isSOBER) {
      reply = "Hello. Today we're learning SOBER — a portable tool for when you catch yourself doom-scrolling. Ready?";
    } else if (isUrgeSurfing) {
      reply = "Welcome. Today we learn Urge Surfing. An urge to check your phone is like an ocean wave — it rises, peaks, and crashes. We usually drown (give in) or fight it (suppress). Today, we learn to surf. Ready?";
    } else if (isLeavesOnStream) {
      reply = "Welcome to Day 5 — our final session. Today we work with thoughts and plan for the future. Close your eyes and imagine sitting beside a gentle stream. Ready?";
    } else {
      reply = "Welcome. Find a comfortable position. Notice where your body meets the chair. Let me know when you're ready.";
    }
  } else {
    const stage = Math.floor(messageCount / 2);
    
    if (isDigitalRaisin) {
      const steps = [
        "Good. Now pick up your phone, but keep the screen locked and black. We won't turn it on.\n\n[OBSERVE_PHONE]\n\nWhen you're ready, tell me — is it heavy or light?",
        "Now feel the texture. Smooth glass? A rough case? Cool metal edges?\n\n[Pause 10 seconds]\n\nWhat do you notice?",
        "Feel the temperature. Is it cold, warm, or neutral?\n\n[Pause 8 seconds]",
        "Now look at the black screen. Do you notice any impulse to unlock it? Where do you feel that 'itch' — in your thumb, chest, or somewhere else?\n\n[Pause 10 seconds]",
        "This is 'autopilot' — we usually unlock without thinking. Today you broke that pattern just by noticing. What was it like to hold your phone without using it?",
        "Great work today. You've taken the first step in mindful phone use. [SESSION_COMPLETE]"
      ];
      reply = steps[Math.min(stage, steps.length - 1)];
    } else if (isRAIN) {
      const steps = [
        "Thank you. Now close your eyes and imagine hearing a notification sound, or seeing that red dot appear. Let the feeling arise.",
        "This is R — Recognize. Can you name the feeling? Is it Anxiety? FOMO? Curiosity? Just label it.",
        "Good. Now A — Accept. Don't push the feeling away. Let it sit there. It belongs.",
        "Now I — Investigate. Scan your body. Where does this feeling live? Throat tightness? Chest flutter? Stomach knot?",
        "Finally, N — Non-identify. This feeling is a passing event, not 'you'. You are the sky; this feeling is just a cloud passing through.",
        "How did the feeling change as you observed it? Did it get smaller, stay the same, or shift location? [SESSION_COMPLETE]"
      ];
      reply = steps[Math.min(stage, steps.length - 1)];
    } else if (isSOBER) {
      const steps = [
        "Let me teach you SOBER — a 5-step tool you can use anytime. First, let's learn each step:\n\n**S** = Stop (freeze your body)\n**O** = Observe (what am I feeling?)\n**B** = Breathe (3 deep breaths)\n**E** = Expand (whole body awareness)\n**R** = Respond (what do I actually need?)\n\nReady to practice each step?",
        "**S — STOP**\n\nImagine you just noticed yourself mindlessly scrolling. Physically freeze your thumb right now. Hold it still.\n\n[Pause 5 seconds]\n\nGood. What did that feel like?",
        "**O — OBSERVE**\n\nNow ask yourself: What was I doing? What am I feeling right now? Boredom? Loneliness? Avoidance? Just notice without judgment.",
        "**B — BREATHE**\n\nShift all attention to your breath. Let's take 3 deep breaths together, anchored in your belly.\n\n[Pause 15 seconds]\n\nHow do you feel now?",
        "**E — EXPAND**\n\nWiden your awareness to your whole body. Feel your feet on the floor... your seat in the chair... your shoulders... your hands.\n\n[Pause 10 seconds]",
        "**R — RESPOND**\n\nWith this wider awareness — what do you actually need right now? The app? Or maybe water, a stretch, or fresh air?\n\nNow let's practice the full sequence:\n\n[SOBER_PRACTICE]\n\nHow did that feel?",
        "Excellent! SOBER is now yours. Use it whenever you catch the autopilot. [SESSION_COMPLETE]"
      ];
      reply = steps[Math.min(stage, steps.length - 1)];
    } else if (isUrgeSurfing) {
      const steps = [
        "Bring to mind a craving to check your phone. Maybe imagining an unread message or that pull to scroll. Let the urge arise naturally.",
        "Where do you feel this urge in your body? Hands? Jaw? Chest? Stomach? Just locate it.",
        "Good. Now use your breath as your surfboard. Breathe slowly into that area. Don't fight the wave — ride it.\n\n[Pause 15 seconds]",
        "Notice if the urge is peaking now. Don't act. Just watch. Like a wave, it will crest and begin to fall...\n\n[Pause 10 seconds]",
        "Has the wave changed? Is it smaller now, or different in some way?",
        "You just proved that urges pass. What did you learn about cravings? Well done, surfer. Every urge is just a wave you can ride. [SESSION_COMPLETE]"
      ];
      reply = steps[Math.min(stage, steps.length - 1)];
    } else if (isLeavesOnStream) {
      const steps = [
        "Now imagine your thoughts — notifications, tweets, posts — as leaves floating on the water...",
        "You're on the bank. You don't need to grab them. Just watch them drift by. Practice this for a moment with whatever thoughts arise...\n\n[Pause 15 seconds]",
        "How was that? Were you able to let thoughts float by?",
        "Now think about your last 30 minutes of phone use. Was it Nourishing (gave energy, connection) or Depleting (drained you, left you hollow)?",
        "Whatever you noticed, no judgment. Just noticing is progress. For maintenance: Try one 'Phone-Free Walk' this week. Even 10 minutes.",
        "Congratulations on completing the program! Looking back, what's one thing that will stay with you? You now have a toolkit for mindful phone use. Be gentle with yourself. [SESSION_COMPLETE]"
      ];
      reply = steps[Math.min(stage, steps.length - 1)];
    } else {
      const generic = [
        "Good. Take a breath and notice what's present for you right now.",
        "What are you noticing in your body as you sit with this?",
        "Stay with that awareness. There's no need to change anything.",
        "What did you notice directly in your body? Was it pleasant, unpleasant, or neutral?",
        "Thank you for your practice today. [SESSION_COMPLETE]"
      ];
      reply = generic[Math.min(stage, generic.length - 1)];
    }
  }
  
  return reply;
}

/**
 * Main Chat API endpoint
 */
export async function POST(req) {
  try {
    const { prompt, history, systemPrompt } = await req.json();
    
    let fullHistory = [];
    
    if (systemPrompt) {
      fullHistory.push({
        role: 'user',
        content: `SYSTEM INSTRUCTIONS: ${systemPrompt}\n\nPlease start the session now by welcoming the user.`
      });
      fullHistory.push({
        role: 'model',
        content: "Understood. I am ready to guide the user through this mindfulness session."
      });
    }

    if (history && history.length > 0) {
      fullHistory = fullHistory.concat(history);
    }

    let reply;
    let usedMock = false;

    try {
      console.log('🤖 Calling Gemini API...');
      reply = await callGemini(prompt, fullHistory);
      console.log('✅ Gemini API success');
    } catch (geminiError) {
      console.warn('⚠️ Gemini unavailable, using mock mode');
      console.warn('   Reason:', geminiError.message);
      usedMock = true;
      reply = generateMockResponse(prompt, systemPrompt, history);
    }

    const isComplete = reply.includes('[SESSION_COMPLETE]');
    reply = reply.replace('[SESSION_COMPLETE]', '').trim();

    return NextResponse.json({ 
      reply, 
      text: reply,
      mock: usedMock,
      complete: isComplete
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

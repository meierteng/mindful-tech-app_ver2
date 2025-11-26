'use client';

import { useState, useEffect, useRef } from 'react';
import { MBRP_PROGRAMS } from '@/data/mbrpPrompts';
import { useRouter } from 'next/navigation';
import { AUDIO_MAP } from '@/data/audioConfig';
import { useEmotion } from './EmotionContext';

/**
 * Technique Badge - shows current mindfulness technique
 */
const TECHNIQUE_INFO = {
  'Digital Raisin': {
    icon: '📱',
    color: 'from-amber-400 to-orange-500',
    steps: ['Observe', 'Feel', 'Notice Urge', 'Reflect']
  },
  'RAIN': {
    icon: '🌧️',
    color: 'from-blue-400 to-indigo-500',
    steps: ['Recognize', 'Accept', 'Investigate', 'Non-identify']
  },
  'SOBER': {
    icon: '🧘',
    color: 'from-teal-400 to-emerald-500',
    steps: ['Stop', 'Observe', 'Breathe', 'Expand', 'Respond']
  },
  'Urge Surfing': {
    icon: '🌊',
    color: 'from-cyan-400 to-blue-500',
    steps: ['Locate', 'Breathe', 'Ride', 'Release']
  },
  'Leaves on Stream': {
    icon: '🍃',
    color: 'from-green-400 to-teal-500',
    steps: ['Visualize', 'Observe', 'Reflect', 'Plan']
  }
};

function TechniqueBadge({ technique }) {
  const info = TECHNIQUE_INFO[technique];
  if (!info) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${info.color} text-white text-xs font-medium shadow-sm`}>
      <span>{info.icon}</span>
      <span>{technique}</span>
    </div>
  );
}

/**
 * Step Indicator - shows progress through technique steps
 */
function StepIndicator({ technique, currentStep }) {
  const info = TECHNIQUE_INFO[technique];
  if (!info) return null;

  return (
    <div className="flex items-center gap-1 mt-2">
      {info.steps.map((step, idx) => (
        <div
          key={step}
          className={`flex items-center ${idx > 0 ? 'ml-1' : ''}`}
        >
          {idx > 0 && <div className="w-4 h-0.5 bg-gray-200 mr-1" />}
          <div
            className={`px-2 py-0.5 rounded text-xs transition-all ${
              idx <= currentStep
                ? 'bg-teal-100 text-teal-700 font-medium'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Phone Observation Widget - for Day 1 Digital Raisin exercise
 */
function PhoneObservation() {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const observations = [
    { icon: '⚖️', label: 'Weight', question: 'Is it heavy or light?' },
    { icon: '🤚', label: 'Texture', question: 'Smooth? Rough? Cool edges?' },
    { icon: '🌡️', label: 'Temperature', question: 'Cold, warm, or neutral?' },
  ];

  const handleNext = () => {
    if (step < observations.length - 1) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="my-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-center">
        <div className="text-amber-600 font-medium">✓ Observation Complete</div>
        <p className="text-sm text-amber-700 mt-1">You've noticed your phone as an object, not a portal.</p>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{observations[step].icon}</span>
        <div>
          <p className="font-medium text-amber-800">{observations[step].label}</p>
          <p className="text-sm text-amber-600">{observations[step].question}</p>
        </div>
      </div>
      
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-3">
        {observations.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx <= step ? 'bg-amber-500' : 'bg-amber-200'
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all"
      >
        {step < observations.length - 1 ? 'Next →' : 'Done ✓'}
      </button>
    </div>
  );
}

/**
 * SOBER Practice Widget - interactive SOBER walkthrough
 */
function SOBERPractice() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const steps = [
    { letter: 'S', name: 'Stop', instruction: 'Freeze your thumb. Hold completely still.', duration: 3 },
    { letter: 'O', name: 'Observe', instruction: 'What are you feeling right now?', duration: 5 },
    { letter: 'B', name: 'Breathe', instruction: 'Take 3 deep breaths...', duration: 12 },
    { letter: 'E', name: 'Expand', instruction: 'Feel your whole body sitting here.', duration: 8 },
    { letter: 'R', name: 'Respond', instruction: 'What do you actually need?', duration: 5 },
  ];

  useEffect(() => {
    if (!isActive || countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setCountdown(steps[currentStep + 1].duration);
          } else {
            setIsActive(false);
            setIsComplete(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, countdown, currentStep, steps]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setCountdown(steps[0].duration);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="my-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 text-center">
        <div className="text-teal-600 font-medium flex items-center justify-center gap-2">
          <span className="text-2xl">🧘</span>
          SOBER Complete!
        </div>
        <p className="text-sm text-teal-700 mt-1">You've just practiced mindful responding.</p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="my-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <div>
              <p className="font-medium text-teal-800">SOBER Practice</p>
              <p className="text-xs text-teal-600">Guided 5-step exercise (~35 sec)</p>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-all"
          >
            Start ▶
          </button>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const progress = ((currentStep + (1 - countdown / step.duration)) / steps.length) * 100;

  return (
    <div className="my-3 p-5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl text-white shadow-lg">
      {/* Step indicator */}
      <div className="flex justify-center gap-1 mb-4">
        {steps.map((s, idx) => (
          <div
            key={s.letter}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              idx === currentStep
                ? 'bg-white text-teal-600 scale-110'
                : idx < currentStep
                ? 'bg-white/30 text-white'
                : 'bg-white/10 text-white/50'
            }`}
          >
            {s.letter}
          </div>
        ))}
      </div>

      {/* Current step */}
      <div className="text-center">
        <p className="text-xl font-bold mb-1">{step.name}</p>
        <p className="text-white/90 mb-4">{step.instruction}</p>
        <div className="text-4xl font-bold mb-3">{countdown}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Breathing Timer Component - for [Pause X seconds] prompts
 */
function BreathingTimer({ seconds, label }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          setIsComplete(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(seconds);
    setIsComplete(false);
  };

  const progress = ((seconds - timeLeft) / seconds) * 100;

  if (isComplete) {
    return (
      <div className="my-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 text-center">
        <div className="text-emerald-600 font-medium flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Complete ✨
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="my-3 p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🧘</span>
            </div>
            <div>
              <p className="text-sm font-medium text-sky-800">{label || 'Mindful Pause'}</p>
              <p className="text-xs text-sky-600">{seconds} second breathing exercise</p>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-all transform hover:scale-105 shadow-md"
          >
            Start ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
      <div className="text-center">
        <p className="text-sm opacity-80 mb-2">{label || 'Breathe deeply...'}</p>
        
        {/* Circular progress + countdown */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{timeLeft}</span>
          </div>
        </div>

        {/* Breathing cue */}
        <div className="text-lg font-medium animate-pulse">
          {timeLeft % 4 < 2 ? 'Breathe in... 🌬️' : 'Breathe out... 💨'}
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
          <div 
            className="bg-white h-1.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Parse message content and replace special tags with interactive components
 */
function parseMessageWithTimers(content) {
  const patterns = [
    { regex: /\[Pause\s+(\d+)\s+seconds?\]/gi, type: 'timer' },
    { regex: /\[OBSERVE_PHONE\]/gi, type: 'observe_phone' },
    { regex: /\[SOBER_PRACTICE\]/gi, type: 'sober_practice' },
  ];
  
  const parts = [];
  let remaining = content;
  let lastIndex = 0;

  // Find all matches and sort by position
  const allMatches = [];
  for (const pattern of patterns) {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(content)) !== null) {
      allMatches.push({
        type: pattern.type,
        index: match.index,
        length: match[0].length,
        match: match
      });
    }
  }
  
  allMatches.sort((a, b) => a.index - b.index);

  for (const m of allMatches) {
    if (m.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, m.index)
      });
    }
    
    if (m.type === 'timer') {
      parts.push({
        type: 'timer',
        seconds: parseInt(m.match[1], 10),
        label: 'Mindful Pause'
      });
    } else {
      parts.push({ type: m.type });
    }
    
    lastIndex = m.index + m.length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return parts.length > 0 ? parts : [{ type: 'text', content }];
}

/**
 * Render text with markdown-style bold support
 */
function RenderText({ text }) {
  // Simple bold text support: **text** -> <strong>text</strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/**
 * Render message content (with interactive component support)
 */
function MessageContent({ content }) {
  const parts = parseMessageWithTimers(content);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === 'timer') {
          return <BreathingTimer key={idx} seconds={part.seconds} label={part.label} />;
        }
        if (part.type === 'observe_phone') {
          return <PhoneObservation key={idx} />;
        }
        if (part.type === 'sober_practice') {
          return <SOBERPractice key={idx} />;
        }
        // Text content with line breaks and bold support
        return part.content.split('\n').map((line, i) => (
          <p key={`${idx}-${i}`} className="mb-2 last:mb-0 min-h-[1.2em]">
            <RenderText text={line} />
          </p>
        ));
      })}
    </>
  );
}

export default function ChatInterface({ programType, day, systemPrompt, title, audioKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Global emotion state from context (controls fullscreen background)
  const { emotion, setEmotion } = useEmotion();
  
  // Detect current technique from systemPrompt
  const detectTechnique = () => {
    if (!systemPrompt) return null;
    if (systemPrompt.includes('Digital Raisin') || systemPrompt.includes('Mindful Holding')) return 'Digital Raisin';
    if (systemPrompt.includes('RAIN')) return 'RAIN';
    if (systemPrompt.includes('SOBER')) return 'SOBER';
    if (systemPrompt.includes('Urge Surfing') || systemPrompt.includes('Wave Metaphor')) return 'Urge Surfing';
    if (systemPrompt.includes('Leaves on a Stream')) return 'Leaves on Stream';
    return null;
  };
  
  const currentTechnique = detectTechnique();
  
  // Post-Session Survey State
  const [surveyStep, setSurveyStep] = useState('intro'); // 'intro', 'form'
  const [urgeRating, setUrgeRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [takeawayText, setTakeawayText] = useState('');

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const sessionStartedRef = useRef(false); // Prevent duplicate session starts
  const router = useRouter();

  const totalDays = MBRP_PROGRAMS[programType]?.days.length || 1;
  const dayProgress = (day / totalDays) * 100;

  // Audio source resolution
  const audioSrc = AUDIO_MAP[audioKey] || AUDIO_MAP['rain']; // Default to rain if key not found

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-setup audio volume
    if (audioRef.current) {
      audioRef.current.volume = 0.3; 
    }

    // Initial start message (only once)
    const startSession = async () => {
      if (sessionStartedRef.current || messages.length > 0) return;
      sessionStartedRef.current = true;
      
      setLoading(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: "The user has joined. Please greet them and start Step 1.",
            systemPrompt: systemPrompt,
            history: []
          })
        });
        
        if (!res.ok) {
          let errorBody = null;
          try {
            errorBody = await res.json();
          } catch {
            // Response body is not JSON
          }
          console.error("Chat API returned error status:", {
            status: res.status,
            statusText: res.statusText,
            body: errorBody
          });
          throw new Error(`Failed to start session: ${res.status}`);
        }
        
        let data;
        try {
          data = await res.json();
        } catch (parseError) {
          console.error("Failed to parse JSON from /api/chat", parseError);
          throw new Error("Invalid JSON response");
        }

        setMessages([{ role: 'model', content: data.reply || data.text }]);
        setEmotion(data.emotion || "neutral");
      } catch (error) {
        console.error("Error starting session:", error);
        setMessages([{ role: 'model', content: "Hello. I'm ready to guide you. Please say 'Ready' to begin." }]);
      } finally {
        setLoading(false);
      }
    };

    startSession();
  }, [systemPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadHistory = () => {
    const textContent = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful-session-day${day}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFinishSession = () => {
    // Save completion status with survey data
    const history = JSON.parse(localStorage.getItem('session_history') || '[]');
    history.push({
      date: new Date().toISOString(),
      program: programType,
      day: day,
      completed: true,
      messages: messages, // Save full transcript
      survey: {
        urgeRating, // 1-10 scale of urge to use phone
        feedback: feedbackText,
        keyTakeaway: takeawayText
      }
    });
    localStorage.setItem('session_history', JSON.stringify(history));
    
    router.push('/dashboard');
  };

  // Async emotion detection using LLM (non-blocking)
  const detectEmotion = async (message) => {
    try {
      const res = await fetch('/api/emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        const data = await res.json();
        setEmotion(data.emotion || 'neutral');
        console.log(`🎨 Emotion detected: ${data.emotion} (${data.source})`);
      }
    } catch (err) {
      console.warn('Emotion detection failed:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Fire emotion detection in parallel (non-blocking)
    detectEmotion(userMessage);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          systemPrompt: systemPrompt,
          history: messages
        })
      });

      if (!res.ok) {
        let errorBody = null;
        try {
          errorBody = await res.json();
        } catch {
          // Response body is not JSON
        }
        console.error("Chat API returned error status:", {
          status: res.status,
          statusText: res.statusText,
          body: errorBody
        });
        throw new Error(`Failed to send message: ${res.status}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse JSON from /api/chat", parseError);
        throw new Error("Invalid JSON response");
      }

      let aiText = data.reply || data.text;

      // Check for completion signal
      if (aiText.includes("[SESSION_COMPLETE]") || data.complete) {
        setSessionComplete(true);
        aiText = aiText.replace("[SESSION_COMPLETE]", "").trim();
        setProgress(100);
        if (currentTechnique && TECHNIQUE_INFO[currentTechnique]) {
          setCurrentStep(TECHNIQUE_INFO[currentTechnique].steps.length - 1);
        }
      } else {
        // Calculate progress based on message count
        const totalMessages = messages.length + 2;
        const estimatedTotal = 12;
        const newProgress = Math.min(Math.round((totalMessages / estimatedTotal) * 90), 90);
        setProgress(newProgress);
        
        // Update step indicator
        if (currentTechnique && TECHNIQUE_INFO[currentTechnique]) {
          const totalSteps = TECHNIQUE_INFO[currentTechnique].steps.length;
          const newStep = Math.min(Math.floor((totalMessages / estimatedTotal) * totalSteps), totalSteps - 1);
          setCurrentStep(newStep);
        }
      }

      setMessages(prev => [...prev, { role: 'model', content: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Chat card container */}
      <div className="flex flex-col h-[600px] bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/20 relative text-gray-900">
        <audio ref={audioRef} loop src={audioSrc} />

      {/* Header & Progress */}
      <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3 flex-wrap">
             <h2 className="font-semibold text-gray-800">{title}</h2>
             <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">Day {day}/{totalDays}</span>
             {currentTechnique && <TechniqueBadge technique={currentTechnique} />}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={toggleAudio}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition border
                  ${isPlaying ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {isPlaying ? '🔊 Music On' : '🔇 Music Off'}
            </button>
            {messages.length > 2 && (
              <button 
                onClick={downloadHistory}
                className="text-gray-400 hover:text-teal-600 transition"
                title="Download Transcript"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Step Indicator */}
        {currentTechnique && (
          <StepIndicator technique={currentTechnique} currentStep={currentStep} />
        )}

        {/* Session Progress Bar */}
        <div className="flex flex-col gap-1 mt-2">
           <div className="flex justify-between text-xs text-gray-400">
             <span>Session Progress</span>
             <span>{progress}%</span>
           </div>
           <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-500 h-1.5 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-teal-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}
            >
              {msg.role === 'user' ? (
                msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0 min-h-[1.2em]">{line}</p>
                ))
              ) : (
                <MessageContent content={msg.content} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl rounded-bl-none text-sm italic animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Complete */}
      {sessionComplete ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          
          {surveyStep === 'intro' ? (
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Session Complete!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You've taken a great step towards mindful technology use. 
                Let's take a moment to reflect on your experience.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setSurveyStep('form')}
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg transition transform hover:scale-105"
                >
                  Start Reflection
                </button>
                <button 
                   onClick={downloadHistory}
                   className="text-sm text-gray-500 hover:text-teal-600 mt-2 underline"
                >
                  Download Chat Transcript
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl border border-gray-100 overflow-y-auto max-h-[90%]">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Post-Session Check-in</h3>
              
              <div className="space-y-6">
                {/* Q1: Urge Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Right now, how strong is your urge to check your phone for non-essential things?
                  </label>
                  <div className="flex justify-between px-2 text-xs text-gray-400 mb-1">
                    <span>No Urge</span>
                    <span>Strong Urge</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={urgeRating}
                    onChange={(e) => setUrgeRating(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="text-center mt-2 font-bold text-teal-600">{urgeRating} / 10</div>
                </div>

                {/* Q2: Positive Takeaway */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What is one small "Micro-Habit" or idea you want to try next time you pick up your phone?
                  </label>
                  <textarea 
                    value={takeawayText}
                    onChange={(e) => setTakeawayText(e.target.value)}
                    placeholder="e.g., Take one breath before unlocking..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                    rows="2"
                  />
                </div>

                {/* Q3: General Feedback */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Any other thoughts on this session? (Optional)
                  </label>
                  <textarea 
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="I felt calm when..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                    rows="2"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                   <button 
                    onClick={handleFinishSession}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition shadow-md"
                  >
                    Save & Finish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            disabled={loading}
            autoFocus
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-sm"
          >
            Send
          </button>
        </form>
      )}
      </div>
    </div>
  );
}

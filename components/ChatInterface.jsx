'use client';

import { useState, useEffect, useRef } from 'react';
import { MBRP_PROGRAMS } from '@/data/mbrpPrompts';
import { useRouter } from 'next/navigation';
import { AUDIO_MAP } from '@/data/audioConfig';

export default function ChatInterface({ programType, day, systemPrompt, title, audioKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 for current session step
  
  // Post-Session Survey State
  const [surveyStep, setSurveyStep] = useState('intro'); // 'intro', 'form'
  const [urgeRating, setUrgeRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [takeawayText, setTakeawayText] = useState('');

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
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

    // Initial start message
    const startSession = async () => {
      if (messages.length > 0) return;
      
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
        
        if (!res.ok) throw new Error('Failed to start session');
        
        const data = await res.json();
        setMessages([{ role: 'model', content: data.text }]);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          systemPrompt: systemPrompt,
          history: messages
        })
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      let aiText = data.text;

      // Check for completion signal
      if (aiText.includes("[SESSION_COMPLETE]")) {
        setSessionComplete(true);
        aiText = aiText.replace("[SESSION_COMPLETE]", "").trim();
        setProgress(100);
      } else {
         // Simple heuristic: increase progress slightly with each turn, capping at 90% until done
         setProgress(prev => Math.min(prev + 10, 90));
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
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
      <audio ref={audioRef} loop src={audioSrc} />

      {/* Header & Progress */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
             <h2 className="font-semibold text-gray-800">{title}</h2>
             <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">Day {day}/{totalDays}</span>
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
        
        {/* Session Progress Bar */}
        <div className="flex flex-col gap-1">
           <div className="flex justify-between text-xs text-gray-400">
             <span>Session Progress</span>
             <span>{progress}%</span>
           </div>
           <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700 ease-out" 
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
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0 min-h-[1.2em]">{line}</p>
              ))}
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
  );
}

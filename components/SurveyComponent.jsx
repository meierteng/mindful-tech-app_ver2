'use client';

import { useState } from 'react';

const QUESTIONS = [
  "Missing planned work due to smartphone use.",
  "Having a hard time concentrating in class, while doing assignments, or while working due to smartphone use.",
  "Feeling pain in the wrists or at the back of the neck while using a smartphone.",
  "Won't be able to stand not having a smartphone.",
  "Feeling impatient and fretful when I am not holding my smartphone.",
  "Having my smartphone in my mind even when I am not using it.",
  "I will never give up using my smartphone even when my daily life is already greatly affected by it.",
  "Constantly checking my smartphone so as not to miss conversations between other people on Twitter or Facebook.",
  "Using my smartphone longer than I had intended.",
  "The people around me tell me that I use my smartphone too much."
];

export default function SurveyComponent() {
  const [step, setStep] = useState('gender'); // 'gender', 'questions', 'result'
  const [gender, setGender] = useState(''); // 'Boy', 'Girl'
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(0);
  const [risk, setRisk] = useState('');

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setStep('questions');
  };

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: parseInt(value)
    }));
  };

  const calculateResult = () => {
    const totalScore = Object.values(responses).reduce((a, b) => a + b, 0);
    setScore(totalScore);

    let isHighRisk = false;
    if (gender === 'Boy' && totalScore > 31) isHighRisk = true;
    if (gender === 'Girl' && totalScore > 33) isHighRisk = true;

    setRisk(isHighRisk ? 'High Risk' : 'Normal Range');
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('pre_assessment_score', totalScore);
      localStorage.setItem('risk_level', isHighRisk ? 'High' : 'Normal');
    }
    
    setStep('result');
  };

  const isAllAnswered = QUESTIONS.every((_, idx) => responses[idx] !== undefined);

  if (step === 'gender') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">SAS-SV Assessment</h2>
        <p className="mb-4 text-gray-600">Please select your gender to begin:</p>
        <div className="flex gap-4">
          <button 
            onClick={() => handleGenderSelect('Boy')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
          >
            Boy
          </button>
          <button 
            onClick={() => handleGenderSelect('Girl')}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded transition"
          >
            Girl
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Assessment Result</h2>
        <p className="text-lg mb-2">Total Score: <span className="font-bold text-indigo-600">{score}</span></p>
        <div className={`p-4 rounded-md mb-6 ${risk === 'High Risk' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          Your usage level indicates: <strong>{risk}</strong>
        </div>
        <a href="/dashboard" className="inline-block bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition">
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Smartphone Addiction Scale (SAS-SV)</h2>
      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-4">
            <p className="mb-2 text-gray-700 font-medium">{idx + 1}. {q}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 px-2">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            <div className="flex justify-between mt-2 gap-1">
              {[1, 2, 3, 4, 5, 6].map((val) => (
                <button
                  key={val}
                  onClick={() => handleResponseChange(idx, val)}
                  className={`w-10 h-10 rounded-full border transition flex items-center justify-center
                    ${responses[idx] === val 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <button
          onClick={calculateResult}
          disabled={!isAllAnswered}
          className={`w-full py-3 rounded-lg font-semibold text-white transition
            ${isAllAnswered ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          See Results
        </button>
      </div>
    </div>
  );
}


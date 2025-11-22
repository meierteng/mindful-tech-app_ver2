'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [score, setScore] = useState(null);
  const [risk, setRisk] = useState(null);
  const [history, setHistory] = useState([]);
  const [screenTimeLog, setScreenTimeLog] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLogTime, setNewLogTime] = useState(''); // minutes
  const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setScore(localStorage.getItem('pre_assessment_score'));
    setRisk(localStorage.getItem('risk_level'));
    
    const loadedHistory = JSON.parse(localStorage.getItem('session_history') || '[]');
    setHistory(loadedHistory.reverse());

    const loadedLogs = JSON.parse(localStorage.getItem('screen_time_logs') || '[]');
    setScreenTimeLog(loadedLogs.reverse());
  }, []);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLogTime) return;

    const newEntry = {
      date: newLogDate,
      minutes: parseInt(newLogTime),
      timestamp: new Date().toISOString()
    };

    const updatedLogs = [newEntry, ...screenTimeLog];
    setScreenTimeLog(updatedLogs);
    localStorage.setItem('screen_time_logs', JSON.stringify(updatedLogs));
    
    setNewLogTime('');
    setShowLogModal(false);
  };

  const programs = [
    { 
      id: '5-day', 
      title: '5-Day Standard Program', 
      desc: 'The complete mindfulness journey from awareness to maintenance.', 
      duration: '5 Days',
      color: 'bg-teal-100 text-teal-800 border-teal-200'
    },
    { 
      id: '3-day', 
      title: '3-Day Compact Program', 
      desc: 'Essentials condensed for busy schedules.', 
      duration: '3 Days',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    { 
      id: '1-day', 
      title: '1-Day Intensive', 
      desc: 'Immediate urge surfing training for acute cravings.', 
      duration: '1 Day',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
  ];

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
            <p className="text-gray-500">Welcome back to your mindful journey.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setShowLogModal(true)}
               className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
             >
               <span>⏱️ Log Screen Time</span>
             </button>
            {score ? (
              <div className={`px-4 py-2 rounded-lg border ${risk === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                <span className="block text-xs font-semibold uppercase tracking-wider opacity-80">Assessment Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{score}</span>
                  <span className="text-sm">({risk})</span>
                </div>
              </div>
            ) : (
              <Link href="/assessment" className="bg-teal-600 text-white px-6 py-2 rounded-full shadow hover:bg-teal-700 transition">
                Take Assessment
              </Link>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (Programs) - Spans 2 cols */}
          <div className="lg:col-span-2 space-y-8">
             <section>
              <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                <span className="bg-teal-100 text-teal-800 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                Current Program
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {programs.map((prog) => (
                  <div key={prog.id} className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col ${prog.color.replace('bg-', 'bg-opacity-20 ')}`}>
                    <h3 className="text-lg font-bold mb-1">{prog.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex-grow">{prog.desc}</p>
                    <Link 
                        href={`/session/${prog.id}?day=1`}
                        className="block w-full text-center bg-white py-2 rounded-lg border border-current font-semibold hover:bg-gray-50 transition text-sm"
                      >
                        Start Day 1
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                 <span className="bg-indigo-100 text-indigo-800 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                Session History
              </h2>
              
              {history.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase sticky top-0">
                        <tr>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Details</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {history.map((entry, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(entry.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="font-medium text-gray-800 capitalize block">{entry.program.replace('-', ' ')}</span>
                              <span className="text-gray-500 text-xs">Day {entry.day}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 border-dashed">
                  <p>No sessions completed yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar (Stats) */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                📱 Screen Time Log
              </h3>
              {screenTimeLog.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <span className="block text-gray-500 text-xs uppercase">Last 7 Days Avg</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {Math.round(screenTimeLog.slice(0,7).reduce((a,b) => a + b.minutes, 0) / Math.min(screenTimeLog.length, 7))}m
                    </span>
                  </div>
                  <div className="space-y-2">
                    {screenTimeLog.slice(0, 5).map((log, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                        <span className="text-gray-600">{log.date}</span>
                        <span className="font-medium">{log.minutes} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                 <div className="text-center py-8 text-gray-400 text-sm">
                   No logs yet. Track your usage to see improvements!
                 </div>
              )}
            </section>
          </div>
        </div>

        {/* Modal for Logging Time */}
        {showLogModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md m-4">
              <h3 className="text-xl font-bold mb-4">Log Daily Screen Time</h3>
              <form onSubmit={handleAddLog} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newLogDate}
                    onChange={e => setNewLogDate(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input 
                    type="number" 
                    value={newLogTime}
                    onChange={e => setNewLogTime(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    placeholder="e.g. 120"
                    min="0"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

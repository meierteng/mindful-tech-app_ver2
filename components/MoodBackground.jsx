'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Emotion → Gradient colors
 */
const MOOD_GRADIENTS = {
  calm: {
    bg: 'linear-gradient(-45deg, #0c4a6e, #0e7490, #047857, #0c4a6e)',
    accent: '#22d3ee',
  },
  anxious: {
    bg: 'linear-gradient(-45deg, #7f1d1d, #c2410c, #a16207, #7f1d1d)',
    accent: '#fbbf24',
  },
  sad: {
    bg: 'linear-gradient(-45deg, #312e81, #4c1d95, #581c87, #312e81)',
    accent: '#a78bfa',
  },
  overwhelmed: {
    bg: 'linear-gradient(-45deg, #78350f, #b91c1c, #be185d, #78350f)',
    accent: '#fb7185',
  },
  neutral: {
    bg: 'linear-gradient(-45deg, #1e293b, #334155, #475569, #1e293b)',
    accent: '#94a3b8',
  },
};

export default function MoodBackground({ emotion = 'neutral' }) {
  const [currentGradient, setCurrentGradient] = useState(MOOD_GRADIENTS.neutral);
  const [mounted, setMounted] = useState(false);
  const styleRef = useRef(null);

  // 客户端挂载
  useEffect(() => {
    setMounted(true);
    
    // 注入动画样式
    if (!document.getElementById('mood-bg-keyframes')) {
      const style = document.createElement('style');
      style.id = 'mood-bg-keyframes';
      style.innerHTML = `
        @keyframes moodGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes moodBreathe {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.15;
          }
        }
        @keyframes moodFloat1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(40px, -50px); }
          50% { transform: translate(80px, 30px); }
          75% { transform: translate(30px, 60px); }
        }
        @keyframes moodFloat2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-50px, 40px); }
          50% { transform: translate(-30px, -60px); }
          75% { transform: translate(40px, -30px); }
        }
        @keyframes moodFloat3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-60px, -40px); }
          66% { transform: translate(50px, -70px); }
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      // 清理（可选，通常不需要因为是全局样式）
    };
  }, []);

  // 情绪变化时更新颜色
  useEffect(() => {
    const newGradient = MOOD_GRADIENTS[emotion] || MOOD_GRADIENTS.neutral;
    setCurrentGradient(newGradient);
  }, [emotion]);

  // 服务端渲染时返回静态背景
  if (!mounted) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#1e293b',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* 主渐变背景 - 流动动画 */}
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          width: '200%',
          height: '200%',
          backgroundImage: currentGradient.bg,
          backgroundSize: '400% 400%',
          backgroundPosition: '0% 50%',
          animation: 'moodGradientFlow 15s ease infinite',
          transition: 'background-image 3s ease',
        }}
      />

      {/* 呼吸圆环 - 正念引导 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '50vmax',
          height: '50vmax',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `2px solid ${currentGradient.accent}`,
          opacity: 0.4,
          animation: 'moodBreathe 8s ease-in-out infinite',
          transition: 'border-color 3s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '35vmax',
          height: '35vmax',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1.5px solid ${currentGradient.accent}`,
          opacity: 0.25,
          animation: 'moodBreathe 8s ease-in-out infinite 0.5s',
          transition: 'border-color 3s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '20vmax',
          height: '20vmax',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1px solid ${currentGradient.accent}`,
          opacity: 0.15,
          animation: 'moodBreathe 8s ease-in-out infinite 1s',
          transition: 'border-color 3s ease',
        }}
      />

      {/* 漂浮光点 */}
      <div
        style={{
          position: 'absolute',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: currentGradient.accent,
          boxShadow: `0 0 20px 8px ${currentGradient.accent}`,
          left: '20%',
          top: '30%',
          opacity: 0.6,
          animation: 'moodFloat1 18s ease-in-out infinite',
          transition: 'background 3s ease, box-shadow 3s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: currentGradient.accent,
          boxShadow: `0 0 15px 6px ${currentGradient.accent}`,
          right: '25%',
          top: '45%',
          opacity: 0.5,
          animation: 'moodFloat2 22s ease-in-out infinite',
          transition: 'background 3s ease, box-shadow 3s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: currentGradient.accent,
          boxShadow: `0 0 25px 10px ${currentGradient.accent}`,
          left: '65%',
          bottom: '25%',
          opacity: 0.5,
          animation: 'moodFloat3 20s ease-in-out infinite',
          transition: 'background 3s ease, box-shadow 3s ease',
        }}
      />

      {/* 暗角效果 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

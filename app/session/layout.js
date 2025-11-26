'use client';

import { EmotionProvider, useEmotion } from '@/components/EmotionContext';
import MoodBackground from '@/components/MoodBackground';

/**
 * SessionShell - 内部包装器，消费情绪上下文并渲染背景
 */
function SessionShell({ children }) {
  const { emotion } = useEmotion();

  return (
    <>
      {/* 全屏情绪响应背景 - 在所有内容之下 */}
      <MoodBackground emotion={emotion} />
      
      {/* 内容层 - 在背景之上 */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </>
  );
}

/**
 * SessionLayout - 用 EmotionProvider 包裹所有 session 页面
 */
export default function SessionLayout({ children }) {
  return (
    <EmotionProvider>
      <SessionShell>{children}</SessionShell>
    </EmotionProvider>
  );
}

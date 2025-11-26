'use client';

import React, { createContext, useContext, useState } from 'react';

const EmotionContext = createContext({
  emotion: 'neutral',
  setEmotion: () => {},
});

/**
 * EmotionProvider - Provides global emotion state for mood-based UI effects.
 * Wrap your layout/page with this to enable emotion-reactive backgrounds.
 */
export function EmotionProvider({ children }) {
  const [emotion, setEmotion] = useState('neutral');

  return (
    <EmotionContext.Provider value={{ emotion, setEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
}

/**
 * useEmotion - Hook to access and update the global emotion state.
 * @returns {{ emotion: string, setEmotion: (value: string) => void }}
 */
export function useEmotion() {
  return useContext(EmotionContext);
}


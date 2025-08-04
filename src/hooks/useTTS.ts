import { useState, useRef, useEffect, useCallback } from 'react';

interface UseTTSReturn {
  isSpeaking: boolean;
  currentSpeakingId: string | null;
  speak: (text: string, id: string) => void;
  stop: () => void;
  isSupported: boolean;
}

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      setIsSupported(true);
    }
  }, []);

  // Clean up speech on component unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Function to clean text for speech (remove markdown formatting)
  const cleanTextForSpeech = useCallback((text: string): string => {
    return text
      // Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove bold **text** -> text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic *text* -> text
      .replace(/\*(.*?)\*/g, '$1')
      // Remove code blocks `text` -> text
      .replace(/`([^`]+)`/g, '$1')
      // Remove headers ## -> empty
      .replace(/^#{1,6}\s*/gm, '')
      // Remove bullet points
      .replace(/^[-*]\s*/gm, '')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  // Function to speak text
  const speak = useCallback((text: string, id: string) => {
    if (!speechSynthesisRef.current) return;

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure utterance
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Set up event listeners
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    speechSynthesisRef.current.speak(utterance);
  }, [cleanTextForSpeech]);

  // Function to stop speech
  const stop = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  }, []);

  return {
    isSpeaking,
    currentSpeakingId,
    speak,
    stop,
    isSupported,
  };
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, X, Volume2, VolumeX, Mic, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Game, ChatMessage } from '@/types/game';
import { useTTS } from '@/hooks/useTTS';
import { useAudioRecording } from '@/hooks/useAudioRecording';

interface ChatInterfaceProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatInterface({ game, isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  
  // Use the TTS hook
  const { isSpeaking, currentSpeakingId, speak, stop, isSupported } = useTTS();
  
  // Use the audio recording hook
  const { 
    isRecording, 
    isTranscribing, 
    recordAndTranscribe
  } = useAudioRecording();

  const sponsoredInfo = game.sponsorPriority && game.sponsorWebsite
    ? `\n\nIMPORTANT: This is a sponsored game. Please mention that players can visit ${game.sponsorWebsite} for more information. When mentioning the website, format it as a proper Markdown link like this: [Link](${game.sponsorWebsite}). Include this information naturally in your welcome message.`
    : ''

  const initialPrompt = `You are a friendly game instructor. I want to learn how to play "${game.name}". 

IMPORTANT: Do not use any emojis or emoticons in your responses. Use clear, professional text only. Use proper Markdown formatting in your responses: Use **bold** for emphasis; Use *italics* for game terms; Use \`code blocks\` for specific game components; Use proper link syntax: [link text](URL) for any websites or links; Use bullet points with - or * for lists; Use ## for section headers when appropriate.
${sponsoredInfo}

Here's the game data: ${JSON.stringify(game, null, 2)}

Please start by giving me a warm welcome and a brief overview of the game. Then ask if I'd like to learn the basic rules, setup instructions, or if I have any specific questions about the game.`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    if (isInitializedRef.current) return; // Prevent multiple initializations

    isInitializedRef.current = true; // Mark as initialized immediately
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialPrompt: initialPrompt,
          messages: []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json() as { content: string };

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: data.content,
        timestamp: new Date()
      };

      setMessages([assistantMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      isInitializedRef.current = false; // Reset on error so it can be retried
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [initialPrompt]); // Include initialPrompt dependency

  // Initialize chat only when isOpen changes to true
  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen, initializeChat]);

  const sendMessage = async (e?: React.FormEvent, input_text?: string) => {
    if (e) {
      e.preventDefault();
    }

    // Use provided input_text or fall back to the input field value
    const messageContent = input_text ? input_text.trim() : input.trim();
    
    if (!messageContent) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Only clear input field if we're using the form input (not audio transcription)
    if (!input_text) {
      setInput('');
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialPrompt: initialPrompt,
          messages: newMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json() as { content: string };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioRecording = async () => {
    setErrorMessage(''); // Clear any previous errors
    try {
      const transcription = await recordAndTranscribe();
      if (transcription) {
        await sendMessage(undefined, transcription);
      }
    } catch (error) {
      console.error('Error with audio recording:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to record or transcribe audio. Please try again.';
      setErrorMessage(errorMsg);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleClose = () => {
    setMessages([]);
    isInitializedRef.current = false; // Reset initialization status when closing
    stop(); // Stop any ongoing speech
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Tutor</h3>
            <p className="text-sm text-gray-500">Learning {game.name}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'model' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-blue-600" />
              </div>
            )}
            <div className="flex flex-col max-w-[90%]">
              <div
                className={`p-3 rounded-lg ${message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-100 text-gray-900'
                  }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              {message.role === 'model' && isSupported && (
                <div className="flex justify-start mt-1">
                  <button
                    onClick={() => {
                      if (currentSpeakingId === message.id && isSpeaking) {
                        stop();
                      } else {
                        speak(message.content, message.id);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title={currentSpeakingId === message.id && isSpeaking ? "Stop speaking" : "Read aloud"}
                  >
                    {currentSpeakingId === message.id && isSpeaking ? (
                      <VolumeX size={14} />
                    ) : (
                      <Volume2 size={14} />
                    )}
                    <span>{currentSpeakingId === message.id && isSpeaking ? "Stop" : "Listen"}</span>
                  </button>
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-blue-600" />
            </div>
            <div className="bg-gray-100 text-gray-900 p-3 rounded-lg flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        {errorMessage && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <X size={16} className="text-red-600" />
              <span className="text-sm text-red-700">{errorMessage}</span>
            </div>
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRecording 
                ? "Recording..." 
                : isTranscribing 
                ? "Transcribing audio..." 
                : "Ask me anything about the game..."
            }
            className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              isRecording 
                ? 'border-red-300 bg-red-50' 
                : isTranscribing 
                ? 'border-yellow-300 bg-yellow-50' 
                : 'border-gray-300'
            }`}
            disabled={isLoading || isRecording || isTranscribing}
          />
          <button
            type="button"
            onClick={handleAudioRecording}
            disabled={isLoading || isTranscribing}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse shadow-lg shadow-red-200' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <Square size={20} className="animate-pulse" />
            ) : (
              <Mic size={20} />
            )}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isRecording || isTranscribing}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

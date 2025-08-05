import { useState, useRef, useCallback } from 'react';

interface UseAudioRecordingReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  recordAndTranscribe: () => Promise<string>;
}

export function useAudioRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        throw new Error('Audio recording is not available in this environment.');
      }

      // Check for getUserMedia support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.');
      }

      // Check for secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        throw new Error('Audio recording requires a secure connection (HTTPS). Please access the site via HTTPS or localhost.');
      }

      // Check for MediaRecorder support
      if (!window.MediaRecorder) {
        throw new Error('Your browser does not support audio recording. Please update your browser or try a different one.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      // Check for supported MIME types
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = 'audio/wav';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      
      // Provide specific error messages based on error type
      if (error instanceof Error) {
        // Handle specific DOMException errors
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow microphone permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Your browser does not support audio recording. Please try a different browser.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Microphone is already in use by another application. Please close other apps using the microphone and try again.');
        } else if (error.name === 'SecurityError') {
          throw new Error('Audio recording blocked due to security restrictions. Please ensure you\'re using HTTPS or localhost.');
        } else if (error.name === 'AbortError') {
          throw new Error('Recording was interrupted. Please try again.');
        } else if (error.message.includes('secure') || error.message.includes('HTTPS')) {
          throw error; // Re-throw our custom secure context error
        } else if (error.message.includes('browser') || error.message.includes('support')) {
          throw error; // Re-throw our custom browser support errors
        } else {
          throw new Error(`Failed to start recording: ${error.message}`);
        }
      }
      
      throw new Error('Failed to start recording. Please check your microphone permissions and try again.');
    }
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json() as { transcription: string };
      return data.transcription;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording found'));
        return;
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        // Stop all tracks to release the microphone
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        
        // Transcribe the audio
        try {
          setIsTranscribing(true);
          const transcription = await transcribeAudio(audioBlob);
          resolve(transcription);
        } catch (error) {
          reject(error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.stop();
    });
  }, [transcribeAudio]);

  const recordAndTranscribe = useCallback(async (): Promise<string> => {
    if (isRecording) {
      return await stopRecording();
    } else {
      await startRecording();
      return '';
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    recordAndTranscribe,
  };
}

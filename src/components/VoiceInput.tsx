import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  type?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onResult, 
  placeholder, 
  className, 
  name, 
  required, 
  defaultValue = '',
  type = 'text'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Default, can be improved to detect app language

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        required={required}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onResult(e.target.value);
        }}
        placeholder={placeholder}
        className={className}
      />
      {supported && (
        <button
          type="button"
          onClick={startListening}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-agri-soft text-agri-green hover:bg-agri-green hover:text-white'
          }`}
          title="Voice Input"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};

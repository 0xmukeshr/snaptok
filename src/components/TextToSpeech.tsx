import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, autoPlay = true }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (!text) return;
    
    const synth = window.speechSynthesis;
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    newUtterance.rate = 1.0;
    newUtterance.pitch = 1.0;
    
    // Try to use a natural sounding voice if available
    const voices = synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Natural') || 
      voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
      newUtterance.voice = preferredVoice;
    }
    
    // Set up event handlers
    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => setIsSpeaking(false);
    newUtterance.onerror = () => setIsSpeaking(false);
    
    setUtterance(newUtterance);
    
    // Auto-play if enabled
    if (autoPlay) {
      synth.cancel(); // Cancel any ongoing speech
      synth.speak(newUtterance);
    }
    
    return () => {
      synth.cancel();
    };
  }, [text, autoPlay]);
  
  const toggleSpeech = () => {
    const synth = window.speechSynthesis;
    
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else if (utterance) {
      synth.speak(utterance);
    }
  };
  
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      onClick={toggleSpeech}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default TextToSpeech;
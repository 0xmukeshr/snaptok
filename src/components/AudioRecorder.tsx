import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import Timer from './Timer';
import { useAppContext } from '../context/AppContext';
import { analyzeRecording } from '../services/aiService';

interface AudioRecorderProps {
  onRecordingComplete: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60); // 1 minute timer
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { setRecordingData } = useAppContext();

  // Reset timer when component mounts or when recording stops
  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(60);
    }
  }, [isRecording]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Process the recording with AI
        const analysisResult = await analyzeRecording(audioBlob);
        
        setRecordingData({
          audioBlob,
          audioUrl,
          ...analysisResult
        });
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
        
        onRecordingComplete();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTimerComplete = () => {
    stopRecording();
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className={`px-6 py-2 rounded-md ${
          isRecording
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <div className="flex items-center gap-2">
            <Square size={16} />
            <span>Stop Recording</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Mic size={16} />
            <span>Start Interview</span>
          </div>
        )}
      </button>
      
      <Timer 
        isActive={isRecording} 
        duration={recordingTime} 
        onComplete={handleTimerComplete} 
      />
    </div>
  );
};

export default AudioRecorder;
import React, { useState, useRef, useEffect } from 'react';
import { Video, Square } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { analyzeRecording } from '../services/aiService';

interface VideoRecorderProps {
  onRecordingComplete: (skipAnalysis?: boolean) => void;
  questionId: string;
  duration?: number;
  isActive?: boolean;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onRecordingComplete, 
  questionId,
  duration = 60,
  isActive = false
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { addQuestionData } = useAppContext();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 1600,
            channelCount: 1
          }, 
          video: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        
        setHasPermission(true);
        setShowPreview(true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasPermission(false);
        alert('Could not access camera or microphone. Please check permissions.');
      }
    };
    
    checkPermissions();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && hasPermission) {
      startRecording();
    }
  }, [isActive, hasPermission]);

  const startRecording = async () => {
    if (!streamRef.current) return;
    
    audioChunksRef.current = [];
    videoChunksRef.current = [];
    
    try {
      // Video Recording
      const videoRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = videoRecorder;
      
      videoRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      // Audio Recording
      const audioStream = new MediaStream(streamRef.current.getAudioTracks());
      const audioRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 1600
      });
      audioRecorderRef.current = audioRecorder;
      
      audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      videoRecorder.onstop = async () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const analysisResult = await analyzeRecording(audioBlob, videoBlob);
        
        addQuestionData(questionId, {
          transcript: analysisResult.transcript,
          audioUrl,
          videoUrl,
          audioBlob,
          analysis: {
            disfluencyAnalysis: analysisResult.disfluencyAnalysis,
            repeatedWords: analysisResult.repeatedWords,
            aiRecommendations: analysisResult.aiRecommendations
          }
        });
        
        onRecordingComplete();
      };
      
      videoRecorder.start();
      audioRecorder.start();
      
      // Stop recording after duration
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          audioRecorderRef.current?.stop();
        }
      }, duration * 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
        {showPreview && (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        
        {isActive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording</span>
          </div>
        )}
        
        {!showPreview && (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Video size={48} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
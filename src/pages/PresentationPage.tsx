import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoRecorder from '../components/VideoRecorder';
import PresentationUploader from '../components/PresentationUploader';
import PresentationViewer from '../components/PresentationViewer';
import Timer from '../components/Timer';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { Plus, Minus, Play, Square } from 'lucide-react';

const PresentationPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState('presentation');
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [presentationTime, setPresentationTime] = useState(1); // Default 1 minute
  const [presentationId] = useState(uuidv4());
  const [currentSlide, setCurrentSlide] = useState(1);
  
  const { userProfile } = useAppContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userProfile) {
      navigate('/');
    }
  }, [userProfile, navigate]);
  
  const handleFileSelected = (file: File) => {
    setPresentationFile(file);
    setCurrentSlide(1);
  };
  
  const handleSlideChange = (slideNumber: number) => {
    setCurrentSlide(slideNumber);
  };
  
  const incrementTimer = () => {
    if (!isRecording) {
      setPresentationTime(prev => Math.min(prev + 1, 60)); // Max 60 minutes
    }
  };
  
  const decrementTimer = () => {
    if (!isRecording) {
      setPresentationTime(prev => Math.max(prev - 1, 1)); // Min 1 minute
    }
  };
  
  const startPresentation = () => {
    setIsRecording(true);
  };

  const stopPresentation = () => {
    setIsRecording(false);
    navigate('/analytics');
  };
  
  const handleRecordingComplete = () => {
    setIsRecording(false);
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-64 border-r border-gray-200 bg-white">
          <Sidebar activeMode={activeMode} onModeChange={setActiveMode} />
        </div>
        
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Presentation Viewer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Slides</h3>
                {presentationFile ? (
                  <div className="relative bg-white rounded-lg overflow-hidden">
                    <PresentationViewer 
                      file={presentationFile}
                      currentSlide={currentSlide}
                      onSlideChange={handleSlideChange}
                    />
                  </div>
                ) : (
                  <PresentationUploader onFileSelected={handleFileSelected} />
                )}
              </div>
              
              {/* Video Recording */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Camera</h3>
                <VideoRecorder 
                  onRecordingComplete={handleRecordingComplete}
                  questionId={presentationId}
                  isActive={isRecording}
                  duration={presentationTime * 60} // Convert minutes to seconds
                />
              </div>
            </div>
            
            {/* Timer Controls and Start/Stop Button */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 bg-white rounded-lg shadow-md p-4">
                <button 
                  onClick={decrementTimer}
                  disabled={isRecording}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={20} />
                </button>
                
                <div className="flex flex-col items-center min-w-[100px]">
                  <span className="text-sm text-gray-500">Timer (minutes)</span>
                  <span className="text-2xl font-bold">{presentationTime}</span>
                </div>
                
                <button 
                  onClick={incrementTimer}
                  disabled={isRecording}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {!isRecording ? (
                <button
                  onClick={startPresentation}
                  disabled={!presentationFile}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium transition-colors ${
                    !presentationFile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  <Play size={20} />
                  <span>Start Presentation</span>
                </button>
              ) : (
                <button
                  onClick={stopPresentation}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600"
                >
                  <Square size={20} />
                  <span>Stop Presentation</span>
                </button>
              )}
              
              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <Timer 
                    isActive={isRecording}
                    duration={presentationTime * 60}
                    onComplete={handleRecordingComplete}
                    showMinutes
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PresentationPage;
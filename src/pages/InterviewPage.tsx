import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoRecorder from '../components/VideoRecorder';
import TextToSpeech from '../components/TextToSpeech';
import { useAppContext } from '../context/AppContext';
import { generateInterviewQuestions } from '../services/aiService';
import { Plus, Minus, Play, Square } from 'lucide-react';

const InterviewPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState('interview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [questionTime, setQuestionTime] = useState(30); // Default 30 seconds
  const [timeLeft, setTimeLeft] = useState(30);
  
  const { 
    userProfile, 
    questions, 
    setQuestions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex 
  } = useAppContext();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userProfile) {
      navigate('/');
      return;
    }
    
    const getQuestions = async () => {
      setIsLoading(true);
      const generatedQuestions = await generateInterviewQuestions(userProfile, 5);
      setQuestions(generatedQuestions);
      setIsLoading(false);
    };
    
    getQuestions();
  }, [userProfile, navigate, setQuestions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      // If it's not the last question, move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(questionTime);
      } else {
        // If it's the last question, stop recording and navigate to analytics
        setIsRecording(false);
        navigate('/analytics');
      }
    }

    return () => clearInterval(timer);
  }, [isRecording, timeLeft, currentQuestionIndex, questions.length, navigate, questionTime]);
  
  const handleRecordingComplete = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setIsRecording(false);
      navigate('/analytics');
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(questionTime);
    } else {
      setIsRecording(false);
      navigate('/analytics');
    }
  };
  
  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(questionTime);
    } else {
      setIsRecording(false);
      navigate('/analytics');
    }
  };

  const incrementTimer = () => {
    if (!isRecording) {
      const newTime = Math.min(questionTime + 10, 300);
      setQuestionTime(newTime);
      setTimeLeft(newTime);
    }
  };
  
  const decrementTimer = () => {
    if (!isRecording) {
      const newTime = Math.max(questionTime - 10, 30);
      setQuestionTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const startInterview = () => {
    setIsRecording(true);
    setTimeLeft(questionTime);
  };

  const stopInterview = () => {
    setIsRecording(false);
    navigate('/analytics');
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-64 border-r border-gray-200 bg-white">
          <Sidebar activeMode={activeMode} onModeChange={setActiveMode} />
        </div>
        
        <div className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Questions Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Questions</h2>
                <div className="min-h-[200px]">
                  {currentQuestion && (
                    <p className="text-gray-700">
                      {currentQuestion.text}
                      {isRecording && <TextToSpeech text={currentQuestion.text} />}
                    </p>
                  )}
                </div>
              </div>

              {/* Camera Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Camera</h2>
                {currentQuestion && (
                  <VideoRecorder 
                    onRecordingComplete={handleRecordingComplete} 
                    questionId={currentQuestion.id}
                    isActive={isRecording}
                    duration={questionTime}
                  />
                )}
              </div>

              {/* Controls Section */}
              <div className="col-span-2 flex items-center justify-between">
                {!isRecording ? (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={decrementTimer}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{questionTime}</span>
                      <span className="text-gray-500">sec</span>
                    </div>
                    
                    <button 
                      onClick={incrementTimer}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus size={20} />
                    </button>

                    <button
                      onClick={startInterview}
                      className="ml-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Start Interview
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                        <span className="text-xl font-bold">{timeLeft}</span>
                      </div>
                      <span className="text-gray-500">sec</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleSkip}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Skip
                      </button>
                      
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Next
                      </button>
                    </div>

                    <button
                      onClick={stopInterview}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Stop Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewPage;
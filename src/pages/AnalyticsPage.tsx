import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../context/AppContext';
import FloatingBubbles from '../components/FloatingBubbles';
import AnimatedCounter from '../components/AnimatedCounter';
import SpeechAnalysisChart from '../components/SpeechAnalysisChart';
import AnimatedText from '../components/AnimatedText';
import ScoreCard from '../components/ScoreCard';
import { CheckCircle, XCircle, Lightbulb, Video } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState('interview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userProfile, recordingData, questions } = useAppContext();
  const navigate = useNavigate();
  const [overallScore, setOverallScore] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [clarityScore, setClarityScore] = useState(0);
  const [contentScore, setContentScore] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('analysis');
  
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/interview');
      return;
    }
    
    const calculateScores = () => {
      const question = questions[selectedQuestionIndex];
      if (!question?.analysis) return;

      const { disfluencyAnalysis = {}, repeatedWords = {} } = question.analysis;
      
      const totalDisfluencies = Object.values(disfluencyAnalysis).reduce((a, b) => a + b, 0);
      const clarity = Math.max(100 - (totalDisfluencies * 5), 40);
      setClarityScore(clarity);
      
      const uniqueWords = Object.keys(repeatedWords).length;
      const content = Math.min(uniqueWords * 2, 100);
      setContentScore(content);
      
      const confidence = Math.max(100 - (totalDisfluencies * 3), 40);
      setConfidenceScore(confidence);
      
      const overall = Math.round((clarity * 0.4) + (content * 0.3) + (confidence * 0.3));
      setOverallScore(overall);
    };
    
    calculateScores();
  }, [questions, selectedQuestionIndex, navigate]);
  
  const selectedQuestion = questions[selectedQuestionIndex];
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      <FloatingBubbles />
      <Header toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 flex">
        <motion.div 
          className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-gray-200 bg-white bg-opacity-80 backdrop-blur-sm z-10 overflow-hidden`}
          initial={false}
          animate={{ width: isSidebarOpen ? '16rem' : '0rem' }}
        >
          <Sidebar activeMode={activeMode} onModeChange={setActiveMode} />
          
          <div className="p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Analysis Type</h3>
              <button
                className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                  activeMode === 'interview'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveMode('interview')}
              >
                Interview Analysis
              </button>
              <button
                className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                  activeMode === 'presentation'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveMode('presentation')}
              >
                Presentation Analysis
              </button>
            </div>
            
            {questions.length > 0 && activeMode === 'interview' && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Questions</h3>
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <button
                      key={question.id}
                      className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                        selectedQuestionIndex === index
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedQuestionIndex(index)}
                    >
                      Question {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">
                {activeMode === 'interview' ? 'Interview Analysis' : 'Presentation Analysis'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AnimatedCounter value={overallScore} label="Overall Score" color="#4F46E5" />
                <AnimatedCounter value={clarityScore} label="Speech Clarity" color="#EC4899" />
                <AnimatedCounter value={confidenceScore} label="Confidence" color="#10B981" />
                <AnimatedCounter value={contentScore} label="Content Quality" color="#F59E0B" />
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'analysis'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('analysis')}
                >
                  Question Analysis
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'video'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('video')}
                >
                  Full Interview Video
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'analysis' ? (
                <>
                  {selectedQuestion?.transcript && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-2">Transcript</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <AnimatedText text={selectedQuestion.transcript} />
                      </div>
                    </div>
                  )}
                  
                  {selectedQuestion?.analysis?.aiRecommendations && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="text-green-500" size={20} />
                            <h4 className="font-medium text-green-700">Strengths</h4>
                          </div>
                          <ul className="space-y-2">
                            {selectedQuestion.analysis.aiRecommendations.strengths.map((strength, index) => (
                              <li key={index} className="text-green-600 text-sm">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="text-red-500" size={20} />
                            <h4 className="font-medium text-red-700">Areas for Improvement</h4>
                          </div>
                          <ul className="space-y-2">
                            {selectedQuestion.analysis.aiRecommendations.improvements.map((improvement, index) => (
                              <li key={index} className="text-red-600 text-sm">{improvement}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-blue-500" size={20} />
                            <h4 className="font-medium text-blue-700">Personalized Tips</h4>
                          </div>
                          <ul className="space-y-2">
                            {selectedQuestion.analysis.aiRecommendations.personalizedTips.map((tip, index) => (
                              <li key={index} className="text-blue-600 text-sm">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {selectedQuestion?.analysis?.repeatedWords && (
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <SpeechAnalysisChart 
                          data={selectedQuestion.analysis.repeatedWords}
                          title="Most Repeated Words"
                          color="rgba(79, 70, 229, 0.8)"
                        />
                      </div>
                    )}
                    
                    {selectedQuestion?.analysis?.disfluencyAnalysis && (
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <SpeechAnalysisChart 
                          data={selectedQuestion.analysis.disfluencyAnalysis}
                          title="Speech Disfluencies"
                          color="rgba(236, 72, 153, 0.8)"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ScoreCard 
                      title="Speech Clarity Analysis"
                      score={clarityScore}
                      maxScore={100}
                      description="Measures how clearly you speak without filler words and disfluencies"
                      color="#EC4899"
                    />
                    
                    <ScoreCard 
                      title="Confidence Analysis"
                      score={confidenceScore}
                      maxScore={100}
                      description="Evaluates your speaking confidence based on pace and delivery"
                      color="#10B981"
                    />
                    
                    <ScoreCard 
                      title="Content Quality"
                      score={contentScore}
                      maxScore={100}
                      description="Assesses the richness and variety of your vocabulary"
                      color="#F59E0B"
                    />
                    
                    <ScoreCard 
                      title="Overall Performance"
                      score={overallScore}
                      maxScore={100}
                      description="Combined score based on clarity, confidence, and content"
                      color="#4F46E5"
                    />
                  </div>
                </>
              ) : (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Complete Interview Recording</h3>
                  {questions[0]?.videoUrl ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video controls className="w-full h-full">
                        <source src={questions[0].videoUrl} type="video/webm" />
                        Your browser does not support the video element.
                      </video>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500 flex flex-col items-center">
                        <Video size={48} className="mb-2" />
                        <span>No video recording available</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
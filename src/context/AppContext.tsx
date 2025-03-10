import React, { createContext, useContext, useState } from 'react';
import { UserProfile, RecordingData, QuestionData } from '../types';

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  recordingData: RecordingData;
  setRecordingData: (data: RecordingData) => void;
  currentQuestion: string;
  setCurrentQuestion: (question: string) => void;
  questions: QuestionData[];
  setQuestions: (questions: QuestionData[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  addQuestionData: (questionId: string, data: Partial<QuestionData>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recordingData, setRecordingData] = useState<RecordingData>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const addQuestionData = (questionId: string, data: Partial<QuestionData>) => {
    setQuestions(prevQuestions => {
      const questionIndex = prevQuestions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) return prevQuestions;

      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        ...data,
      };
      return updatedQuestions;
    });
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        recordingData,
        setRecordingData,
        currentQuestion,
        setCurrentQuestion,
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        addQuestionData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
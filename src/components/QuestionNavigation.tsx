import React from 'react';
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentIndex,
  totalQuestions,
  onNext,
  onPrevious,
  onSkip
}) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>
      
      <div className="text-sm text-gray-500">
        Question {currentIndex + 1} of {totalQuestions}
      </div>
      
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          onClick={onSkip}
        >
          <SkipForward size={16} />
          <span>Skip</span>
        </button>
        
        <button
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuestionNavigation;
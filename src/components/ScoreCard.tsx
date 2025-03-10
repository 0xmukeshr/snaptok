import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description: string;
  color: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, maxScore, description, color }) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      
      <div className="flex items-center mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <motion.div 
            className="h-2.5 rounded-full" 
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <span className="text-sm font-medium">{score}/{maxScore}</span>
      </div>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default ScoreCard;
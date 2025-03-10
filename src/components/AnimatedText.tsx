import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  // Split text into words
  const words = text.split(' ');

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className={className}>
      {words.map((word, index) => (
        <motion.span key={index} variants={child} style={{ display: 'inline-block', marginRight: '5px' }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
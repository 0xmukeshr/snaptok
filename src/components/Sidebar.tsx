import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Presentation, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, onModeChange }) => {
  const modes = [
    { id: 'interview', label: 'Interview', icon: <Mic size={18} />, path: '/interview' },
    { id: 'presentation', label: 'Presentation', icon: <Presentation size={18} />, path: '/presentation' },
    { id: 'conversation', label: 'Conversation', icon: <MessageSquare size={18} />, path: '/conversation' },
  ];

  return (
    <div className="w-full p-4 space-y-3">
      {modes.map((mode, index) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link to={mode.path}>
            <button
              className={`w-full py-3 px-4 text-center rounded-lg flex items-center gap-2 transition-colors ${
                activeMode === mode.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onModeChange(mode.id)}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          </Link>
        </motion.div>
      ))}
      
      <motion.div 
        className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-medium text-indigo-800 mb-2">Pro Tip</h3>
        <p className="text-xs text-indigo-600">
          Practice makes perfect! Try recording multiple sessions to see your improvement over time.
        </p>
      </motion.div>
    </div>
  );
};

export default Sidebar;
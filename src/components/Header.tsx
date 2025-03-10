import React from 'react';
import { Menu, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  
  return (
    <motion.header 
      className="flex items-center justify-between p-4 border-b border-gray-200 bg-white bg-opacity-90 backdrop-blur-sm z-20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button 
        onClick={toggleSidebar}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Menu size={24} />
      </button>
      
      <motion.h1 
        className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Link to="/">Snaptok</Link>
      </motion.h1>
      
      <div className="flex items-center gap-2">
        {location.pathname !== '/' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/" 
              className="px-4 py-1 rounded-md transition-colors bg-purple-100 hover:bg-purple-200 text-purple-700 mr-2"
            >
              Profile
            </Link>
          </motion.div>
        )}
        
        {location.pathname !== '/interview' && location.pathname !== '/' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/interview" 
              className="px-4 py-1 rounded-md transition-colors bg-blue-100 hover:bg-blue-200 text-blue-700 mr-2"
            >
              Interview
            </Link>
          </motion.div>
        )}
        
        {location.pathname !== '/presentation' && location.pathname !== '/' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/presentation" 
              className="px-4 py-1 rounded-md transition-colors bg-green-100 hover:bg-green-200 text-green-700 mr-2"
            >
              Presentation
            </Link>
          </motion.div>
        )}
        
        {location.pathname !== '/analytics' && (location.pathname === '/interview' || location.pathname === '/presentation') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/analytics" 
              className={`px-4 py-1 rounded-md transition-colors ${
                location.pathname === '/analytics' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
              }`}
            >
              Analytics
            </Link>
          </motion.div>
        )}
        
        <motion.div 
          className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={20} />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PresentationUploaderProps {
  onFileSelected: (file: File) => void;
}

const PresentationUploader: React.FC<PresentationUploaderProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is a presentation (ppt, pptx, pdf)
    const validTypes = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/pdf'];
    
    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      alert('Please upload a valid presentation file (PPT, PPTX, or PDF)');
    }
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {!selectedFile ? (
        <motion.div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Presentation</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your presentation file here, or click to browse
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".ppt,.pptx,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Files
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="border rounded-lg p-4 bg-gray-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText size={24} className="text-blue-500 mr-3" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PresentationUploader;
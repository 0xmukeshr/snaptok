import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import { UserCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { setUserProfile } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    description: '',
    level: 'intermediate'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    navigate('/interview');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-2xl p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center mb-6">
            <UserCircle size={64} className="text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-6">Profile Information</h2>
          <p className="text-gray-600 mb-6 text-center">
            This information will be used to generate personalized interview questions.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Background Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Briefly describe your background and experience"
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Interview
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
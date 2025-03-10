import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProfilePage from './pages/ProfilePage';
import InterviewPage from './pages/InterviewPage';
import PresentationPage from './pages/PresentationPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/presentation" element={<PresentationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
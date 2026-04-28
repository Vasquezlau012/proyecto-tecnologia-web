import React, { useState } from 'react';
import Home from './pages/Home';
import OTPPage from './pages/OTPPage';
import StudentsPage from './pages/StudentsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  const handleNavigate = (page: string) => {
    if (page === 'students' && !isAuthenticated) {
      setCurrentPage('otp');
      return;
    }
    setCurrentPage(page);
  };

  const handleAuthenticated = (token: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
  };

  return (
    <div>
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'otp' && (
        <OTPPage onNavigate={handleNavigate} onAuthenticated={handleAuthenticated} />
      )}
      {currentPage === 'students' && isAuthenticated && (
        <StudentsPage onNavigate={handleNavigate} />
      )}
    </div>
  );
}

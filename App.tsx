
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ChatBot from './components/ChatBot';
import Auth from './components/Auth';
import { Language } from './translations';
import { AiChatIcon, MenuIcon } from './components/icons';

import { useAuth } from './src/contexts/AuthContext';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeItem, setActiveItem] = useState('Home');
  const [language, setLanguage] = useState<Language>('en');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!currentUser) {
    return <Auth language={language} setLanguage={setLanguage} />;
  }

  const handleLogout = () => {
    // Will be handled in Sidebar
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="flex min-h-screen bg-brand-bg font-sans text-brand-dark relative">
      {/* Sidebar Container with Transition */}
      <div
        className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out relative z-20 flex-shrink-0 bg-sidebar-bg border-r border-stone-200 overflow-hidden shadow-lg`}
      >
        <div className="w-64 h-full">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            language={language}
            setLanguage={setLanguage}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Sidebar Toggle Button (Visible when closed) */}
      <div className={`absolute top-4 left-4 z-10 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-full' : 'opacity-100 translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-white rounded-md shadow-md hover:bg-gray-50 text-brand-dark border border-gray-100"
          title="Show Sidebar"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 h-screen overflow-hidden relative">
        <MainContent
          activeView={activeItem}
          setActiveView={setActiveItem}
          language={language}
        />
      </div>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} language={language} />

      <FloatingChatButton isOpen={isChatOpen} onClick={toggleChat} />
    </div>
  );
};

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all z-[100] ${isOpen ? 'bg-gray-800 rotate-180' : 'bg-gradient-to-r from-brand-pink to-brand-purple hover:scale-105 animate-bounce-slow'}`}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <AiChatIcon className="h-8 w-8 text-white" />
      )}
    </button>
  );
}

export default App;

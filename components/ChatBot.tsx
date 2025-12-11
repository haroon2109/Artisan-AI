
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Language, languages } from '../translations';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, language }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Namaste! I am Kala Sahayak. I can speak ${languages[language]}. How can I help your business today?`, sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Reset chat when language changes to provide context
  useEffect(() => {
    chatSessionRef.current = null;
    setMessages([{ 
      id: Date.now(), 
      text: language === 'en' ? "Namaste! How can I help you?" : 
            language === 'hi' ? "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?" :
            `Hello! I speak ${languages[language]}. How can I help?`, 
      sender: 'ai' 
    }]);
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are Kala Sahayak, a helpful and friendly AI assistant for Indian artisans and craftspeople. 
            They might not be highly educated, so keep your language simple, warm, and encouraging.
            ALWAYS reply in the user's selected language: ${languages[language]}.
            Help them with marketing, pricing, selling online, and creating content.`
          }
        });
      }

      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const aiResponseText = result.text;

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponseText, sender: 'ai' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I am having trouble connecting. Please try again.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-8 w-96 max-h-[600px] h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] border border-gray-200 overflow-hidden font-sans ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-brand-dark p-4 flex justify-between items-center text-white shadow-md z-10">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <h3 className="font-bold tracking-wide">Kala Sahayak AI</h3>
        </div>
        {/* Mobile close button (redundant with main toggle but good for accessibility) */}
        <button onClick={onClose} className="hover:bg-white/20 rounded p-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-brand-bg scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-brand-red text-white rounded-br-none shadow-md' 
                : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
             <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 z-10">
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 border border-gray-300 bg-gray-50 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all shadow-inner"
            placeholder="Type your question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 top-1.5 bg-brand-red text-white p-1.5 rounded-full hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

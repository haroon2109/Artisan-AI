
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, t, languages } from '../translations';

interface Props {
  language: Language;
}

const ArtisanStory: React.FC<Props> = ({ language }) => {
  const T = t[language];
  const [name, setName] = useState('');
  const [craft, setCraft] = useState('');
  const [background, setBackground] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!name || !craft) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const langName = languages[language];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a heartwarming and professional "About the Artisan" story (approx 150 words) for ${name}, who is a ${craft}. 
        Background info: ${background}. 
        Focus on tradition, passion, and the human touch.
        IMPORTANT: Write the story in ${langName}.`,
      });
      if (response.text) {
        setStory(response.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">{T.artisanStory}</h2>
      <p className="text-gray-500 mb-8">Share your journey with the world.</p>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{T.yourName}</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{T.yourCraft}</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black"
              placeholder="e.g. Pottery, Weaving"
              value={craft}
              onChange={(e) => setCraft(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{T.yourBackstory}</label>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black"
            rows={3}
            placeholder="I learned from my grandfather in Jaipur..."
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>
        <button 
          onClick={generate}
          disabled={loading}
          className="px-8 py-3 bg-brand-dark text-white rounded-lg font-bold shadow hover:bg-gray-800 transition-colors"
        >
          {loading ? T.generating : T.generateBtn}
        </button>
      </div>

      {story && (
        <div className="bg-[#FFFBF5] p-8 rounded-2xl border border-orange-100 relative text-gray-900">
          <div className="absolute top-4 left-4 text-6xl text-orange-200 font-serif">“</div>
          <div className="relative z-10 text-lg leading-loose text-gray-800 font-serif italic text-center">
            {story}
          </div>
          <div className="absolute bottom-4 right-4 text-6xl text-orange-200 font-serif rotate-180">“</div>
        </div>
      )}
    </div>
  );
};

export default ArtisanStory;

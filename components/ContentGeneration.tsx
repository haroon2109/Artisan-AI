
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Language, t, languages } from '../translations';

interface Props {
  language: Language;
}

const ContentGeneration: React.FC<Props> = ({ language }) => {
  const T = t[language];
  const [platform, setPlatform] = useState('Instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const langName = languages[language];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a ${tone} ${platform} post about: ${topic}. Include emojis if appropriate for the platform. 
        IMPORTANT: Write the content in ${langName}.`,
      });
      if (response.text) {
        setContent(response.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">{T.contentGen}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{T.platform}</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black"
              >
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Twitter</option>
                <option>LinkedIn</option>
                <option>Blog Post</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{T.tone}</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Excited</option>
                <option>Storytelling</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{T.topic}</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none bg-white text-black"
                rows={4}
                placeholder="e.g. Launching our new summer collection next week..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={generate}
            disabled={loading}
            className="w-full py-3 bg-brand-red text-white rounded-lg font-bold shadow hover:bg-red-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? T.generating : T.generateBtn}
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 min-h-[400px]">
          <h3 className="font-serif font-bold text-lg mb-4 text-brand-dark">{T.contentGen}</h3>
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[300px] whitespace-pre-wrap text-gray-900 border border-gray-100">
            {content || <span className="text-gray-400">...</span>}
          </div>
          {content && (
            <button 
              onClick={() => navigator.clipboard.writeText(content)}
              className="mt-4 text-sm text-brand-red font-medium hover:underline"
            >
              {T.copyClipboard}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGeneration;

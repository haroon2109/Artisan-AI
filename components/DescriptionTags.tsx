
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Language, t, languages } from '../translations';

interface Props {
  language: Language;
}

const DescriptionTags: React.FC<Props> = ({ language }) => {
  const T = t[language];
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{description: string, hashtags: string[]} | null>(null);

  const generate = async () => {
    if (!productName) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Instruction for language
      const langName = languages[language];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a compelling ecommerce product description (max 100 words) and generate 15 relevant SEO hashtags for a product named "${productName}" with these characteristics: ${keywords}. 
        IMPORTANT: Write the result in ${langName}.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">{T.descTags}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{T.productName}</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none bg-white text-black"
              placeholder="e.g. Handwoven Silk Scarf"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{T.keyFeatures}</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none bg-white text-black"
              rows={4}
              placeholder="e.g. Red, organic dye, traditional pattern, soft texture..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <button 
            onClick={generate}
            disabled={loading}
            className="w-full py-3 bg-brand-red text-white rounded-lg font-bold shadow hover:bg-red-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? T.generating : T.generateBtn}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 min-h-[400px] shadow-sm">
          {!result ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              {T.prodDesc}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg mb-2 text-brand-dark">{T.prodDesc}</h3>
                <p className="text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{result.description}</p>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg mb-2 text-brand-dark">Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="bg-gray-50 border border-gray-100 text-blue-600 px-3 py-1 rounded-full text-sm">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionTags;

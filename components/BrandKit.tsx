
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Language, t, languages } from '../translations';

interface Props {
  language: Language;
}

const BrandKit: React.FC<Props> = ({ language }) => {
  const T = t[language];
  const [brandName, setBrandName] = useState('');
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New State for Logo
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [kit, setKit] = useState<{
    colors: string[], 
    fontPairing: string, 
    logoConcept: string
  } | null>(null);

  const generate = async () => {
    if (!brandName) return;
    setLoading(true);
    setLogoUrl(null); // Reset logo on new generation
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const langName = languages[language];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a mini brand identity for a brand named "${brandName}" with a "${vibe}" vibe.
        IMPORTANT: Provide the logoConcept and fontPairing description in ${langName}.
        Return JSON with:
        - colors: Array of 4 hex codes (palette).
        - fontPairing: Recommendation for Header/Body fonts.
        - logoConcept: A short text description of a logo idea.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              colors: { type: Type.ARRAY, items: { type: Type.STRING } },
              fontPairing: { type: Type.STRING },
              logoConcept: { type: Type.STRING }
            }
          }
        }
      });
      if (response.text) {
        setKit(JSON.parse(response.text));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateLogo = async () => {
    if (!kit || !kit.logoConcept) return;
    setLogoLoading(true);
    try {
       const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash-image',
         contents: `A simple, professional vector logo for a brand named ${brandName}. Concept: ${kit.logoConcept}. Style: ${vibe}. Minimalist, clean lines, on white background.`
       });
       
       const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
       if (imagePart && imagePart.inlineData) {
           setLogoUrl(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
       }
    } catch(e) {
        console.error(e);
    } finally {
        setLogoLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">{T.brandKit}</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{T.brandName}</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black focus:ring-2 focus:ring-brand-purple"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Earth & Clay"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{T.vibe}</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white text-black focus:ring-2 focus:ring-brand-purple"
              placeholder="e.g. Rustic, Minimalist, Luxury"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={generate}
          disabled={loading}
          className="px-8 py-3 bg-brand-purple text-white rounded-lg font-bold shadow hover:bg-purple-700 transition-colors w-full md:w-auto"
        >
          {loading ? T.generating : T.generateBtn}
        </button>
      </div>

      {kit && (
        <div className="space-y-6 animate-fade-in-up">
           {/* Colors */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-lg text-brand-dark mb-4">{T.colorPalette}</h3>
               <div className="flex gap-4 flex-wrap">
                   {kit.colors.map((color, i) => (
                       <div key={i} className="flex flex-col items-center gap-2">
                           <div className="w-20 h-20 rounded-full shadow-md border border-gray-100" style={{backgroundColor: color}}></div>
                           <span className="text-xs font-mono text-gray-500">{color}</span>
                       </div>
                   ))}
               </div>
           </div>

           {/* Typography */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-lg text-brand-dark mb-2">{T.typography}</h3>
               <p className="text-gray-800 text-lg">{kit.fontPairing}</p>
           </div>

           {/* Logo Concept */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-brand-dark">{T.logoConcept}</h3>
                    <p className="text-gray-600 mt-1 max-w-xl">{kit.logoConcept}</p>
                  </div>
                  <button 
                     onClick={generateLogo}
                     disabled={logoLoading}
                     className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                     {logoLoading ? 'Drawing...' : 'Visualize Logo'}
                  </button>
               </div>
               
               {logoUrl && (
                   <div className="mt-6 flex justify-center bg-gray-50 p-8 rounded-lg border border-dashed border-gray-200">
                       <img src={logoUrl} alt="Generated Logo" className="max-h-64 object-contain shadow-lg rounded-lg bg-white" />
                   </div>
               )}
           </div>
        </div>
      )}
    </div>
  );
};

export default BrandKit;

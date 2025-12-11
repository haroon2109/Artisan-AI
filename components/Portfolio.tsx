
import React, { useState, useEffect } from 'react';
import { Language, t } from '../translations';

interface SavedPoster {
  id: number;
  image: string;
  date: string;
  details: any;
}

interface Props {
  language: Language;
}

const Portfolio: React.FC<Props> = ({ language }) => {
  const T = t[language];
  const [posters, setPosters] = useState<SavedPoster[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kala_posters');
    if (saved) {
      setPosters(JSON.parse(saved));
    }
  }, []);

  const deletePoster = (id: number) => {
    const updated = posters.filter(p => p.id !== id);
    setPosters(updated);
    localStorage.setItem('kala_posters', JSON.stringify(updated));
  };

  const downloadPoster = (dataUrl: string, id: number) => {
      const link = document.createElement('a');
      link.download = `kala-portfolio-${id}.png`;
      link.href = dataUrl;
      link.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-brand-dark">{T.myPortfolio}</h2>
        <p className="text-gray-500 mt-2">Your collection of AI-generated marketing assets.</p>
      </div>

      {posters.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">No posters saved yet.</p>
          <p className="text-gray-400 text-sm">Head to the Poster Generator to create your first design!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posters.map((poster) => (
            <div key={poster.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
                <img src={poster.image} alt="Saved Poster" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                        onClick={() => downloadPoster(poster.image, poster.id)}
                        className="p-2 bg-white rounded-full text-brand-dark hover:text-brand-red transition-colors"
                        title={T.download}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                     <button 
                        onClick={() => deletePoster(poster.id)}
                        className="p-2 bg-white rounded-full text-brand-dark hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{poster.date}</span>
                <span className="font-medium text-brand-dark truncate max-w-[150px]">{poster.details?.headline}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;


import React from 'react';
import { Language, t } from '../translations';

interface Props {
  language: Language;
}

const InspirationWall: React.FC<Props> = ({ language }) => {
  const T = t[language];
  // Using styled gradients/blocks to simulate images for reliability
  const ideas = [
    { color: "from-purple-400 to-indigo-500", title: "Minimalist Pottery", author: "Clay & Co" },
    { color: "from-pink-400 to-rose-500", title: "Handloom Weaves", author: "Silk Route" },
    { color: "from-amber-200 to-orange-400", title: "Wooden Crafts", author: "Timber Tales" },
    { color: "from-teal-400 to-emerald-500", title: "Natural Dyes", author: "Eco Colors" },
    { color: "from-blue-400 to-cyan-500", title: "Blue Pottery", author: "Jaipur Blue" },
    { color: "from-fuchsia-400 to-pink-500", title: "Festive Decor", author: "Celebrations" },
    { color: "from-gray-700 to-gray-900", title: "Metal Work", author: "Iron Art" },
    { color: "from-yellow-300 to-amber-500", title: "Brass Artifacts", author: "Golden Era" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
       <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">{T.inspirationWall}</h2>
       <p className="text-gray-500 mb-8">Discover what other artisans are creating.</p>

       <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
         {ideas.map((idea, i) => (
           <div key={i} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group cursor-pointer">
             <div className={`h-48 md:h-64 bg-gradient-to-br ${idea.color} relative`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
             </div>
             <div className="p-4">
               <h3 className="font-bold text-brand-dark">{idea.title}</h3>
               <p className="text-xs text-gray-400 mt-1">by {idea.author}</p>
               <div className="flex items-center gap-4 mt-3">
                 <button className="text-gray-400 hover:text-red-500 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                   </svg>
                 </button>
                 <span className="text-xs text-gray-400">{T.saveIdea}</span>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default InspirationWall;

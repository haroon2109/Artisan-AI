
import React from 'react';
import { Language, t } from '../translations';

interface Props {
  language: Language;
}

export const MarketAnalytics: React.FC<Props> = ({ language }) => {
  const T = t[language];
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">{T.marketAnalytics}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{T.totalViews}</p>
          <p className="text-4xl font-bold text-brand-dark mt-2">1,284</p>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↑</span> 12%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{T.customerInq}</p>
          <p className="text-4xl font-bold text-brand-dark mt-2">34</p>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <span className="mr-1">↑</span> 5
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{T.topProduct}</p>
          <p className="text-xl font-bold text-brand-dark mt-2 truncate">Handwoven Silk Scarf</p>
          <p className="text-gray-400 text-sm mt-2">Most generated posters</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-brand-dark mb-6">Engagement Overview</h3>
        <div className="h-64 flex items-end justify-between gap-4 px-4">
          {[40, 65, 30, 85, 50, 95, 75].map((h, i) => (
            <div key={i} className="w-full bg-orange-100 rounded-t-lg relative group">
               <div 
                 className="absolute bottom-0 left-0 right-0 bg-brand-red rounded-t-lg transition-all duration-500 group-hover:bg-brand-pink" 
                 style={{height: `${h}%`}}
               ></div>
               <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-400">
                 {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrendExplorer: React.FC<Props> = ({ language }) => {
  const T = t[language];
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">{T.trendExplorer}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[
           { title: "Sustainable Packaging", tag: "Eco-Friendly", color: "bg-green-100 text-green-700" },
           { title: "Terracotta Minimalism", tag: "Home Decor", color: "bg-orange-100 text-orange-700" },
           { title: "Indigo Dyes", tag: "Textiles", color: "bg-blue-100 text-blue-700" },
           { title: "Personalized Gifting", tag: "Market Trend", color: "bg-purple-100 text-purple-700" },
           { title: "Behind the Scenes Reels", tag: "Social Media", color: "bg-pink-100 text-pink-700" },
           { title: "Traditional Motifs", tag: "Design", color: "bg-yellow-100 text-yellow-700" },
         ].map((trend, i) => (
           <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
             <span className={`px-2 py-1 rounded text-xs font-bold ${trend.color} uppercase`}>{trend.tag}</span>
             <h3 className="text-xl font-bold text-brand-dark mt-3">{trend.title}</h3>
             <p className="text-gray-500 text-sm mt-2">Trending up in India over the last 30 days.</p>
             <button className="mt-4 text-brand-red font-medium text-sm flex items-center">
               {T.viewExamples} <span className="ml-1">→</span>
             </button>
           </div>
         ))}
      </div>
    </div>
  );
};

export const LearnGrow: React.FC<Props> = ({ language }) => {
  const T = t[language];
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">{T.learnGrow}</h2>
      <div className="space-y-4">
        {[
          { title: "Product Photography 101 with your Phone", time: "5 min read" },
          { title: "How to Price Your Handmade Goods", time: "8 min read" },
          { title: "Writing Captions that Convert", time: "4 min read" },
          { title: "Packaging Ideas for Fragile Items", time: "6 min read" },
        ].map((article, i) => (
          <div key={i} className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-brand-peach transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-peach flex items-center justify-center text-brand-red font-serif font-bold text-xl">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-red transition-colors">{article.title}</h3>
                <p className="text-gray-400 text-sm">{article.time}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SmartScheduler: React.FC<Props> = ({ language }) => {
  const T = t[language];
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-3xl font-serif font-bold text-brand-dark">{T.smartScheduler}</h2>
         <button className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-bold">+ New Post</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
            <div key={d} className="p-4 text-center text-sm font-bold text-gray-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[500px]">
           {Array.from({length: 31}).map((_, i) => (
             <div key={i} className="border-r border-b border-gray-100 p-2 min-h-[100px] relative hover:bg-gray-50 transition-colors">
               <span className="text-xs text-gray-400 font-medium block mb-1">{i + 1}</span>
               {i === 2 && (
                 <div className="bg-blue-100 text-blue-700 p-1.5 rounded text-xs font-bold mb-1 cursor-pointer">
                   🚀 New
                 </div>
               )}
                {i === 5 && (
                 <div className="bg-pink-100 text-pink-700 p-1.5 rounded text-xs font-bold mb-1 cursor-pointer">
                   📸 Reel
                 </div>
               )}
               {i === 12 && (
                 <div className="bg-orange-100 text-orange-700 p-1.5 rounded text-xs font-bold mb-1 cursor-pointer">
                   ✨ Update
                 </div>
               )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

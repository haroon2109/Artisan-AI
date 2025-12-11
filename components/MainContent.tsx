
import React from 'react';
import FeatureCard from './FeatureCard';
import { LightbulbIcon, MultiLanguageIcon, SmileyFaceIcon } from './icons';
import PosterGenerator from './PosterGenerator';
import Portfolio from './Portfolio';
import DescriptionTags from './DescriptionTags';
import ContentGeneration from './ContentGeneration';
import ArtisanStory from './ArtisanStory';
import BrandKit from './BrandKit';
import InspirationWall from './InspirationWall';
import { MarketAnalytics, TrendExplorer, LearnGrow, SmartScheduler } from './GrowFeatures';
import { Language, t } from '../translations';

interface MainContentProps {
  activeView: string;
  setActiveView: (view: string) => void;
  language: Language;
}

const MainContent: React.FC<MainContentProps> = ({ activeView, setActiveView, language }) => {
  return (
    <main className="h-full w-full overflow-y-auto p-8 md:p-12 scroll-smooth">
      {activeView === 'Home' && <HomeView language={language} onNavigate={setActiveView} />}
      
      {/* Generate Section */}
      {activeView === 'Poster Generator' && <PosterGenerator language={language} />}
      {activeView === 'Description & Tags' && <DescriptionTags language={language} />}
      {activeView === 'Content Generation' && <ContentGeneration language={language} />}
      {activeView === 'Artisan Story' && <ArtisanStory language={language} />}
      {activeView === 'Brand Kit' && <BrandKit language={language} />}

      {/* Grow Section */}
      {activeView === 'Market Analytics' && <MarketAnalytics language={language} />}
      {activeView === 'Trend Explorer' && <TrendExplorer language={language} />}
      {activeView === 'Learn & Grow' && <LearnGrow language={language} />}
      {activeView === 'Smart Scheduler' && <SmartScheduler language={language} />}

      {/* Work Section */}
      {activeView === 'My Portfolio' && <Portfolio language={language} />}
      {activeView === 'Inspiration Wall' && <InspirationWall language={language} />}
    </main>
  );
};

const HomeView: React.FC<{language: Language, onNavigate: (view: string) => void}> = ({ language, onNavigate }) => {
  const T = t[language];
  
  return (
    <div className="max-w-6xl mx-auto space-y-24">
      
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center justify-center py-10 animate-fade-in-up">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-brand-dark mb-6 tracking-tight leading-tight">
          Create Posters that <br/>
          <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-brand-teal text-transparent bg-clip-text">
             Actually Sell
          </span>
        </h1>
        <p className="max-w-3xl mx-auto mt-6 text-xl text-gray-500 font-light leading-relaxed">
           Our AI acts as your personal designer, creating stunning, high-quality advertisements that attract buyers and elevate your brand in seconds.
        </p>
        <button 
          onClick={() => onNavigate('Poster Generator')}
          className="mt-10 px-10 py-4 bg-gradient-to-r from-brand-pink to-brand-purple text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          Start Generating for Free
        </button>
      </section>

      {/* Showcase Section */}
      <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">
              From <span className="bg-gradient-to-r from-brand-deep-orange to-brand-light-orange text-transparent bg-clip-text">Your Art</span> to Masterpiece
            </h2>
            <p className="text-gray-500 mt-4 text-lg">See what our AI can create in seconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               "https://images.unsplash.com/photo-1620714223084-86c6df4574aa?q=80&w=600&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1599422402126-48a0496a75a7?q=80&w=600&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1571380036109-64530040521e?q=80&w=600&auto=format&fit=crop",
               "https://images.unsplash.com/photo-1594224391629-9e8da745815f?q=80&w=600&auto=format&fit=crop"
             ].map((src, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 h-80 relative group cursor-pointer bg-white border border-gray-100">
                    <img src={src} alt="Showcase" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
             ))}
          </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <FeatureCard 
          icon={<LightbulbIcon className="w-12 h-12 text-brand-pink" />}
          title="AI-Powered Design"
          description="Get beautiful, professional posters without hiring a designer. Our AI understands art and marketing."
        />
        <FeatureCard 
          icon={<MultiLanguageIcon className="w-12 h-12 text-brand-purple" />}
          title="Multi-Language Support"
          description="Create content in English, Hindi, Tamil, Telugu and more to connect with customers across India."
        />
        <FeatureCard 
          icon={<SmileyFaceIcon className="w-12 h-12 text-brand-teal" />}
          title="Simple & Fast"
          description="Just upload a photo and add your text. You'll get a stunning poster in less than a minute."
        />
      </section>
      
      {/* Footer Area */}
      <footer className="border-t border-gray-200 py-10 text-center text-gray-400">
         <p>&copy; 2025 Kala Sahayak. Empowering the Artisans of India.</p>
      </footer>
    </div>
  );
};

export default MainContent;

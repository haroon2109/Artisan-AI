
import React from 'react';
import type { NavItem } from '../types';
import { HomeIcon, PosterGeneratorIcon, DescriptionTagsIcon, ContentGenerationIcon, ArtisanStoryIcon, BrandKitIcon, MarketAnalyticsIcon, TrendExplorerIcon, LearnGrowIcon, SmartSchedulerIcon, MyPortfolioIcon, InspirationWallIcon, ChevronLeftIcon } from './icons';
import { Language, languages, t } from '../translations';

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onClose?: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem, language, setLanguage, onClose, onLogout }) => {
  
  const T = t[language];

  const generateItems: NavItem[] = [
    { name: T.posterGenerator, icon: PosterGeneratorIcon, id: 'Poster Generator' },
    { name: T.descTags, icon: DescriptionTagsIcon, id: 'Description & Tags' },
    { name: T.contentGen, icon: ContentGenerationIcon, id: 'Content Generation' },
    { name: T.artisanStory, icon: ArtisanStoryIcon, id: 'Artisan Story' },
    { name: T.brandKit, icon: BrandKitIcon, id: 'Brand Kit' },
  ];

  const growItems: NavItem[] = [
    { name: T.marketAnalytics, icon: MarketAnalyticsIcon, id: 'Market Analytics' },
    { name: T.trendExplorer, icon: TrendExplorerIcon, id: 'Trend Explorer' },
    { name: T.learnGrow, icon: LearnGrowIcon, id: 'Learn & Grow' },
    { name: T.smartScheduler, icon: SmartSchedulerIcon, id: 'Smart Scheduler' },
  ];

  const myWorkItems: NavItem[] = [
    { name: T.myPortfolio, icon: MyPortfolioIcon, id: 'My Portfolio' },
    { name: T.inspirationWall, icon: InspirationWallIcon, id: 'Inspiration Wall' },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg p-6 flex flex-col shrink-0 border-r border-stone-200 h-full relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.542L16.5 21.75l-.398-1.208a3.375 3.375 0 00-2.456-2.456L12.75 18l1.208-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.208a3.375 3.375 0 002.456 2.456l1.208.398-1.208.398a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-brand-dark leading-none">
                Kala <span className="text-brand-red">Sahayak</span>
                </h1>
            </div>
        </div>
        
        {onClose && (
            <button 
                onClick={onClose} 
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                title="Collapse Sidebar"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
        )}
      </div>

      <div className="mb-6">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Language / भाषा</label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full p-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-brand-peach outline-none"
          >
            {(Object.keys(languages) as Language[]).map((lang) => (
                <option key={lang} value={lang}>{languages[lang]}</option>
            ))}
          </select>
      </div>

      <nav className="flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1 mb-4">
        <NavItemComponent
          item={{ name: T.home, icon: HomeIcon }}
          isActive={activeItem === 'Home'}
          onClick={() => setActiveItem('Home')}
          isHome={true}
        />
        
        <NavSection title={T.generate} items={generateItems} activeItem={activeItem} setActiveItem={setActiveItem} />
        <NavSection title={T.grow} items={growItems} activeItem={activeItem} setActiveItem={setActiveItem} />
        <NavSection title={T.myWork} items={myWorkItems} activeItem={activeItem} setActiveItem={setActiveItem} />
      </nav>

      {/* Logout Button */}
      <div className="pt-4 border-t border-stone-200">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 w-full hover:bg-red-50 text-red-500 hover:text-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="font-medium">{T.logout}</span>
        </button>
      </div>
    </aside>
  );
};

interface NavSectionProps {
    title: string;
    items: any[];
    activeItem: string;
    setActiveItem: (name: string) => void;
}

const NavSection: React.FC<NavSectionProps> = ({ title, items, activeItem, setActiveItem }) => (
    <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
        <div className="flex flex-col gap-1">
            {items.map((item) => (
                <NavItemComponent
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                />
            ))}
        </div>
    </div>
);


interface NavItemComponentProps {
    item: any;
    isActive: boolean;
    onClick: () => void;
    isHome?: boolean;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({ item, isActive, onClick, isHome = false }) => {
    const baseClasses = "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200";
    const activeClasses = isHome ? "bg-brand-peach text-brand-peach-text" : "bg-white shadow-sm text-brand-dark";
    const inactiveClasses = "hover:bg-gray-200/50 text-gray-600";

    return (
        <a onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-pink' : 'text-gray-400'}`} />
            <span className={`font-medium ${isActive ? 'text-brand-dark' : ''}`}>{item.name}</span>
        </a>
    );
};


export default Sidebar;

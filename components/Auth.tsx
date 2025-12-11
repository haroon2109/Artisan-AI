import React, { useState } from 'react';
import { Language, t, languages } from '../translations';
import { PosterGeneratorIcon, MultiLanguageIcon, MarketAnalyticsIcon } from './icons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/lib/firebase';

interface AuthProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const Auth: React.FC<AuthProps> = ({ language, setLanguage }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const T = t[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // Auth state change will trigger re-render in App
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row font-sans">

            {/* Left Side: Features Showcase (Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 bg-brand-dark text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative Background Blob */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-full h-full opacity-5 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#EC4899" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-4.9C93.4,9.5,81.8,23.3,70.8,35.4C59.8,47.5,49.5,57.9,37.6,65.7C25.7,73.5,12.2,78.7,-0.7,79.9C-13.6,81.1,-26.3,78.3,-37.8,71.9C-49.3,65.5,-59.6,55.5,-68,43.6C-76.4,31.7,-82.9,17.9,-84.6,3.3C-86.3,-11.3,-83.2,-26.7,-74.6,-39.6C-66,-52.5,-51.9,-62.9,-37.5,-70.1C-23.1,-77.3,-8.4,-81.3,4.3,-88.7L17,-96.1Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.542L16.5 21.75l-.398-1.208a3.375 3.375 0 00-2.456-2.456L12.75 18l1.208-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.208a3.375 3.375 0 002.456 2.456l1.208.398-1.208.398a3.375 3.375 0 00-2.456 2.456z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold font-serif tracking-wide">Kala Sahayak</h1>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-peach to-brand-pink">
                        Empowering Artisans <br /> with AI
                    </h2>
                    <p className="text-gray-300 text-lg mb-12 max-w-md font-light">
                        Create stunning marketing assets, connect with customers in any language, and grow your business with smart tools designed for you.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <PosterGeneratorIcon className="w-6 h-6 text-brand-pink" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">AI Poster Generator</h3>
                                <p className="text-gray-400 text-sm">Design professional ads from product photos instantly.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <MultiLanguageIcon className="w-6 h-6 text-brand-purple" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Multi-Language Support</h3>
                                <p className="text-gray-400 text-sm">Available in Hindi, Tamil, Telugu, and 6+ languages.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <MarketAnalyticsIcon className="w-6 h-6 text-brand-teal" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Smart Growth Tools</h3>
                                <p className="text-gray-400 text-sm">Analytics, content ideas, and market trend insights.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-500 mt-auto">
                    &copy; 2025 Kala Sahayak AI. All rights reserved.
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 relative">
                {/* Language Selector */}
                <div className="absolute top-6 right-6">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-brand-red outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        {(Object.keys(languages) as Language[]).map((lang) => (
                            <option key={lang} value={lang}>{languages[lang]}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-red to-brand-pink p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                        <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-brand-red mb-4 shadow-lg relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif font-bold relative z-10">{isLogin ? T.welcomeBack : T.createAccount}</h2>
                        <p className="text-white/80 text-sm mt-1 relative z-10">Access your artisan dashboard</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{T.email}</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all bg-gray-50 focus:bg-white text-black"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{T.password}</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all bg-gray-50 focus:bg-white text-black"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-brand-dark text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : (isLogin ? T.login : T.signup)}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-500 text-sm">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-brand-pink font-bold hover:underline"
                                >
                                    {isLogin ? T.signup : T.login}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

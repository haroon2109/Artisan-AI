
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Loader2, Upload, Undo2, Redo2, Wand2, Download, Save } from 'lucide-react';
import { Language, t, languages } from '../translations';

// --- Types ---

type BackgroundMode = 'image' | 'solid' | 'gradient' | 'pattern';
type FontStyle = 'Lora' | 'Inter' | 'cursive' | 'Impact' | 'monospace';
type LayoutStyle = 'modern' | 'ornate';

interface Gradient {
  name: string;
  colors: string[];
}

// Consolidated State for History
interface PosterState {
  // Content
  headline: string;
  tagline: string;
  brandName: string; 
  
  // Style & Layout
  layoutStyle: LayoutStyle; 
  primaryColor: string;
  accentColor: string;
  overlayPosition: 'top' | 'bottom' | 'center';
  
  // Background
  bgMode: BackgroundMode;
  bgColor: string;
  bgGradient: Gradient;
  
  // Typography & Effects
  headlineScale: number;
  taglineScale: number;
  headlineFont: FontStyle;
  taglineFont: FontStyle;
  overlayOpacity: number;
}

const GRADIENTS: Gradient[] = [
  { name: 'Sunset', colors: ['#FF9A9E', '#FECFEF'] },
  { name: 'Ocean', colors: ['#a18cd1', '#fbc2eb'] },
  { name: 'Peach', colors: ['#fad0c4', '#ffd1ff'] },
  { name: 'Mint', colors: ['#84fab0', '#8fd3f4'] },
  { name: 'Night', colors: ['#30cfd0', '#330867'] },
  { name: 'Warmth', colors: ['#f6d365', '#fda085'] },
  { name: 'Royal', colors: ['#1e3a8a', '#172554'] }, 
];

const FONTS: { label: string; value: FontStyle }[] = [
  { label: 'Elegant (Serif)', value: 'Lora' },
  { label: 'Modern (Sans)', value: 'Inter' },
  { label: 'Handwritten', value: 'cursive' },
  { label: 'Bold (Impact)', value: 'Impact' },
  { label: 'Tech (Mono)', value: 'monospace' },
];

interface StyleOption {
    id: string;
    labelKey: string;
    desc: string;
    colors: string[];
}

const STYLES: StyleOption[] = [
  { id: 'festival', labelKey: 'styleFestival', desc: 'Vibrant, colorful & energetic', colors: ['#ff9966', '#ff5e62'] },
  { id: 'traditional', labelKey: 'styleTraditional', desc: 'Classic patterns & heritage look', colors: ['#1e3a8a', '#D4AF37'] },
  { id: 'modern', labelKey: 'styleModern', desc: 'Clean, sleek & contemporary', colors: ['#ffffff', '#000000'] },
  { id: 'western', labelKey: 'styleWestern', desc: 'Minimalist & sophisticated', colors: ['#2C3E50', '#FD746C'] },
  { id: 'indian', labelKey: 'styleIndian', desc: 'Rich, ornate & cultural', colors: ['#e65c00', '#F9D423'] },
  { id: 'vintage', labelKey: 'styleVintage', desc: 'Retro, nostalgic & timeless', colors: ['#8B4513', '#F4A460'] },
  { id: 'luxury', labelKey: 'styleLuxury', desc: 'Premium, gold & black', colors: ['#000000', '#D4AF37'] },
  { id: 'minimalist', labelKey: 'styleMinimalist', desc: 'Simple, clean & spacious', colors: ['#E0E0E0', '#757575'] },
  { id: 'bold', labelKey: 'styleBold', desc: 'High contrast & loud', colors: ['#FFD700', '#FF0000'] },
  { id: 'organic', labelKey: 'styleOrganic', desc: 'Natural & earthy', colors: ['#4CAF50', '#8BC34A'] },
];

interface PosterGeneratorProps {
  language: Language;
}

const PosterGenerator: React.FC<PosterGeneratorProps> = ({ language }) => {
  const T = t[language];
  
  // --- Global State ---
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  // Personalize Inputs
  const [manualBrandName, setManualBrandName] = useState('');
  const [manualTagline, setManualTagline] = useState('');

  // Style Input
  const [selectedStyle, setSelectedStyle] = useState('festival');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- History State ---
  const [history, setHistory] = useState<PosterState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Derived current state (or null if nothing generated yet)
  const currentState = currentIndex >= 0 ? history[currentIndex] : null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Actions ---

  const pushState = (newState: PosterState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const updateState = (updates: Partial<PosterState>) => {
    if (!currentState) return;
    pushState({ ...currentState, ...updates });
  };

  const undo = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const redo = () => {
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setHistory([]);
        setCurrentIndex(-1);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePoster = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      let prompt = `You are an expert graphic designer helping an artisan sell their product. 
              Based on the image and this description: "${description}", create catchy content for a marketing poster.
              The visual style should be: ${selectedStyle}.
              
              IMPORTANT: Generate content in ${languages[language]}.`;

      if (manualBrandName) {
         prompt += ` The brand name is "${manualBrandName}". Use this.`;
      }
      if (manualTagline) {
         prompt += ` The primary tagline/offer is "${manualTagline}". Use this.`;
      } else {
         prompt += ` Generate a catchy tagline/offer.`;
      }

      prompt += `
              Return a JSON object with:
              - headline: ${manualBrandName ? 'The Brand Name provided' : 'A short brand-like headline (3-5 words)'}.
              - tagline: ${manualTagline ? 'The Tagline provided' : 'A persuasive sub-headline or offer (e.g. 25% Off)'}.
              - primaryColor: A hex code for the main text.
              - accentColor: A hex code for graphical elements.
              - overlayPosition: Best position ("top", "bottom", or "center").
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              tagline: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              overlayPosition: { type: Type.STRING, enum: ['top', 'bottom', 'center'] }
            },
            required: ['headline', 'tagline', 'primaryColor', 'accentColor', 'overlayPosition']
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        
        // Determine default layout based on Style
        let layoutStyle: LayoutStyle = 'modern';
        let bgMode: BackgroundMode = 'gradient';
        let headlineFont: FontStyle = 'Inter';

        // Mapping requested categories to internal visual logic
        if (['festival', 'indian', 'traditional', 'vintage', 'luxury'].includes(selectedStyle)) {
            layoutStyle = 'ornate';
            bgMode = 'pattern';
            headlineFont = 'Lora';
        } else if (['western', 'modern', 'minimalist', 'bold', 'organic'].includes(selectedStyle)) {
            layoutStyle = 'modern';
            bgMode = 'image';
            headlineFont = 'Inter';
        }

        // Create initial state
        const initialState: PosterState = {
          headline: data.headline || manualBrandName,
          tagline: data.tagline || manualTagline,
          brandName: manualBrandName || data.headline,
          primaryColor: data.primaryColor,
          accentColor: data.accentColor,
          overlayPosition: data.overlayPosition as 'top' | 'bottom' | 'center',
          bgMode: bgMode,
          bgColor: '#1e3a8a',
          bgGradient: GRADIENTS[6],
          headlineScale: 1,
          taglineScale: 1,
          headlineFont: headlineFont,
          taglineFont: 'Inter',
          overlayOpacity: 0.8,
          layoutStyle: layoutStyle
        };

        pushState(initialState);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate poster content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Canvas Logic ---
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  const drawPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const grd = ctx.createLinearGradient(0, 0, width, height);
      grd.addColorStop(0, '#1e3a8a');
      grd.addColorStop(1, '#172554');
      ctx.fillStyle = grd;
      ctx.fillRect(0,0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < width; i += 60) {
          for (let j = 0; j < height; j += 60) {
              ctx.beginPath();
              ctx.arc(i, j, 20, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.beginPath();
              ctx.arc(i + 30, j + 30, 10, 0, Math.PI * 2);
              ctx.fill();
          }
      }
  };

  const drawCanvas = useCallback((callback?: (dataUrl: string) => void) => {
    if (!canvasRef.current || !currentState || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Canvas Setup
      const MAX_WIDTH = 1200;
      const scale = Math.min(1, MAX_WIDTH / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const { width, height } = canvas;

      // --- Helper for Styled Image Drawing ---
      const drawStyledImage = (
        rect: {x: number, y: number, w: number, h: number},
        style: { border?: string, borderWidth?: number, shadow?: boolean, rounded?: number }
      ) => {
          const imgRatio = img.width / img.height;
          
          let dw = rect.w;
          let dh = rect.w / imgRatio;
          
          if (dh > rect.h) {
              dh = rect.h;
              dw = dh * imgRatio;
          }
          
          const dx = rect.x + (rect.w - dw) / 2;
          const dy = rect.y + (rect.h - dh) / 2;

          ctx.save();
          if (style.shadow) {
              ctx.shadowColor = 'rgba(0,0,0,0.4)';
              ctx.shadowBlur = 30;
              ctx.shadowOffsetY = 15;
          }

          // Path construction
          ctx.beginPath();
          if (style.rounded) {
             ctx.roundRect(dx, dy, dw, dh, style.rounded);
          } else {
             ctx.rect(dx, dy, dw, dh);
          }

          // Clip and Draw
          ctx.save();
          if (style.rounded) ctx.clip();
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();

          // Draw Border
          if (style.border && style.borderWidth) {
              ctx.lineWidth = style.borderWidth;
              ctx.strokeStyle = style.border;
              ctx.stroke();
          }
          ctx.restore();
      };

      // --- ORNATE STYLE ---
      if (currentState.layoutStyle === 'ornate') {
          // 1. Pattern Background
          drawPattern(ctx, width, height);

          // 2. Gold Border Frame
          const borderW = width * 0.03;
          ctx.strokeStyle = '#D4AF37'; // Gold
          ctx.lineWidth = borderW;
          ctx.strokeRect(borderW/2, borderW/2, width - borderW, height - borderW);
          
          ctx.strokeStyle = '#FDE68A'; 
          ctx.lineWidth = 2;
          ctx.strokeRect(borderW * 1.5, borderW * 1.5, width - (borderW * 3), height - (borderW * 3));

          // 3. Text Badge
          const badgeH = height * 0.35;
          const badgeW = width * 0.7;
          const badgeX = (width - badgeW) / 2;
          const badgeY = borderW * 2;

          ctx.fillStyle = '#FFF8E7'; // Cream
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, [20, 20, 50, 50]);
          ctx.fill();
          
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Text Rendering
          ctx.textAlign = 'center';
          const headlineSize = Math.floor(width * 0.08 * currentState.headlineScale);
          ctx.font = `italic 600 ${headlineSize}px "${currentState.headlineFont}", serif`; 
          ctx.fillStyle = '#1e3a8a';
          
          const textMargin = badgeH * 0.15;
          const hlY = badgeY + textMargin + (headlineSize/2);
          wrapText(ctx, currentState.headline, width/2, hlY, badgeW * 0.9, headlineSize * 1.1);

          const taglineSize = Math.floor(width * 0.12 * currentState.taglineScale); 
          ctx.font = `800 ${taglineSize}px "${currentState.taglineFont}", sans-serif`;
          ctx.fillStyle = '#1e3a8a'; 
          wrapText(ctx, currentState.tagline, width/2, hlY + headlineSize + 20, badgeW * 0.9, taglineSize * 1.1);

          // 4. Product Image with Gold Frame
          const imgAreaY = badgeY + badgeH + 20;
          const imgAreaH = height - imgAreaY - (borderW * 2);
          const imgAreaW = width - (borderW * 4);
          
          drawStyledImage(
              { x: borderW * 2, y: imgAreaY, w: imgAreaW, h: imgAreaH },
              { border: '#D4AF37', borderWidth: 8, shadow: true, rounded: 12 }
          );

      } else {
          // --- MODERN STYLE ---
          const padding = width * 0.08;
          const contentW = width - (padding * 2);
          const contentH = height - (padding * 2);
          const isTop = currentState.overlayPosition === 'top';
          const isCenter = currentState.overlayPosition === 'center';
          
          // 1. Background
          if (currentState.bgMode === 'image') {
              // Blurred Ambient Background
              ctx.save();
              ctx.filter = 'blur(40px) brightness(0.85) saturate(1.2)';
              ctx.drawImage(img, -width*0.1, -height*0.1, width*1.2, height*1.2);
              ctx.restore();
          } else {
              if (currentState.bgMode === 'solid') {
                  ctx.fillStyle = currentState.bgColor;
                  ctx.fillRect(0, 0, width, height);
              } else {
                  const grd = ctx.createLinearGradient(0, 0, width, height);
                  grd.addColorStop(0, currentState.bgGradient.colors[0]);
                  grd.addColorStop(1, currentState.bgGradient.colors[1]);
                  ctx.fillStyle = grd;
                  ctx.fillRect(0, 0, width, height);
              }
          }

          // 2. Main Focal Image
          if (isCenter) {
             if (currentState.bgMode === 'image') {
                 ctx.drawImage(img, 0, 0, width, height);
                 ctx.fillStyle = `rgba(0,0,0,${currentState.overlayOpacity})`;
                 ctx.fillRect(0, 0, width, height);
             } else {
                  drawStyledImage(
                      { x: padding/2, y: padding/2, w: width-padding, h: height-padding },
                      { shadow: true, rounded: 16 }
                  );
                 ctx.fillStyle = `rgba(0,0,0,${currentState.overlayOpacity * 0.7})`;
                 ctx.fillRect(0, 0, width, height);
             }
          } else {
             const imgY = isTop ? height * 0.35 : padding;
             const imgH = height * 0.6;
             
             drawStyledImage(
                 { x: padding, y: imgY, w: contentW, h: imgH },
                 { border: '#ffffff', borderWidth: width * 0.02, shadow: true, rounded: 16 }
             );
          }

          // 3. Text
          ctx.textAlign = 'center';
          ctx.fillStyle = currentState.primaryColor;
          
          const headlineSize = Math.floor(width * 0.08 * currentState.headlineScale);
          const taglineSize = Math.floor(width * 0.04 * currentState.taglineScale);
          
          let textY = isTop ? padding + headlineSize : (isCenter ? height / 2 - headlineSize : height - (headlineSize * 3));

          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          ctx.font = `bold ${headlineSize}px "${currentState.headlineFont}", sans-serif`;
          const hlHeight = wrapText(ctx, currentState.headline, width / 2, textY, width * 0.9, headlineSize * 1.2);

          ctx.font = `italic ${taglineSize}px "${currentState.taglineFont}", sans-serif`;
          ctx.fillStyle = currentState.accentColor;
          
          wrapText(ctx, currentState.tagline, width / 2, hlHeight + 20, width * 0.9, taglineSize * 1.2);
          
          ctx.shadowBlur = 0;
      }

      if (callback) {
        callback(canvas.toDataURL('image/png'));
      }
    };
    img.src = image;
  }, [currentState, image]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleDownload = () => {
    drawCanvas((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'kala-sahayak-poster.png';
      link.href = dataUrl;
      link.click();
    });
  };

  const handleSave = () => {
    drawCanvas((dataUrl) => {
      const savedPoster = {
        id: Date.now(),
        image: dataUrl,
        date: new Date().toLocaleDateString(),
        details: currentState
      };

      const existing = localStorage.getItem('kala_posters');
      const posters = existing ? JSON.parse(existing) : [];
      localStorage.setItem('kala_posters', JSON.stringify([savedPoster, ...posters]));
      setSuccessMsg(T.savePortfolio + "!");
      setTimeout(() => setSuccessMsg(''), 3000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] p-4 flex flex-col md:flex-row gap-6 bg-[#FAF9F6]">
      {/* Left Panel: Inputs */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 overflow-y-auto pb-8 custom-scrollbar pr-2">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">{T.posterGenerator}</h2>
          <p className="text-gray-500">Follow the steps below to create your ad.</p>
        </div>

        {/* Step 1: Upload */}
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100 mt-2">
            <div className="absolute top-0 left-0 bg-[#E91E63] text-white px-5 py-2 rounded-br-2xl rounded-tl-2xl font-bold text-sm shadow-sm z-10">
                Step 1
            </div>
            <div className="pt-8">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl w-full p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-pink-50 hover:border-[#E91E63] transition-all min-h-[160px] group"
                >
                    {image ? (
                        <div className="relative w-full h-32">
                             <img src={image} alt="Preview" className="w-full h-full object-contain rounded" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium rounded">
                                Change Image
                             </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <Upload className="h-10 w-10 text-[#E91E63] mb-3" />
                            <p className="font-medium text-gray-600">Drag and drop or click to upload</p>
                        </div>
                    )}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                    />
                </div>
            </div>
        </div>

        {/* Step 2: Personalize */}
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
            <div className="absolute top-0 left-0 bg-[#8E44AD] text-white px-5 py-2 rounded-br-2xl rounded-tl-2xl font-bold text-sm shadow-sm z-10">
                Step 2
            </div>
            <div className="pt-8 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Brand Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Ritu's Pottery"
                        value={manualBrandName}
                        onChange={(e) => setManualBrandName(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E44AD] focus:border-transparent outline-none bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tagline</label>
                    <input 
                        type="text" 
                        placeholder="e.g., 20% Off"
                        value={manualTagline}
                        onChange={(e) => setManualTagline(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E44AD] focus:border-transparent outline-none bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Message/Offer</label>
                    <textarea
                        rows={2}
                        placeholder="Describe your product..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E44AD] focus:border-transparent outline-none bg-gray-50 resize-none"
                    />
                </div>
            </div>
        </div>

        {/* Step 3: Style Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
            <div className="absolute top-0 left-0 bg-[#1ABC9C] text-white px-5 py-2 rounded-br-2xl rounded-tl-2xl font-bold text-sm shadow-sm z-10">
                Step 3
            </div>
            <div className="pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STYLES.map((style) => {
                        const isSelected = selectedStyle === style.id;
                        return (
                            <button
                                key={style.id}
                                onClick={() => setSelectedStyle(style.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
                                    ${isSelected 
                                    ? 'bg-[#1ABC9C]/10 border-[#1ABC9C] text-[#1ABC9C]' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#1ABC9C]/50'}`}
                            >
                                {(T as any)[style.labelKey] || style.id}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Generate Button */}
        <button
            onClick={generatePoster}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" /> Creating...
                </>
            ) : (
                <>
                   <Wand2 className="w-5 h-5" /> {currentState ? 'Regenerate' : T.generatePoster}
                </>
            )}
        </button>
        
        {/* Error Message */}
        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
        {successMsg && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{successMsg}</div>}

        {/* EDIT CONTROLS - Only visible after generation */}
        {currentState && image && (
          <div className="flex flex-col gap-6 animate-fade-in border-t border-gray-200 pt-6">
            
            {/* Undo/Redo */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Customize Result</h3>
                <div className="flex gap-2">
                    <button onClick={undo} disabled={currentIndex <= 0} className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30">
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button onClick={redo} disabled={currentIndex >= history.length - 1} className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30">
                        <Redo2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Layout Style Selector */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Layout Style</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['modern', 'ornate'] as LayoutStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateState({ layoutStyle: style })}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize
                      ${currentState.layoutStyle === style ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Settings */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{T.bgStyle}</label>
              <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                {(['image', 'solid', 'gradient', 'pattern'] as BackgroundMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => updateState({ bgMode: mode })}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase rounded transition-all
                            ${currentState.bgMode === mode ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {mode}
                    </button>
                ))}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                 {GRADIENTS.map((g, i) => (
                     <button 
                        key={i}
                        onClick={() => updateState({ bgGradient: g, bgMode: 'gradient' })}
                        className="w-8 h-8 rounded-full flex-shrink-0 border border-gray-200"
                        style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}
                     />
                 ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full md:w-2/3 bg-gray-200 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
         
         {image ? (
            <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white max-h-full max-w-full">
                 <canvas ref={canvasRef} className="max-h-[80vh] max-w-full object-contain block" />
            </div>
         ) : (
             <div className="text-gray-400 flex flex-col items-center justify-center bg-white/50 p-12 rounded-xl backdrop-blur-sm border border-gray-200/50">
                 <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-gray-300" />
                 </div>
                 <p className="font-medium">Preview will appear here</p>
                 <p className="text-sm">Upload an image to get started</p>
             </div>
         )}
         
         {currentState && (
             <div className="absolute bottom-6 right-6 flex gap-3">
                 <button onClick={handleDownload} className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-gray-50 flex items-center gap-2">
                     <Download className="w-4 h-4" /> Download
                 </button>
                 <button onClick={handleSave} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-800 flex items-center gap-2">
                     <Save className="w-4 h-4" /> Save
                 </button>
             </div>
         )}
      </div>
    </div>
  );
};

export default PosterGenerator;

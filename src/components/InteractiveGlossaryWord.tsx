import React, { useState } from 'react';
import { GlossaryTerm } from '../types';
import { BookOpen, X, Sparkles, Compass, Shield } from 'lucide-react';

interface InteractiveGlossaryWordProps {
  termKey: string;
  children: React.ReactNode;
  termData: GlossaryTerm;
  theme?: 'washi' | 'lacquer' | 'sepia';
}

export const InteractiveGlossaryWord: React.FC<InteractiveGlossaryWordProps> = ({
  termKey,
  children,
  termData,
  theme = 'washi'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getBorderColor = () => {
    switch (theme) {
      case 'washi':
        return 'border-[#963532] text-[#963532] hover:bg-[#963532]/10';
      case 'sepia':
        return 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10';
      case 'lacquer':
      default:
        return 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/15';
    }
  };

  return (
    <span className="relative inline-block my-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded border-b-2 border-dotted font-medium transition-all cursor-help select-text ${getBorderColor()}`}
        title={`Glossaire : Découvrir la signification de ${termData.term}`}
      >
        <span>{children}</span>
        <span className="text-[10px] font-kanji opacity-80">({termData.kanji})</span>
      </button>

      {/* Floating Glossary Tooltip Card */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 rounded-xl bg-[#141210] border-2 border-[#D4AF37] text-[#FAF4EB] shadow-2xl z-50 animate-fadeIn backdrop-blur-md text-left font-serif text-xs select-none"
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-8 border-transparent border-t-[#D4AF37]" />

          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#C5A880]/30 pb-2 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#FAF4EB]">{termData.term}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#963532] text-[11px] font-kanji font-bold text-[#FAF4EB]">
                  {termData.kanji}
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#D4AF37] italic">
                {termData.translation}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-[#C5A880] hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Explanation */}
          <p className="text-[#FAF4EB]/90 leading-relaxed font-light text-[11px] mb-2">
            {termData.explanation}
          </p>

          {/* Historical Context Badge */}
          <div className="p-2 rounded-lg bg-[#1E1915] border border-[#C5A880]/20 text-[10px] text-[#C5A880] leading-normal font-sans">
            <strong className="text-[#D4AF37] font-serif">Contexte d'Edo : </strong>
            {termData.historicalContext}
          </div>
        </div>
      )}
    </span>
  );
};

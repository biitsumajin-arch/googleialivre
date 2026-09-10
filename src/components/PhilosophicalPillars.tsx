import React, { useState } from 'react';
import { PHILOSOPHICAL_PILLARS } from '../data/mockData';
import { PhilosophicalPillar } from '../types';
import { TokugawaCrest } from './TokugawaCrest';
import { Compass, Sparkles, ChevronDown, ChevronUp, Feather, BookMarked } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

export const PhilosophicalPillars: React.FC = () => {
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);

  const togglePillar = (id: string) => {
    if (expandedPillarId === id) {
      setExpandedPillarId(null);
    } else {
      setExpandedPillarId(id);
      zenAudio.playWaterDrop();
    }
  };

  return (
    <section
      id="pillars-section"
      className="py-24 bg-[#141210] relative border-t border-[#C5A880]/20 overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#963532]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1613] border border-[#C5A880]/30 text-xs font-mono text-[#D4AF37] uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-[#963532]" />
            <span>Fondements de l'Œuvre</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
            Les Quatre Piliers <span className="gold-gradient-text italic">Philosophiques</span>
          </h2>
          <p className="text-sm sm:text-base text-[#C5A880]/80 mt-3 font-light leading-relaxed">
            Une pensée en résonance entre la rigueur contemporaine des affaires et la méditation séculaire du Wabi-Sabi shogunal.
          </p>
        </div>

        {/* 4 Thematic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PHILOSOPHICAL_PILLARS.map((pillar) => {
            const isExpanded = expandedPillarId === pillar.id;

            return (
              <div
                key={pillar.id}
                id={`pillar-card-${pillar.id}`}
                className={`p-6 sm:p-8 rounded-2xl bg-[#1A1613] border transition-all duration-300 relative flex flex-col justify-between overflow-hidden group shadow-xl ${
                  isExpanded
                    ? 'border-[#D4AF37] bg-[#221B17]'
                    : 'border-[#C5A880]/25 hover:border-[#D4AF37]/60 hover:bg-[#1E1814]'
                }`}
              >
                {/* Huge Watermark Kanji Background */}
                <div className="absolute right-4 top-4 font-kanji text-8xl font-black text-[#C5A880]/[0.05] group-hover:text-[#D4AF37]/[0.09] select-none pointer-events-none transition-colors">
                  {pillar.kanji}
                </div>

                <div>
                  {/* Top Bar: Pillar Number, Kanji badge, Concept */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#963532] text-[#FAF4EB] flex items-center justify-center font-kanji font-bold text-base shadow border border-[#D4AF37]/40">
                        {pillar.kanji}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                        PILIER {pillar.number}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-[#141210] border border-[#C5A880]/20 text-[#C5A880] font-mono">
                      {pillar.associatedConcept.split('—')[0]}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-2xl font-bold text-[#FAF4EB] group-hover:text-[#D4AF37] transition-colors mb-1">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-serif italic text-[#C5A880] mb-4">
                    {pillar.subtitle}
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-[#FAF4EB]/80 leading-relaxed font-light mb-6">
                    {pillar.summary}
                  </p>

                  {/* Literary Quotation */}
                  <div className="p-4 rounded-xl bg-[#141210]/90 border-l-4 border-[#963532] border border-[#C5A880]/15 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#D4AF37] font-serif mb-1">
                      <Feather className="w-3 h-3 text-[#963532]" />
                      <span>Extrait du manuscrit</span>
                    </div>
                    <p className="font-serif italic text-xs sm:text-sm text-[#FAF4EB] leading-relaxed">
                      {pillar.quote}
                    </p>
                  </div>

                  {/* Expandable Deep Reflection */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#C5A880]/20 animate-fadeIn">
                      <div className="text-xs font-serif uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                        Développement & Résonance Littéraire
                      </div>
                      <p className="text-xs sm:text-sm text-[#FAF4EB]/85 leading-relaxed font-light">
                        {pillar.detailedReflection}
                      </p>
                      <div className="mt-3 text-xs text-[#C5A880] font-mono bg-[#141210] p-2.5 rounded border border-[#C5A880]/20">
                        {pillar.associatedConcept}
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle Button */}
                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#C5A880]/70 font-mono">
                    {isExpanded ? 'Réduire la lecture' : 'Lire la réflexion complète'}
                  </span>
                  <button
                    onClick={() => togglePillar(pillar.id)}
                    className="p-1.5 rounded-full bg-[#141210] border border-[#C5A880]/30 hover:border-[#D4AF37] text-[#FAF4EB] hover:text-[#D4AF37] transition-all"
                    aria-label="Déplier le pilier"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#FAF4EB]/70" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

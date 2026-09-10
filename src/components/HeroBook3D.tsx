import React, { useState } from 'react';
import { TokugawaCrest } from './TokugawaCrest';
import { MANUSCRIPT_STATS } from '../data/mockData';
import { BookOpen, Compass, Eye, RotateCw, Sparkles, Feather, Bookmark, CheckCircle2 } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface HeroBook3DProps {
  onOpenReader: () => void;
  onExploreMap: () => void;
}

export const HeroBook3D: React.FC<HeroBook3DProps> = ({
  onOpenReader,
  onExploreMap
}) => {
  // 3D rotation angles
  const [rotateY, setRotateY] = useState(-18);
  const [rotateX, setRotateX] = useState(8);
  const [isObiRemoved, setIsObiRemoved] = useState(false);
  const [activeFace, setActiveFace] = useState<'front' | 'spine' | 'back' | 'pages'>('front');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth dynamic tilt based on mouse position
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    if (activeFace === 'front') {
      setRotateY(-18 + normX * 16);
      setRotateX(8 - normY * 12);
    }
  };

  const handleMouseLeave = () => {
    if (activeFace === 'front') {
      setRotateY(-18);
      setRotateX(8);
    }
  };

  const setViewMode = (face: 'front' | 'spine' | 'back' | 'pages') => {
    setActiveFace(face);
    zenAudio.playWaterDrop();
    if (face === 'front') {
      setRotateY(-18);
      setRotateX(8);
    } else if (face === 'spine') {
      setRotateY(75);
      setRotateX(2);
    } else if (face === 'back') {
      setRotateY(165);
      setRotateX(5);
    } else if (face === 'pages') {
      setRotateY(-45);
      setRotateX(12);
    }
  };

  const toggleObi = () => {
    setIsObiRemoved(!isObiRemoved);
    zenAudio.playWaterDrop();
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] pt-28 pb-20 overflow-hidden flex items-center bg-lacquer-pattern"
    >
      {/* Ambient background motifs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Subtle Japanese water lines */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="seigaiha-hero" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 20 A 20 20 0 0 1 40 20 M 0 10 A 10 10 0 0 1 20 10 M 20 10 A 10 10 0 0 1 40 10" fill="none" stroke="#C5A880" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#seigaiha-hero)" />
        </svg>
      </div>

      {/* Vertical decorative Kanji watermark */}
      <div className="absolute right-4 lg:right-16 top-24 font-kanji text-7xl lg:text-9xl font-black text-[#C5A880]/[0.03] select-none writing-vertical pointer-events-none">
        東海道五十三次
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Literary Pitch, Epigraph & Manuscript Stats */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1613] border border-[#C5A880]/30 shadow-inner mb-6">
              <span className="w-2 h-2 rounded-full bg-[#963532] animate-ping" />
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                Roman Littéraire Contemporain
              </span>
              <span className="text-[#FAF4EB]/30">•</span>
              <span className="text-xs text-[#FAF4EB]/80 font-serif">Inspiration Japonaise & Wabi-Sabi</span>
            </div>

            {/* Main Title & Kanji Embellishment */}
            <div className="relative mb-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAF4EB] tracking-tight leading-[1.1]">
                Le Fardeau <br className="hidden sm:inline" />
                <span className="gold-gradient-text italic font-serif">et le Chemin</span>
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm font-kanji tracking-widest text-[#D4AF37] px-2.5 py-0.5 rounded bg-[#221D18] border border-[#C5A880]/30">
                  荷 と 道
                </span>
                <span className="text-xs text-[#C5A880]/70 font-mono tracking-wider">
                  DE LA DÉFENSE AU TŌKAIDŌ (1603)
                </span>
              </div>
            </div>

            {/* Accroche Littéraire en Exergue (Chapitre 1) */}
            <div
              id="hero-epigraph-quote"
              className="relative p-6 rounded-xl bg-gradient-to-r from-[#1A1613] via-[#201B17] to-[#1A1613] border-l-4 border-[#963532] border-y border-r border-[#C5A880]/20 shadow-2xl mb-8 w-full backdrop-blur-sm"
            >
              <div className="absolute top-2 right-3 text-[#963532]/30 font-serif text-4xl select-none leading-none">
                “
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded bg-[#141210] border border-[#963532]/50 text-[#963532] shrink-0 mt-1">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-serif italic text-lg sm:text-xl text-[#FAF4EB] font-medium leading-relaxed">
                    « Comment tient-on debout, quand on a enfin fini de subir ? »
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-xs text-[#C5A880]">
                    <span className="font-medium">— Chapitre 1, <span className="italic">La chambre d'Ueno</span></span>
                    <span className="font-kanji opacity-70">第一章 寛永寺</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis Overview */}
            <p className="text-sm sm:text-base text-[#FAF4EB]/80 leading-relaxed max-w-2xl mb-8 font-light">
              Le périple d'un ancien responsable d'administration des ventes qui quitte la tour Franklin de La Défense (Paris) pour arpenter à pied la route historique du <strong className="text-[#FAF4EB] font-medium">Tōkaidō au Japon</strong>, d'Edo jusqu'à Kunōzan. Une quête de réconciliation entre l'obsession moderne de la conformité, la mémoire d'un père autoritaire et la sagesse patiente du premier shogun <strong className="text-[#D4AF37] font-medium">Tokugawa Ieyasu</strong>.
            </p>

            {/* Key Manuscript Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-8">
              <div className="p-3.5 rounded-lg bg-[#1A1613]/90 border border-[#C5A880]/20 shadow-md">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">80 000</div>
                <div className="text-[11px] uppercase tracking-wider text-[#C5A880]/80">Mots</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#1A1613]/90 border border-[#C5A880]/20 shadow-md">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#FAF4EB]">26</div>
                <div className="text-[11px] uppercase tracking-wider text-[#C5A880]/80">Chapitres + Fin</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#1A1613]/90 border border-[#C5A880]/20 shadow-md">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#963532]">53</div>
                <div className="text-[11px] uppercase tracking-wider text-[#C5A880]/80">Relais d'Edo</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#1A1613]/90 border border-[#C5A880]/20 shadow-md">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#C5A880]">1603</div>
                <div className="text-[11px] uppercase tracking-wider text-[#C5A880]/80">Ère Keichō</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                id="hero-open-reader-cta"
                onClick={onOpenReader}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#963532] via-[#A83D3A] to-[#8E2F2D] text-[#FAF4EB] font-serif text-base font-semibold tracking-wide shadow-xl shadow-[#963532]/30 hover:shadow-[#963532]/50 border border-[#C5A880]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <BookOpen className="w-5 h-5 text-[#FAF4EB] group-hover:scale-110 transition-transform" />
                <span>Ouvrir la Liseuse (Chapitre 1)</span>
              </button>

              <button
                id="hero-explore-map-cta"
                onClick={onExploreMap}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#1A1613] hover:bg-[#241E19] text-[#FAF4EB] font-serif text-base border border-[#C5A880]/40 hover:border-[#D4AF37] transition-all transform hover:-translate-y-0.5 shadow-lg group"
              >
                <Compass className="w-5 h-5 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-500" />
                <span>Explorer la Carte du Tōkaidō</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Hardcover Book Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            {/* 3D Scene Container */}
            <div
              className="perspective-1000 w-full max-w-[340px] sm:max-w-[380px] h-[480px] sm:h-[530px] relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* 3D Book Object */}
              <div
                id="book-3d-object"
                style={{
                  transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.25s ease-out'
                }}
                className="relative w-[270px] sm:w-[300px] h-[390px] sm:h-[430px] rounded-r-lg shadow-2xl"
              >
                {/* Book Front Cover */}
                <div
                  style={{ transform: 'translateZ(20px)' }}
                  className="absolute inset-0 rounded-r-md bg-[#161311] border-2 border-[#C5A880]/40 shadow-2xl flex flex-col justify-between p-6 overflow-hidden"
                >
                  {/* Textured cloth grain & lacquer sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#12100E] via-[#1E1915] to-[#2B231D] opacity-95 pointer-events-none" />
                  
                  {/* Gold Foil Border Inset */}
                  <div className="absolute inset-3 border border-[#D4AF37]/35 rounded pointer-events-none" />
                  <div className="absolute inset-4 border border-[#C5A880]/15 rounded pointer-events-none" />

                  {/* Top: Tokugawa Crest & Kanji Stamping */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TokugawaCrest size={34} color="#D4AF37" />
                      <div className="text-[10px] font-serif uppercase tracking-widest text-[#C5A880]">
                        Édition Reliée
                      </div>
                    </div>
                    {/* Vermilion Hanko Stamp */}
                    <div className="w-8 h-8 rounded bg-[#963532] flex items-center justify-center text-[#FAF4EB] font-kanji font-bold text-sm shadow-md border border-[#D4AF37]/50">
                      印
                    </div>
                  </div>

                  {/* Center: Gold Foil Title in Calligraphy */}
                  <div className="relative z-10 text-center my-auto py-4">
                    <div className="text-2xl font-kanji text-[#D4AF37]/90 tracking-[0.3em] mb-3 font-semibold select-none">
                      荷と道
                    </div>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3" />
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF4EB] tracking-wide uppercase leading-tight drop-shadow-md">
                      Le Fardeau <br />
                      <span className="text-[#D4AF37] font-normal italic lowercase text-xl sm:text-2xl">et le</span> <br />
                      Chemin
                    </h2>
                    <div className="mt-3 text-xs font-serif tracking-widest uppercase text-[#C5A880]/90">
                      Roman
                    </div>
                  </div>

                  {/* Bottom: Subtitle & Heritage */}
                  <div className="relative z-10 text-center border-t border-[#C5A880]/20 pt-3">
                    <div className="text-[11px] font-serif text-[#FAF4EB]/80 italic">
                      De la tour Franklin au sanctuaire de Kunōzan
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-[#C5A880]/60 mt-1 font-mono">
                      80 000 Mots • 26 Chapitres
                    </div>
                  </div>

                  {/* Removable Obi (Bandeau éditorial amovible) */}
                  {!isObiRemoved && (
                    <div
                      id="book-obi-sash"
                      className="absolute bottom-10 left-0 right-0 h-20 bg-gradient-to-r from-[#963532] via-[#A83D3A] to-[#8E2F2D] z-20 shadow-xl border-y border-[#D4AF37]/60 flex flex-col justify-center px-4 transform transition-transform duration-500"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#FAF4EB]/90 font-serif uppercase tracking-wider mb-0.5">
                        <span className="font-bold flex items-center gap-1 text-[#FAF4EB]">
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                          Manuscrit Inédit
                        </span>
                        <span className="text-[#FAF4EB]/80 font-kanji">帯 (Obi)</span>
                      </div>
                      <p className="text-xs font-serif font-semibold text-[#FAF4EB] leading-tight drop-shadow">
                        « Comment tient-on debout, quand on a enfin fini de subir ? »
                      </p>
                      <div className="text-[9px] text-[#FAF4EB]/90 tracking-wide mt-0.5 font-medium">
                        La route du Tōkaidō comme miroir de notre temps
                      </div>
                    </div>
                  )}
                </div>

                {/* Cloth Spine (Dos Toilé) */}
                <div
                  style={{
                    transform: 'rotateY(-90deg) translateZ(10px)',
                    width: '40px',
                    left: '-20px'
                  }}
                  className="absolute inset-y-0 rounded-l-sm bg-[#1A1613] border-y-2 border-l-2 border-[#C5A880]/40 flex flex-col justify-between items-center py-6 shadow-2xl"
                >
                  <TokugawaCrest size={18} color="#D4AF37" />
                  <div className="writing-vertical text-xs font-serif tracking-[0.2em] uppercase text-[#D4AF37] font-bold">
                    LE FARDEAU ET LE CHEMIN
                  </div>
                  <div className="writing-vertical text-[10px] font-kanji text-[#C5A880]/70">
                    荷と道
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#963532] border border-[#D4AF37]/50" />
                </div>

                {/* Gilded Page Edges (Tranche Dorée) */}
                <div
                  style={{
                    transform: 'rotateY(90deg) translateZ(280px)',
                    width: '38px',
                    left: '0px'
                  }}
                  className="absolute inset-y-1 bg-gradient-to-r from-[#D4AF37] via-[#C5A880] to-[#E5C158] border-y border-r border-[#963532]/40 shadow-inner flex items-center justify-center opacity-90"
                >
                  <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(0deg,#141210,#141210_2px,transparent_2px,transparent_4px)]" />
                </div>

                {/* Top Gilded Edge */}
                <div
                  style={{
                    transform: 'rotateX(90deg) translateZ(20px)',
                    height: '38px',
                    top: '-19px'
                  }}
                  className="absolute inset-x-2 bg-gradient-to-b from-[#D4AF37] via-[#C5A880] to-[#FAF4EB]/70 border border-[#963532]/30 shadow-inner opacity-80"
                />

                {/* Book Back Cover */}
                <div
                  style={{ transform: 'rotateY(180deg) translateZ(20px)' }}
                  className="absolute inset-0 rounded-l-md bg-[#161311] border-2 border-[#C5A880]/40 shadow-2xl flex flex-col justify-between p-6 text-left"
                >
                  <div className="border-b border-[#C5A880]/20 pb-3">
                    <div className="text-xs font-serif uppercase tracking-widest text-[#D4AF37] font-bold">
                      Quatrième de Couverture
                    </div>
                    <div className="text-[10px] text-[#C5A880]/70 font-mono">
                      LETTRES & PHILOSOPHIE
                    </div>
                  </div>
                  <p className="text-xs font-serif text-[#FAF4EB]/90 leading-relaxed italic">
                    « Rien ne prédisposait Adrien à quitter les réunions feutrées de la tour Franklin. Pourtant, c’est sur les pavés humides du col de Hakone et devant les sanctuaires de cèdre d’Edo qu’il réapprend la seule chose qui vaille : demeurer immobile sans avoir à justifier de son existence devant le monde. »
                  </p>
                  <div className="border-t border-[#C5A880]/20 pt-3 flex items-center justify-between text-[10px] text-[#C5A880]">
                    <span>80 000 mots • 26 chapitres</span>
                    <span className="font-mono">ISBN 978-2-000-00000-0</span>
                  </div>
                </div>

              </div>
            </div>

            {/* 3D Book Interactive Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                onClick={() => setViewMode('front')}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  activeFace === 'front'
                    ? 'bg-[#963532] text-[#FAF4EB] border-[#D4AF37]'
                    : 'bg-[#1A1613] text-[#FAF4EB]/70 border-[#C5A880]/20 hover:border-[#D4AF37]'
                }`}
              >
                Face Avant
              </button>

              <button
                onClick={() => setViewMode('spine')}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  activeFace === 'spine'
                    ? 'bg-[#963532] text-[#FAF4EB] border-[#D4AF37]'
                    : 'bg-[#1A1613] text-[#FAF4EB]/70 border-[#C5A880]/20 hover:border-[#D4AF37]'
                }`}
              >
                Dos Toilé
              </button>

              <button
                onClick={() => setViewMode('back')}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  activeFace === 'back'
                    ? 'bg-[#963532] text-[#FAF4EB] border-[#D4AF37]'
                    : 'bg-[#1A1613] text-[#FAF4EB]/70 border-[#C5A880]/20 hover:border-[#D4AF37]'
                }`}
              >
                Dos / 4e de Couv.
              </button>

              <button
                onClick={toggleObi}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  !isObiRemoved
                    ? 'bg-[#1A1613] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#251E19]'
                    : 'bg-[#963532]/30 text-[#FAF4EB]/70 border-white/20'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isObiRemoved ? 'Remettre l’Obi (Bandeau)' : 'Retirer l’Obi'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#C5A880]/60 mt-2 font-mono">
              ★ Glissez le curseur pour orienter la maquette en relief 3D
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};

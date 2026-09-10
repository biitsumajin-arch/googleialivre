import React, { useState } from 'react';
import { CHAPTERS_LIST } from '../data/mockData';
import { ChapterTeaser } from '../types';
import { TokugawaCrest } from './TokugawaCrest';
import { BookOpen, Search, MapPin, FileText, Sparkles, Filter, ChevronRight, Bookmark } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface ChaptersExplorerProps {
  onOpenReaderChapter: (chapterNum: number) => void;
}

export const ChaptersExplorer: React.FC<ChaptersExplorerProps> = ({
  onOpenReaderChapter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<ChapterTeaser>(CHAPTERS_LIST[0]);

  const locations = ['all', 'Tokyo', 'Tōkaidō', 'Souvenir / Paris', 'Nikkō', 'Odawara', 'Kansai'];

  const filteredChapters = CHAPTERS_LIST.filter(chap => {
    const matchesSearch =
      chap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.teaser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.japaneseSubtitle.includes(searchQuery) ||
      chap.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedLocation === 'all') return matchesSearch;
    if (selectedLocation === 'Tokyo') return matchesSearch && chap.location.includes('Tokyo');
    if (selectedLocation === 'Tōkaidō') return matchesSearch && chap.location.includes('Tōkaidō');
    if (selectedLocation === 'Souvenir / Paris') return matchesSearch && chap.location.includes('Paris') || chap.location.includes('La Défense');
    if (selectedLocation === 'Nikkō') return matchesSearch && chap.location.includes('Nikkō');
    if (selectedLocation === 'Odawara') return matchesSearch && chap.location.includes('Odawara');
    if (selectedLocation === 'Kansai') return matchesSearch && (chap.location.includes('Himeji') || chap.location.includes('Okayama') || chap.location.includes('Kansai'));

    return matchesSearch;
  });

  const handleSelectChapter = (chap: ChapterTeaser) => {
    setSelectedChapter(chap);
    zenAudio.playWaterDrop();
  };

  return (
    <section
      id="chapters-section"
      className="py-24 bg-[#141210] border-t border-[#C5A880]/20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#C5A880]/20 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#963532] mb-2 font-mono">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>Table des Matières & Sommaire Intégral</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
              Les <span className="gold-gradient-text italic">26 Chapitres</span> du Manuscrit
            </h2>
            <p className="text-sm text-[#C5A880]/80 mt-2 max-w-2xl font-light">
              80 000 mots répartis en 26 stations narratives et un épilogue, alternant souvenirs de La Défense et progression pas à pas sur le Tōkaidō.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <input
              type="text"
              placeholder="Rechercher un chapitre, lieu, thème..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1613] border border-[#C5A880]/30 text-sm text-[#FAF4EB] placeholder-[#FAF4EB]/40 focus:outline-none focus:border-[#D4AF37] transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Location Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-serif">
          <span className="text-[#C5A880] uppercase tracking-wider font-mono shrink-0 mr-1">
            Filtre :
          </span>
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                selectedLocation === loc
                  ? 'bg-[#963532] text-[#FAF4EB] border-[#D4AF37] font-bold shadow'
                  : 'bg-[#1A1613] text-[#FAF4EB]/70 border-[#C5A880]/20 hover:border-[#D4AF37]/50'
              }`}
            >
              {loc === 'all' ? 'Tous les Chapitres (26)' : loc}
            </button>
          ))}
        </div>

        {/* Master-Detail Layout for Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chapter List Column (Scrollable) */}
          <div className="lg:col-span-6 max-h-[640px] overflow-y-auto pr-2 space-y-3">
            {filteredChapters.length === 0 ? (
              <div className="p-8 text-center text-[#C5A880]/70 bg-[#1A1613] rounded-xl border border-white/5">
                Aucun chapitre ne correspond à votre recherche.
              </div>
            ) : (
              filteredChapters.map((chap) => {
                const isSelected = selectedChapter.number === chap.number;

                return (
                  <div
                    key={chap.number}
                    id={`chapter-row-${chap.number}`}
                    onClick={() => handleSelectChapter(chap)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#221B16] border-[#D4AF37] shadow-lg shadow-[#963532]/10'
                        : 'bg-[#1A1613] border-[#C5A880]/20 hover:border-[#D4AF37]/40 hover:bg-[#1E1915]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Chapter Number Badge */}
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif text-sm font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#963532] text-[#FAF4EB] border border-[#D4AF37]'
                          : 'bg-[#141210] text-[#C5A880] border border-[#C5A880]/25 group-hover:border-[#D4AF37]'
                      }`}>
                        {chap.number}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-bold text-[#FAF4EB] group-hover:text-[#D4AF37] transition-colors">
                            {chap.title}
                          </h4>
                          <span className="text-[10px] font-kanji text-[#C5A880]/60">
                            {chap.japaneseSubtitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#C5A880]/70 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#963532]" />
                            {chap.location}
                          </span>
                          <span>•</span>
                          <span>{chap.wordCount.toLocaleString()} mots</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-[#C5A880] transition-transform ${isSelected ? 'translate-x-1 text-[#D4AF37]' : 'group-hover:translate-x-0.5'}`} />
                  </div>
                );
              })
            )}
          </div>

          {/* Chapter Inspector / Teaser Preview Card */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1A1613] border-2 border-[#C5A880]/35 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              
              {/* Background Kanji Watermark */}
              <div className="absolute right-4 top-4 font-kanji text-7xl font-bold text-[#C5A880]/[0.05] pointer-events-none select-none">
                {selectedChapter.japaneseSubtitle}
              </div>

              <div>
                {/* Chapter Meta Bar */}
                <div className="flex items-center justify-between mb-4 border-b border-[#C5A880]/20 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#963532] text-[#FAF4EB] font-serif text-xs font-bold border border-[#D4AF37]">
                      Chapitre {selectedChapter.number}
                    </span>
                    <span className="text-xs font-mono text-[#D4AF37]">
                      {selectedChapter.japaneseSubtitle}
                    </span>
                  </div>
                  <span className="text-xs text-[#C5A880] font-mono">
                    {selectedChapter.wordCount.toLocaleString()} mots
                  </span>
                </div>

                {/* Chapter Title */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF4EB] mb-2">
                  {selectedChapter.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-[#C5A880] mb-6 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#963532]" />
                  <span>Lieu de l’action : <strong>{selectedChapter.location}</strong></span>
                </div>

                {/* Teaser Narrative */}
                <div className="p-5 rounded-xl bg-[#141210] border border-[#C5A880]/20 mb-6">
                  <div className="text-[11px] font-serif uppercase tracking-widest text-[#D4AF37] mb-2 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#963532]" />
                    <span>Synopsis & Teaser Épique</span>
                  </div>
                  <p className="text-sm font-serif italic text-[#FAF4EB]/90 leading-relaxed font-light">
                    « {selectedChapter.teaser} »
                  </p>
                </div>

                {/* Themes Tags */}
                <div className="mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#C5A880]/80 mb-2">
                    Thèmes & Motifs Clés :
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedChapter.keyThemes.map((th) => (
                      <span
                        key={th}
                        className="px-2.5 py-1 rounded-full bg-[#201B17] border border-[#C5A880]/30 text-xs text-[#FAF4EB]/80 font-serif"
                      >
                        #{th}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reader CTA for this chapter */}
              <button
                id="chapter-inspector-read-btn"
                onClick={() => onOpenReaderChapter(selectedChapter.number)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-[#963532] to-[#7A2624] hover:from-[#A83D3A] hover:to-[#8E2F2D] text-[#FAF4EB] font-serif text-sm font-semibold tracking-wide border border-[#C5A880]/40 shadow-lg transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lire l’Extrait Correspondant (Liseuse)</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { EXCERPT_CONTENT, CHAPTERS_LIST } from '../data/mockData';
import { JAPANESE_GLOSSARY } from '../data/extendedData';
import { TokugawaCrest } from './TokugawaCrest';
import { InteractiveGlossaryWord } from './InteractiveGlossaryWord';
import { ChapterReviewsSection } from './ChapterReviewsSection';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Type,
  ChevronLeft,
  ChevronRight,
  List,
  Sparkles,
  BookMarked,
  HelpCircle
} from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface ReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterNum?: number;
  onOpenAuth?: () => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  isOpen,
  onClose,
  initialChapterNum = 1,
  onOpenAuth
}) => {
  const [currentChapterNum, setCurrentChapterNum] = useState<number>(initialChapterNum);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [themeMode, setThemeMode] = useState<'washi' | 'lacquer'>('washi');
  const [soundActive, setSoundActive] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [showGlossaryDrawer, setShowGlossaryDrawer] = useState(false);

  if (!isOpen) return null;

  const currentChapterInfo = CHAPTERS_LIST.find(c => c.number === currentChapterNum) || CHAPTERS_LIST[0];

  const handleToggleSound = () => {
    if (!soundActive) {
      zenAudio.playTempleBell(1.0);
      setSoundActive(true);
    } else {
      setSoundActive(false);
    }
  };

  const getThemeClasses = () => {
    switch (themeMode) {
      case 'washi':
        return {
          container: 'bg-[#FAF4EB] text-[#221B16] border-[#C5A880]/50',
          header: 'bg-[#F2EAE0] border-[#C5A880]/30 text-[#221B16]',
          quote: 'bg-[#ECE2D2] border-[#963532] text-[#221B16]',
          badge: 'bg-[#963532] text-[#FAF4EB]',
          accent: 'text-[#963532]',
          sidebar: 'bg-[#F7EFE4] border-r border-[#C5A880]/30',
          activeChapter: 'bg-[#ECE2D2] text-[#963532] font-bold border-l-4 border-[#963532]'
        };
      case 'lacquer':
      default:
        return {
          container: 'bg-[#141210] text-[#FAF4EB] border-[#C5A880]/30',
          header: 'bg-[#1A1613] border-[#C5A880]/20 text-[#FAF4EB]',
          quote: 'bg-[#1E1915] border-[#D4AF37] text-[#FAF4EB]',
          badge: 'bg-[#963532] text-[#FAF4EB]',
          accent: 'text-[#D4AF37]',
          sidebar: 'bg-[#161311] border-r border-[#C5A880]/20',
          activeChapter: 'bg-[#201A16] text-[#D4AF37] font-bold border-l-4 border-[#D4AF37]'
        };
    }
  };

  const styles = getThemeClasses();

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'huge': return 'text-xl sm:text-2xl leading-loose';
      case 'large': return 'text-lg sm:text-xl leading-relaxed';
      case 'normal':
      default: return 'text-base sm:text-lg leading-relaxed';
    }
  };

  // Helper function to render text with interactive glossary annotations
  const renderTextWithGlossary = (text: string) => {
    // List of known glossary terms to match
    const termsMap = new Map(JAPANESE_GLOSSARY.map(t => [t.term.toLowerCase(), t]));
    
    // Split by words/tokens
    const regex = new RegExp(`\\b(${JAPANESE_GLOSSARY.map(g => g.term).join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const matchTerm = termsMap.get(part.toLowerCase());
      if (matchTerm) {
        return (
          <InteractiveGlossaryWord
            key={i}
            termKey={matchTerm.term}
            termData={matchTerm}
            theme={themeMode}
          >
            {part}
          </InteractiveGlossaryWord>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Dynamic paragraphs per chapter (generating immersive excerpts based on chapter themes)
  const getChapterParagraphs = (chapter: typeof currentChapterInfo) => {
    if (chapter.number === 1) {
      return EXCERPT_CONTENT.paragraphs;
    }

    // Dynamic excerpt generator reflecting the actual chapter themes
    return [
      `L’air de ${chapter.location} portait en lui cette odeur singulière de cèdre et de brume matinale que nulle carte touristique ne saurait retranscrire. À ce stade du voyage, chaque kilomètre parcouru le long du Tōkaidō effaçait peu à peu le souvenir métallique des open-spaces de la Tour Franklin.`,
      `Sous le regard discret des voyageurs et des marchands d'estampes, Adrien déplia son carnet en papier washi. Les notes mathématiques d’Évreux et les préceptes de Tokugawa Ieyasu semblaient désormais se répondre dans une troublante harmonie : ${chapter.teaser}`,
      `« Ce n’est pas la destination qui compte, se répétait-il en observant les pins centenaires courbés par le vent, mais la façon dont le corps accepte enfin de peser son juste poids sur la terre. »`,
      `Les thèmes majeurs de cette étape (${chapter.keyThemes.join(', ')}) résonnaient comme une invitation au silence intérieur. Le fardeau n'était plus une contrainte, mais le point d'appui indispensable à la marche.`
    ];
  };

  const paragraphs = getChapterParagraphs(currentChapterInfo);

  return (
    <div
      id="novel-reader-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 md:p-6 bg-black/92 backdrop-blur-lg animate-fadeIn"
    >
      <div className={`relative w-full max-w-5xl h-[96vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border-2 ${styles.container}`}>
        
        {/* Reader Top Bar */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 z-20 ${styles.header}`}>
          
          <div className="flex items-center gap-3">
            {/* Toggle Summary Drawer Button */}
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-serif ${
                summaryOpen
                  ? 'bg-[#963532] text-[#FAF4EB] border-[#963532]'
                  : 'bg-black/10 border-current/20 hover:border-[#D4AF37]'
              }`}
              title="Ouvrir le Sommaire des 26 Chapitres"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Sommaire ({CHAPTERS_LIST.length})</span>
            </button>

            <div className="h-4 w-[1px] bg-current/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <TokugawaCrest size={22} color="#D4AF37" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm sm:text-base font-bold tracking-wide line-clamp-1">
                    Le Fardeau et le Chemin
                  </h3>
                  <span className={`text-[9px] font-kanji px-1 py-0.2 rounded font-bold ${styles.badge}`}>
                    荷と道
                  </span>
                </div>
                <div className="text-[10px] opacity-70 font-mono line-clamp-1">
                  Chapitre {currentChapterInfo.number} : {currentChapterInfo.title}
                </div>
              </div>
            </div>
          </div>

          {/* Reader Controls: Themes, Glossaire, Font Size, Audio, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Glossaire Quick Button */}
            <button
              onClick={() => setShowGlossaryDrawer(!showGlossaryDrawer)}
              className={`p-1.5 rounded-lg border text-xs font-serif flex items-center gap-1 transition-all ${
                showGlossaryDrawer
                  ? 'bg-[#963532] text-[#FAF4EB] border-[#963532]'
                  : 'bg-black/10 border-current/20 hover:border-[#D4AF37]'
              }`}
              title="Consulter le glossaire des termes d'Edo"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden md:inline">Glossaire</span>
            </button>

            {/* 2 Thèmes demandés : Washi Clair (#FAF4EB) vs Nuit d'Edo (#141210) */}
            <div className="flex items-center bg-black/10 rounded-lg p-0.5 border border-current/15">
              <button
                onClick={() => setThemeMode('washi')}
                title="Thème Washi Clair (#FAF4EB)"
                className={`px-2 py-1 rounded text-[11px] font-serif font-bold transition-all flex items-center gap-1 ${
                  themeMode === 'washi'
                    ? 'bg-[#FAF4EB] text-[#221B16] shadow font-black'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <span>紙</span>
                <span className="hidden lg:inline text-[9px]">Washi</span>
              </button>
              
              <button
                onClick={() => setThemeMode('lacquer')}
                title="Thème Nuit d’Edo (#141210)"
                className={`px-2 py-1 rounded text-[11px] font-serif font-bold transition-all flex items-center gap-1 ${
                  themeMode === 'lacquer'
                    ? 'bg-[#141210] text-[#FAF4EB] shadow font-black'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <span>漆</span>
                <span className="hidden lg:inline text-[9px]">Nuit d’Edo</span>
              </button>
            </div>

            {/* Font size toggle */}
            <button
              onClick={() =>
                setFontSize(
                  fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'huge' : 'normal'
                )
              }
              className="p-1.5 sm:px-2 rounded-lg bg-black/10 border border-current/20 text-xs font-serif font-bold flex items-center gap-1"
              title="Ajuster la taille de police"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[10px]">
                {fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.2x' : '1.5x'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg bg-black/10 border border-current/20 hover:opacity-100 transition-opacity"
              title={soundActive ? 'Arrêter la cloche' : 'Ambiance cloche de temple zen'}
            >
              {soundActive ? (
                <Volume2 className="w-4 h-4 text-[#963532] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-60" />
              )}
            </button>

            {/* Close Button */}
            <button
              id="close-reader-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/10 border border-current/20 hover:bg-[#963532] hover:text-[#FAF4EB] transition-colors ml-1"
              title="Fermer la liseuse"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Main Body: Sommaire Drawer + Literary Content + Glossaire Drawer */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Sommaire Latéral Interactif (Collapsible) */}
          {summaryOpen && (
            <aside
              className={`w-72 sm:w-80 shrink-0 h-full overflow-y-auto p-4 space-y-2 z-30 shadow-2xl transition-all font-serif ${styles.sidebar}`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#963532]" />
                  <span className="font-bold text-sm">Sommaire du Roman</span>
                </div>
                <button
                  onClick={() => setSummaryOpen(false)}
                  className="p-1 rounded text-current/60 hover:text-current"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] font-mono opacity-70 uppercase tracking-wider mb-2">
                26 Chapitres & Épilogue (80 000 mots)
              </div>

              <div className="space-y-1">
                {CHAPTERS_LIST.map((ch) => {
                  const isActive = ch.number === currentChapterNum;
                  return (
                    <button
                      key={ch.number}
                      onClick={() => {
                        setCurrentChapterNum(ch.number);
                        zenAudio.playWaterDrop();
                        if (window.innerWidth < 640) setSummaryOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? styles.activeChapter
                          : 'hover:bg-black/5 text-current/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Ch. {ch.number}</span>
                          <span className="font-light italic line-clamp-1">{ch.title}</span>
                        </div>
                        <div className="text-[10px] opacity-60 font-mono">
                          {ch.location} • {ch.wordCount} mots
                        </div>
                      </div>
                      <span className="font-kanji text-[10px] opacity-70 shrink-0">
                        {ch.japaneseSubtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Central Literary Reader Scroll Area */}
          <main className="flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 py-8 sm:py-12 space-y-8 font-serif selection:bg-[#963532] selection:text-[#FAF4EB]">
            
            {/* Chapter Header */}
            <div className="text-center border-b border-current/15 pb-8 space-y-2">
              <div className="text-[11px] uppercase tracking-[0.25em] opacity-70 font-mono">
                ROMAN LITTÉRAIRE • LISEUSE D'EDO
              </div>
              <div className="font-kanji text-2xl sm:text-3xl opacity-85">
                {currentChapterInfo.japaneseSubtitle}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Chapitre {currentChapterInfo.number}
              </h1>
              <div className="text-xl sm:text-2xl font-serif italic opacity-90 text-[#963532]">
                {currentChapterInfo.title}
              </div>
              <div className="text-xs opacity-60 font-mono pt-1">
                Lieu : {currentChapterInfo.location} • Volume estimé : {currentChapterInfo.wordCount} mots
              </div>
            </div>

            {/* Epigraph */}
            <div className={`p-5 sm:p-6 rounded-xl border-l-4 italic text-base sm:text-lg font-medium shadow-sm leading-relaxed ${styles.quote}`}>
              {currentChapterNum === 1
                ? EXCERPT_CONTENT.openingQuote
                : `« ${currentChapterInfo.teaser} »`}
            </div>

            {/* Paragraphs with Interactive Japanese Glossary Words */}
            <div className={`space-y-6 font-light ${getFontSizeClass()}`}>
              {paragraphs.map((p, idx) => (
                <p key={idx} className="indent-6 sm:indent-10 leading-relaxed text-justify">
                  {renderTextWithGlossary(p)}
                </p>
              ))}
            </div>

            {/* End of Excerpt Ornament */}
            <div className="pt-8 text-center border-t border-current/15 space-y-3">
              <div className="inline-block p-2 rounded-full border border-current/20">
                <TokugawaCrest size={28} color="#D4AF37" />
              </div>
              <div className="text-xs uppercase tracking-widest font-mono opacity-60">
                Fin de l'extrait du Chapitre {currentChapterInfo.number} (80 000 mots au total)
              </div>
            </div>

            {/* Avis & Notes de Lecture par Chapitre (Edo Register) */}
            <ChapterReviewsSection
              chapterNumber={currentChapterInfo.number}
              chapterTitle={currentChapterInfo.title}
              theme={themeMode}
              onOpenAuth={onOpenAuth}
            />

          </main>

          {/* Glossaire Latéral Interactif (Drawer) */}
          {showGlossaryDrawer && (
            <aside
              className={`w-72 sm:w-80 shrink-0 h-full overflow-y-auto p-4 space-y-3 z-30 shadow-2xl transition-all font-serif ${styles.sidebar}`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-2">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-sm">Glossaire d'Edo</span>
                </div>
                <button
                  onClick={() => setShowGlossaryDrawer(false)}
                  className="p-1 rounded text-current/60 hover:text-current"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] opacity-70 font-mono">
                Survolez ou cliquez sur les termes soulignés dans le texte pour afficher leur définition.
              </div>

              <div className="space-y-2.5">
                {JAPANESE_GLOSSARY.map((term) => (
                  <div
                    key={term.term}
                    className="p-3 rounded-xl bg-black/5 border border-current/15 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{term.term}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#963532] text-[10px] font-kanji text-[#FAF4EB] font-bold">
                        {term.kanji}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#D4AF37] italic">
                      {term.translation}
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed font-light">
                      {term.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          )}

        </div>

        {/* Reader Footer Navigation */}
        <div className={`flex items-center justify-between px-6 py-3 border-t text-xs font-serif shrink-0 ${styles.header}`}>
          <button
            onClick={() => {
              if (currentChapterNum > 1) {
                setCurrentChapterNum(currentChapterNum - 1);
                zenAudio.playWaterDrop();
              }
            }}
            disabled={currentChapterNum <= 1}
            className="flex items-center gap-1.5 font-bold opacity-80 hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Chapitre précédent</span>
            <span className="sm:hidden">Préc.</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] opacity-75">
              Chapitre {currentChapterNum} / 26
            </span>
          </div>

          <button
            onClick={() => {
              if (currentChapterNum < 26) {
                setCurrentChapterNum(currentChapterNum + 1);
                zenAudio.playWaterDrop();
              }
            }}
            disabled={currentChapterNum >= 26}
            className="flex items-center gap-1.5 font-bold opacity-80 hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          >
            <span className="hidden sm:inline">Chapitre suivant</span>
            <span className="sm:hidden">Suiv.</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

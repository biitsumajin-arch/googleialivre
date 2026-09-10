import React, { useState, useEffect } from 'react';
import { TokugawaCrest } from './TokugawaCrest';
import { HankoSeal } from './HankoSeal';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  MapPin,
  Compass,
  FileText,
  Mail,
  Volume2,
  VolumeX,
  Menu,
  X,
  User,
  Shield,
  Sparkles,
  Layers
} from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface HeaderNavbarProps {
  onOpenReader: () => void;
  onNavigateTo: (sectionId: string) => void;
  onOpenAuth: () => void;
  onOpenMemberProfile: () => void;
  onOpenAdminPanel: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenReader,
  onNavigateTo,
  onOpenAuth,
  onOpenMemberProfile,
  onOpenAdminPanel
}) => {
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    if (!audioEnabled) {
      zenAudio.playTempleBell(1.0);
      setAudioEnabled(true);
    } else {
      setAudioEnabled(false);
    }
  };

  const navItems = [
    { label: 'Le Roman', id: 'hero-section', icon: BookOpen, kanji: '本' },
    { label: 'Carte du Tōkaidō', id: 'tokaido-map-section', icon: MapPin, kanji: '道' },
    { label: 'Piliers Philosophiques', id: 'pillars-section', icon: Compass, kanji: '心' },
    { label: '26 Chapitres', id: 'chapters-section', icon: FileText, kanji: '章' },
    { label: 'Cartes Hanafuda', id: 'hanafuda-gallery-section', icon: Layers, kanji: '花' },
    { label: 'Espace Éditeurs', id: 'publisher-section', icon: Mail, kanji: '印' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateTo(id);
    setMobileMenuOpen(false);
    if (audioEnabled) {
      zenAudio.playWaterDrop();
    }
  };

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase() === 'biitsumajin@gmail.com';

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#141210]/95 backdrop-blur-md border-b border-[#C5A880]/20 py-3 shadow-2xl shadow-black/60'
          : 'bg-gradient-to-b from-[#141210]/90 to-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div
          id="brand-logo-trigger"
          onClick={() => handleNavClick('hero-section')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative p-1.5 rounded-full bg-[#1A1613] border border-[#C5A880]/30 group-hover:border-[#D4AF37] transition-all duration-300 shadow-md">
            <TokugawaCrest size={28} color="#D4AF37" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#FAF4EB] group-hover:text-[#D4AF37] transition-colors">
                Le Fardeau et le Chemin
              </span>
              <span className="hidden sm:inline-block text-xs px-1.5 py-0.5 rounded bg-[#963532]/80 text-[#FAF4EB] font-serif border border-[#963532]">
                荷と道
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-[#C5A880]/80 font-medium">
              Roman Littéraire & Sagesse d’Edo
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="group flex items-center gap-1.5 text-xs font-medium text-[#FAF4EB]/80 hover:text-[#D4AF37] transition-colors py-1 relative"
              >
                <Icon className="w-3.5 h-3.5 text-[#C5A880] group-hover:text-[#D4AF37] transition-colors" />
                <span>{item.label}</span>
                <span className="text-[9px] font-kanji text-[#C5A880]/50 group-hover:text-[#D4AF37]/90 transition-colors ml-0.5">
                  ({item.kanji})
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Admin Moderate + Auth / Member Hanko + Sound Ambient + Reader CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Admin Moderation Button (visible if Admin) */}
          {isAdmin && (
            <button
              onClick={onOpenAdminPanel}
              title="Chambre de Modération Shogunale"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#963532]/90 hover:bg-[#963532] border border-[#D4AF37] text-xs font-serif font-bold text-[#FAF4EB] shadow-md transition-all animate-pulse"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Modération Admin</span>
            </button>
          )}

          {/* Member Area / Auth Button */}
          {profile ? (
            <button
              id="header-member-profile-btn"
              onClick={onOpenMemberProfile}
              title={`Espace Membre : ${profile.display_name}`}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#1A1613] hover:bg-[#221B16] border border-[#C5A880]/40 hover:border-[#D4AF37] transition-all group shadow"
            >
              <div className="bg-[#FAF4EB] rounded p-0.5 border border-[#963532]/50 shrink-0">
                <HankoSeal name={profile.display_name} size={22} />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-serif font-bold text-[#FAF4EB] group-hover:text-[#D4AF37] transition-colors line-clamp-1 max-w-[110px]">
                  {profile.display_name}
                </span>
                <span className="text-[9px] font-mono text-[#C5A880] flex items-center gap-0.5">
                  {isAdmin ? 'Shogun (Admin)' : 'Lecteur'}
                </span>
              </div>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1613] hover:bg-[#201B17] border border-[#C5A880]/30 hover:border-[#D4AF37] text-xs font-serif text-[#FAF4EB] transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#963532]" />
              <span className="hidden sm:inline">Espace Membre</span>
              <span className="sm:hidden">Connexion</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="ambient-sound-toggle"
            onClick={toggleSound}
            title={audioEnabled ? 'Désactiver le son zen' : 'Activer l’ambiance de cloche de temple'}
            aria-label="Ambiance sonore zen"
            className="p-2 rounded-lg bg-[#1A1613] border border-[#C5A880]/30 hover:border-[#D4AF37] text-[#C5A880] hover:text-[#D4AF37] transition-all"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#FAF4EB]/50" />
            )}
          </button>

          {/* Reader Button CTA */}
          <button
            id="header-open-reader-btn"
            onClick={onOpenReader}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded bg-gradient-to-r from-[#963532] to-[#7B2725] hover:from-[#A83D3A] hover:to-[#8E2F2D] text-[#FAF4EB] text-xs font-semibold tracking-wider uppercase border border-[#C5A880]/40 shadow-lg shadow-[#963532]/20 hover:shadow-[#963532]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Feuilleter l’Extrait</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Ouvrir le menu de navigation"
            className="xl:hidden p-2 rounded-lg bg-[#1A1613] border border-[#C5A880]/30 text-[#FAF4EB]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden bg-[#141210]/98 border-b border-[#C5A880]/30 px-6 py-5 shadow-2xl backdrop-blur-xl animate-fadeIn"
        >
          <div className="flex flex-col gap-3">
            {profile ? (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMemberProfile();
                }}
                className="p-3 rounded-xl bg-[#1A1613] border border-[#D4AF37] flex items-center justify-between cursor-pointer mb-2"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAF4EB] rounded p-1 border border-[#963532]">
                    <HankoSeal name={profile.display_name} size={30} />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-[#FAF4EB] text-sm">{profile.display_name}</div>
                    <div className="text-[10px] font-mono text-[#D4AF37]">
                      {isAdmin ? 'Administrateur Shogunal' : 'Lecteur du Tōkaidō'}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-[#C5A880]">Gérer →</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-[#1A1613] border border-[#C5A880]/40 text-[#FAF4EB] text-xs font-serif mb-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#963532]" />
                <span>Créer mon Sceau Hanko / Se Connecter</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPanel();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#963532] text-[#FAF4EB] font-serif text-xs border border-[#D4AF37] mb-1 font-bold"
              >
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Chambre de Modération Admin</span>
              </button>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center justify-between text-left py-2.5 px-3 rounded hover:bg-[#1A1613] text-[#FAF4EB] border border-transparent hover:border-[#C5A880]/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-serif text-base">{item.label}</span>
                  </div>
                  <span className="font-kanji text-xs px-2 py-0.5 rounded bg-[#1A1613] border border-[#C5A880]/30 text-[#C5A880]">
                    {item.kanji}
                  </span>
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReader();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-[#963532] text-[#FAF4EB] font-serif text-sm border border-[#C5A880]/40 shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ouvrir la Liseuse (Chapitre 1)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

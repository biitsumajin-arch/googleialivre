import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { HeaderNavbar } from './components/HeaderNavbar';
import { HeroBook3D } from './components/HeroBook3D';
import { TokaidoInteractiveMap } from './components/TokaidoInteractiveMap';
import { PhilosophicalPillars } from './components/PhilosophicalPillars';
import { ChaptersExplorer } from './components/ChaptersExplorer';
import { HanafudaGallerySection } from './components/HanafudaGallerySection';
import { PublisherContact } from './components/PublisherContact';
import { ReaderModal } from './components/ReaderModal';
import { AuthModal } from './components/AuthModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { AdminModerationPanel } from './components/AdminModerationPanel';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';

function MainAppContent() {
  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedReaderChapter, setSelectedReaderChapter] = useState(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [memberProfileModalOpen, setMemberProfileModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'cgu' | 'privacy'>('cgu');

  const handleOpenReader = (chapterNum: number = 1) => {
    setSelectedReaderChapter(chapterNum);
    setReaderOpen(true);
  };

  const handleNavigateTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLegal = (tab: 'cgu' | 'privacy') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#FAF4EB] selection:bg-[#963532] selection:text-[#FAF4EB]">
      {/* Fixed Luxury Navigation Header */}
      <HeaderNavbar
        onOpenReader={() => handleOpenReader(1)}
        onNavigateTo={handleNavigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenMemberProfile={() => setMemberProfileModalOpen(true)}
        onOpenAdminPanel={() => setAdminPanelOpen(true)}
      />

      <main>
        {/* Section A: Hero & 3D Interactive Hardcover Book */}
        <HeroBook3D
          onOpenReader={() => handleOpenReader(1)}
          onExploreMap={() => handleNavigateTo('tokaido-map-section')}
        />

        {/* Section B: Interactive Tokaido Map with Vector Ukiyo-e Landscape */}
        <TokaidoInteractiveMap />

        {/* Section C: Philosophical Pillars */}
        <PhilosophicalPillars />

        {/* Section D: 26 Chapters Directory & Teasers */}
        <ChaptersExplorer
          onOpenReaderChapter={(num) => handleOpenReader(num)}
        />

        {/* Section E: Participative Hanafuda Gallery */}
        <HanafudaGallerySection
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenReaderChapter={(num) => handleOpenReader(num)}
        />

        {/* Section F: Publisher Inquiries & Press Area */}
        <PublisherContact />
      </main>

      {/* Literary Reader Modal with Washi & Nuit d'Edo themes, Glossary & Chapter Reviews */}
      <ReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        initialChapterNum={selectedReaderChapter}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal (Login & Signup with Live Hanko Preview) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Member Profile Modal (Hanko Seal, Bookmarks, Role, SQL Schema) */}
      <MemberProfileModal
        isOpen={memberProfileModalOpen}
        onClose={() => setMemberProfileModalOpen(false)}
        onOpenReaderChapter={(num) => handleOpenReader(num)}
      />

      {/* Admin Moderation Panel (biitsumajin@gmail.com) */}
      <AdminModerationPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />

      {/* Legal Pages Modal (CGU & Privacy Policy RGPD) */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Colophon & Footer */}
      <Footer
        onOpenCGU={() => handleOpenLegal('cgu')}
        onOpenPrivacy={() => handleOpenLegal('privacy')}
        onOpenAuth={() => setAuthModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

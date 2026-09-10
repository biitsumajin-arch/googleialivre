import React, { useState } from 'react';
import { TokugawaCrest } from './TokugawaCrest';
import { BookOpen, MapPin, Share2, Check, ArrowUp, Feather, Scale, Lock, Shield, Sparkles } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface FooterProps {
  onOpenCGU?: () => void;
  onOpenPrivacy?: () => void;
  onOpenAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCGU,
  onOpenPrivacy,
  onOpenAuth,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    zenAudio.playWaterDrop();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <footer className="bg-[#0E0C0A] text-[#FAF4EB] border-t border-[#C5A880]/20 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C5A880]/15 items-start">
          
          {/* Brand & Mission Colophon */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1A1613] border border-[#C5A880]/30 shadow">
                <TokugawaCrest size={28} color="#D4AF37" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#FAF4EB]">
                  Le Fardeau et le Chemin
                </h3>
                <div className="text-xs font-kanji text-[#D4AF37]">
                  荷と道 • 東海道五十三次
                </div>
              </div>
            </div>

            <p className="text-xs text-[#FAF4EB]/70 leading-relaxed max-w-lg font-light">
              Roman littéraire contemporain d’inspiration japonaise et philosophique. De la Tour Franklin (La Défense) au sanctuaire de Kunōzan, le récit d’un cadre qui réapprend la pesanteur et la présence sur la route des shoguns.
            </p>

            <div className="text-xs text-[#C5A880] font-serif italic">
              « La perfection absolue est une impasse mortelle. C'est l'imperfection calculée qui offre à la structure sa capacité de résistance. »
            </div>
          </div>

          {/* Key Facts / Colophon */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <div className="font-mono uppercase tracking-widest text-[#D4AF37] mb-3 font-semibold">
              Fiche Manuscrit
            </div>
            <div className="text-[#FAF4EB]/80">Volume : <strong>80 000 mots</strong></div>
            <div className="text-[#FAF4EB]/80">Structure : <strong>26 chapitres + épilogue</strong></div>
            <div className="text-[#FAF4EB]/80">Itinéraire : <strong>Tōkaidō (53 stations)</strong></div>
            <div className="text-[#FAF4EB]/80">Période : <strong>1603 (Ieyasu) / Présent</strong></div>
            <div className="text-[#FAF4EB]/80">Genre : <strong>Roman philosophique</strong></div>
          </div>

          {/* Legal & Member Area Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono uppercase tracking-widest text-[#D4AF37] mb-3 font-semibold">
              Espace Membre & Légal
            </div>
            
            <div className="flex flex-col gap-2 text-xs font-serif">
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 text-left text-[#FAF4EB]/80 hover:text-[#D4AF37] transition-colors py-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#963532]" />
                  <span>Espace Membre & Sceau Hanko</span>
                </button>
              )}

              {onOpenCGU && (
                <button
                  onClick={onOpenCGU}
                  className="flex items-center gap-2 text-left text-[#FAF4EB]/80 hover:text-[#D4AF37] transition-colors py-1"
                >
                  <Scale className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Conditions Générales d’Utilisation (CGU)</span>
                </button>
              )}

              {onOpenPrivacy && (
                <button
                  onClick={onOpenPrivacy}
                  className="flex items-center gap-2 text-left text-[#FAF4EB]/80 hover:text-[#D4AF37] transition-colors py-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Politique de Confidentialité & RGPD</span>
                </button>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1A1613] hover:bg-[#251E19] border border-[#C5A880]/30 text-xs font-serif text-[#FAF4EB] transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Lien Copié</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Partager</span>
                  </>
                )}
              </button>

              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-[#141210] hover:bg-[#1A1613] border border-white/10 text-xs font-serif text-[#C5A880] transition-colors"
                title="Remonter en haut"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Copyright & Subtext */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#C5A880]/60 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} « Le Fardeau et le Chemin ». Tous droits réservés.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#963532]" />
            <span>Sécurisé par Supabase PostgreSQL RLS • Direction artistique Wabi-Sabi & Laque d'Edo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

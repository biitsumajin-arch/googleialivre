import React, { useState } from 'react';
import { TokugawaCrest } from './TokugawaCrest';
import { X, ShieldCheck, FileText, Lock, Scale, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'cgu' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'cgu',
}) => {
  const [activeTab, setActiveTab] = useState<'cgu' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      id="legal-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#1A1613] border-2 border-[#C5A880]/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C5A880]/20 bg-[#141210]">
          <div className="flex items-center gap-3">
            <TokugawaCrest size={26} color="#D4AF37" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#FAF4EB]">
                {activeTab === 'cgu' ? 'Conditions Générales d’Utilisation (CGU)' : 'Politique de Confidentialité & RGPD'}
              </h3>
              <div className="text-[11px] font-mono text-[#D4AF37]">
                Cadre Juridique • Le Fardeau et le Chemin
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#C5A880] hover:text-[#FAF4EB] hover:bg-[#963532]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 border-b border-[#C5A880]/20 bg-[#171310] text-xs font-serif">
          <button
            onClick={() => setActiveTab('cgu')}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'cgu'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#963532]" />
            <span>Conditions d'Utilisation (CGU)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Confidentialité & Données</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6 text-xs font-serif text-[#FAF4EB]/80 leading-relaxed">
          
          {activeTab === 'cgu' ? (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-[#141210] border border-[#C5A880]/20 text-[11px] font-mono text-[#D4AF37]">
                Dernière mise à jour : 2026 • Roman original « Le Fardeau et le Chemin » (80 000 mots).
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  Article 1 — Objet du Service
                </h4>
                <p>
                  La présente plateforme web a pour vocation exclusive de présenter le manuscrit littéraire « Le Fardeau et le Chemin », ses repères géographiques sur la route du Tōkaidō, ses concepts philosophiques d’inspiration japonaise (Wabi-Sabi, Datsuzoku, Nin) ainsi que d'offrir un espace de lecture confidentiel pour les lecteurs et comités éditoriaux.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  Article 2 — Propriété Intellectuelle & Droits d’Auteur
                </h4>
                <p>
                  L’ensemble des textes, extraits narratifs, descriptions de chapitres, concepts philosophiques et structure du roman sont la propriété intellectuelle exclusive de l’auteur. Toute reproduction intégrale ou partielle, diffusion publique sans accord préalable ou exploitation commerciale du manuscrit sans contrat d'édition officiel est formellement interdite au titre du Code de la Propriété Intellectuelle.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  Article 3 — Espace Membre & Sceau Hanko
                </h4>
                <p>
                  L'inscription par e-mail et pseudonyme génère un sceau personnel Hanko numérique. L'utilisateur s'engage à fournir des informations loyales. L'attribution du rôle d'administrateur est strictement réservée à l'adresse certifiée de l'auteur (biitsumajin@gmail.com).
                </p>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  Article 4 — Service Éditorial & Demande de Manuscrit
                </h4>
                <p>
                  Les demandes de manuscrit complet (80 000 mots) formulées via le formulaire dédié engagent le demandeur au secret professionnel et à la non-diffusion des fichiers sous pli numérique ou papier.
                </p>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-[#141210] border border-[#C5A880]/20 text-[11px] font-mono text-[#D4AF37]">
                Conformité RGPD & Politique de protection de la vie privée.
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  1. Données Collectées
                </h4>
                <p>
                  Dans le cadre de l'espace membre et de la liseuse littéraire, seules les données strictement nécessaires au fonctionnement du service sont traitées :
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-[#FAF4EB]/70">
                  <li>Adresse e-mail (pour l'authentification chiffrée via Supabase Auth).</li>
                  <li>Pseudonyme choisi par l'utilisateur (pour la génération du sceau Hanko).</li>
                  <li>Préférences de lecture (chapitres favoris et étapes sauvegardées sur le Tōkaidō).</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  2. Sécurité & Infrastructure Supabase
                </h4>
                <p>
                  Les données d’authentification sont hébergées sur l'infrastructure sécurisée de <strong>Supabase (PostgreSQL)</strong> avec chiffrement des mots de passe (bcrypt) et isolation granulaire par <strong>Row Level Security (RLS)</strong>. Aucune donnée n'est revendue ou cédée à des tiers publicitaires.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  3. Cookies & Traceurs
                </h4>
                <p>
                  L’application n’utilise aucun cookie de ciblage marketing ou publicitaire. Seuls les jetons de session d'authentification strictement nécessaires au maintien de la connexion membre sont conservés localement dans votre navigateur.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-[#FAF4EB] uppercase tracking-wide mb-2 text-[#D4AF37]">
                  4. Vos Droits (Accès, Rectification, Suppression)
                </h4>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez à tout moment d'un droit d'accès, de rectification et de suppression totale de votre compte et de vos données en formulant une demande directe ou en supprimant votre session depuis l'espace membre.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#C5A880]/20 bg-[#141210]">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#963532] hover:bg-[#A83D3A] border border-[#D4AF37] text-xs font-serif font-bold text-[#FAF4EB] transition-colors"
          >
            Fermer la Fenêtre
          </button>
        </div>

      </div>
    </div>
  );
};

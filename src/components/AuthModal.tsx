import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HankoSeal } from './HankoSeal';
import { TokugawaCrest } from './TokugawaCrest';
import { X, Mail, Lock, User, Sparkles, CheckCircle, AlertCircle, ArrowRight, Shield, BookOpen, KeyRound } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signup',
}) => {
  const { signInWithEmail, signUpWithEmail, isConfigured } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorMsg('Veuillez renseigner votre pseudonyme pour forger votre sceau Hanko.');
          setLoading(false);
          return;
        }

        const { error } = await signUpWithEmail(email, password, displayName);
        if (error) {
          setErrorMsg(error.message || "Erreur lors de l'inscription");
          setLoading(false);
          return;
        }

        zenAudio.playTempleBell(1.2);
        setSuccessMsg(
          email.toLowerCase() === 'biitsumajin@gmail.com'
            ? 'Bienvenue, Administrateur Shogunal. Votre sceau et privilèges sont activés.'
            : 'Votre sceau Hanko de lecteur a été gravé avec succès !'
        );

        setTimeout(() => {
          onClose();
        }, 1200);

      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message || 'Identifiants invalides');
          setLoading(false);
          return;
        }

        zenAudio.playTempleBell(1.0);
        setSuccessMsg('Connexion réussie. Heureux retour sur le Tōkaidō.');
        setTimeout(() => {
          onClose();
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('biitsumajin@gmail.com');
    setPassword('Shogun2026!');
    setDisplayName('Biitsu Majin');
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#1A1613] border-2 border-[#C5A880]/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C5A880]/20 bg-[#141210]">
          <div className="flex items-center gap-3">
            <TokugawaCrest size={26} color="#D4AF37" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#FAF4EB]">
                {mode === 'signup' ? 'Créer son Sceau de Lecteur' : 'Connexion au Sanctuaire'}
              </h3>
              <div className="text-[11px] font-mono text-[#D4AF37]">
                Espace Membre • Le Fardeau et le Chemin
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

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 border-b border-[#C5A880]/20 bg-[#171310] text-xs font-serif">
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#963532]" />
            <span>Inscription & Sceau</span>
          </button>
          
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Se Connecter</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Live Hanko Seal Preview (During Signup) */}
          {mode === 'signup' && (
            <div className="p-4 rounded-xl bg-[#141210] border border-[#C5A880]/25 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                  <span>Aperçu de votre Sceau Hanko (判子)</span>
                </div>
                <p className="text-xs text-[#FAF4EB]/70 font-light font-serif">
                  Gravé à l'encre vermillon d'Edo à partir de votre pseudonyme.
                </p>
              </div>

              <div className="shrink-0 bg-[#FAF4EB]/95 p-2 rounded-xl border border-[#963532]/40 shadow-inner">
                <HankoSeal name={displayName || 'Lecteur'} size={56} />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Display Name (Only for signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                  Pseudonyme Littéraire (Gravé sur le sceau) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="ex. Voyageur d’Edo, Aoi, Julien..."
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] placeholder-[#FAF4EB]/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                  <User className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                Adresse E-mail *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="votre.email@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] placeholder-[#FAF4EB]/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                Mot de Passe *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] placeholder-[#FAF4EB]/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <Lock className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Feedback messages */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#963532]/20 border border-[#963532] text-xs text-[#FAF4EB] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-green-900/30 border border-green-500/40 text-xs text-green-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Quick Fill Button for the administrator email */}
            <div className="flex items-center justify-between text-[11px] text-[#C5A880]/70 pt-1">
              <span>Admin assigné : <code className="text-[#D4AF37]">biitsumajin@gmail.com</code></span>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="text-[#D4AF37] underline hover:text-[#FAF4EB] transition-colors"
              >
                Remplir en Admin
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#963532] to-[#782321] hover:from-[#A83D3A] hover:to-[#8E2F2D] text-[#FAF4EB] font-serif text-sm font-semibold tracking-wider uppercase border border-[#C5A880]/40 shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  Gravure du Sceau & Authentification...
                </span>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Valider et Obtenir mon Sceau' : 'Accéder à mon Espace Membre'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Database & RLS Security Notice */}
          <div className="pt-2 border-t border-[#C5A880]/15 flex items-start gap-2 text-[11px] text-[#C5A880]/70 font-serif">
            <Shield className="w-3.5 h-3.5 text-[#963532] shrink-0 mt-0.5" />
            <div>
              <span>Sécurité PostgreSQL avec <strong>Row Level Security (RLS)</strong>. Les comptes créés avec l'adresse <code className="text-[#D4AF37]">biitsumajin@gmail.com</code> reçoivent automatiquement le rôle <strong>admin</strong> par trigger sécurisé.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

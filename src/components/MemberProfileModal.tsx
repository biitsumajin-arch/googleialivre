import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HankoSeal } from './HankoSeal';
import { TokugawaCrest } from './TokugawaCrest';
import { CHAPTERS_LIST, TOKAIDO_STATIONS } from '../data/mockData';
import { X, User, LogOut, Shield, ShieldAlert, Sparkles, BookOpen, MapPin, Check, Edit2, Key, Database, FileText, Award } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReaderChapter?: (chapNum: number) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenReaderChapter,
}) => {
  const { user, profile, signOut, updateProfile, isConfigured } = useAuth();
  
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.display_name || '');
  const [savingName, setSavingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'reading' | 'schema'>('profile');
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!isOpen || !profile) return null;

  const isAdmin = profile.role === 'admin' || user?.email?.toLowerCase() === 'biitsumajin@gmail.com';

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    await updateProfile({ display_name: newName.trim() });
    setSavingName(false);
    setEditingName(false);
    zenAudio.playWaterDrop();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const bookmarkedChapters = CHAPTERS_LIST.filter(c => 
    (profile.bookmarked_chapters || [1]).includes(c.number)
  );

  const savedStations = TOKAIDO_STATIONS.filter(s => 
    (profile.saved_stations || ['nihonbashi', 'odawara']).includes(s.id)
  );

  return (
    <div
      id="member-profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-2xl bg-[#1A1613] border-2 border-[#C5A880]/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C5A880]/20 bg-[#141210]">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded bg-[#FAF4EB]/90 border border-[#963532]/40">
              <HankoSeal name={profile.display_name} size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#FAF4EB]">
                  {profile.display_name}
                </h3>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#963532] border border-[#D4AF37] text-[10px] font-mono text-[#FAF4EB] font-bold flex items-center gap-1 shadow">
                    <Shield className="w-3 h-3 text-[#D4AF37]" />
                    <span>ADMINISTRATEUR SHOGUNAL</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#201B17] border border-[#C5A880]/30 text-[10px] font-mono text-[#D4AF37]">
                    LECTEUR DU TŌKAIDŌ
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[#C5A880]/70">
                {user?.email || 'Membre vérifié'}
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
        <div className="grid grid-cols-3 border-b border-[#C5A880]/20 bg-[#171310] text-xs font-serif">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mon Sceau & Profil</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reading')}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'reading'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Carnet de Route & Marque-pages</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 text-center font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'schema'
                ? 'bg-[#1A1613] text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-[#FAF4EB]/60 hover:text-[#FAF4EB]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Schéma SQL & RLS</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Profile & Hanko Card */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Hanko & Washi Presentation Card */}
              <div className="p-6 rounded-2xl bg-[#FAF4EB] text-[#221B16] border-2 border-[#C5A880] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                  <TokugawaCrest size={160} color="#963532" />
                </div>

                <div className="space-y-2 z-10 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#963532]/10 border border-[#963532]/30 text-xs font-mono text-[#963532] uppercase font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>Sceau Hanko Officiel de la Guilde d'Edo</span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#141210]">
                    {profile.display_name}
                  </h4>

                  <p className="text-xs text-[#221B16]/80 font-serif italic max-w-sm">
                    « Celui qui porte le fardeau sans courber l'échine trace la voie pour ceux qui le suivent. »
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-[#221B16]/70">
                    <span>Rôle : <strong>{isAdmin ? 'Administrateur' : 'Lecteur'}</strong></span>
                    <span>•</span>
                    <span>Email : <strong>{user?.email || 'Vérifié'}</strong></span>
                  </div>
                </div>

                {/* Hanko Seal Artifact */}
                <div className="z-10 flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-[#FAF4EB] border-2 border-[#963532]/40 shadow-lg">
                    <HankoSeal name={profile.display_name} size={92} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#963532] font-bold">
                    ESTAMPE VERMILLON
                  </span>
                </div>
              </div>

              {/* Edit Display Name */}
              <div className="p-5 rounded-xl bg-[#141210] border border-[#C5A880]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Modification du Pseudonyme
                  </span>
                  {!editingName && (
                    <button
                      onClick={() => { setEditingName(true); setNewName(profile.display_name); }}
                      className="flex items-center gap-1 text-xs text-[#C5A880] hover:text-[#FAF4EB] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                  )}
                </div>

                {editingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#1A1613] border border-[#C5A880]/40 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="px-4 py-2 rounded-lg bg-[#963532] hover:bg-[#A83D3A] text-xs font-serif font-bold text-[#FAF4EB] border border-[#D4AF37] transition-all"
                    >
                      {savingName ? 'Enregistrement...' : 'Graver'}
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="px-3 py-2 rounded-lg bg-[#201B17] text-xs text-[#FAF4EB]/70 hover:text-[#FAF4EB]"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#FAF4EB]/70 font-light">
                    Le pseudonyme permet de régénérer à la volée les initiales et monogrammes traditionnels de votre sceau personnel.
                  </p>
                )}
              </div>

              {/* Role & Privileges Box */}
              <div className="p-5 rounded-xl bg-[#141210] border border-[#C5A880]/20 flex items-start gap-4">
                {isAdmin ? (
                  <div className="p-2.5 rounded-xl bg-[#963532]/30 border border-[#963532] text-[#D4AF37] shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#201B17] border border-[#C5A880]/30 text-[#C5A880] shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                )}
                <div className="text-xs space-y-1">
                  <div className="font-serif font-bold text-[#FAF4EB] text-sm">
                    {isAdmin ? 'Droits d’Accès Shogunal (Admin)' : 'Privilèges du Cercle de Lecture'}
                  </div>
                  <p className="text-[#FAF4EB]/70 font-light leading-relaxed">
                    {isAdmin
                      ? 'Compte administrateur lié à biitsumajin@gmail.com. Autorisation complète de mise à jour des rôles et consultation du registre des manuscrits.'
                      : 'Accès libre à la liseuse de manuscrit, conservation des étapes favorites du Tōkaidō et synchronisation du carnet de voyage.'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Reading Log & Bookmarks */}
          {activeTab === 'reading' && (
            <div className="space-y-6">
              
              {/* Bookmarked Chapters */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-2 font-semibold">
                  <BookOpen className="w-4 h-4 text-[#963532]" />
                  <span>Chapitres Marqués dans la Liseuse</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookmarkedChapters.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#141210] border border-white/5 text-xs text-[#C5A880]/60">
                      Aucun chapitre marqué pour le moment.
                    </div>
                  ) : (
                    bookmarkedChapters.map(chap => (
                      <div
                        key={chap.number}
                        onClick={() => {
                          onClose();
                          if (onOpenReaderChapter) onOpenReaderChapter(chap.number);
                        }}
                        className="p-3.5 rounded-xl bg-[#141210] border border-[#C5A880]/20 hover:border-[#D4AF37] cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded bg-[#963532] text-[#FAF4EB] font-serif text-xs font-bold flex items-center justify-center">
                            {chap.number}
                          </span>
                          <div>
                            <div className="font-serif text-xs font-bold text-[#FAF4EB] group-hover:text-[#D4AF37] transition-colors">
                              {chap.title}
                            </div>
                            <div className="text-[10px] text-[#C5A880]/60 font-mono">
                              {chap.location}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#D4AF37] font-mono group-hover:underline">
                          Lire →
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Saved Stations on the Tōkaidō */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-[#963532]" />
                  <span>Relais Clés Enregistrés sur le Tōkaidō</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedStations.map(station => (
                    <div
                      key={station.id}
                      className="p-3.5 rounded-xl bg-[#141210] border border-[#C5A880]/20 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-serif text-xs font-bold text-[#FAF4EB]">
                          {station.name} ({station.japaneseName})
                        </div>
                        <div className="text-[10px] text-[#C5A880]/70 font-mono">
                          {station.modernLocation}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#963532]/20 border border-[#963532]/40 text-[#D4AF37] font-mono">
                        Relais #{station.stageNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SQL Schema & RLS Instructions */}
          {activeTab === 'schema' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#D4AF37] font-semibold">
                  Fichier supabase_schema.sql (Disponible à la racine)
                </span>
                <span className="text-[11px] text-[#C5A880]/80">
                  Trigger auto biitsumajin@gmail.com → role = admin
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#100D0B] border border-[#C5A880]/20 text-[#FAF4EB]/80 overflow-x-auto max-h-64 text-[11px] leading-relaxed">
                <pre>{`-- TRIGGER D'INSCRIPTION & ATTRIBUTION DE ROLE AUTOMATIQUE
IF lower(NEW.email) = 'biitsumajin@gmail.com' THEN
  v_assigned_role := 'admin';
ELSE
  v_assigned_role := 'reader';
END IF;

-- SÉCURITÉ ROW LEVEL SECURITY (RLS) SUR public.profiles
CREATE POLICY "Mise a jour de son propre profil avec controle de role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com'))
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
  );`}</pre>
              </div>

              <p className="text-[11px] text-[#C5A880]/80 font-serif leading-relaxed">
                Ce schéma garantit que personne ne peut s'attribuer le rôle administrateur via une injection API client. Seul l'email certifié <code className="text-[#D4AF37]">biitsumajin@gmail.com</code> ou un administrateur déjà authentifié est habilité par les politiques Postgres.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#C5A880]/20 bg-[#141210]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#221714] border border-[#963532]/50 hover:bg-[#963532] text-xs font-serif text-[#FAF4EB] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Se Déconnecter</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#1A1613] hover:bg-[#201B17] border border-[#C5A880]/30 text-xs font-serif text-[#FAF4EB] transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

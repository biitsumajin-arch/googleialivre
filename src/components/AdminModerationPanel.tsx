import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { HanafudaCard, ProposalStatus } from '../types';
import { INITIAL_HANAFUDA_CARDS } from '../data/extendedData';
import { TokugawaCrest } from './TokugawaCrest';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Sparkles,
  AlertTriangle,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

interface AdminModerationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { user, profile } = useAuth();
  const [proposals, setProposals] = useState<HanafudaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ProposalStatus | 'all'>('pending');
  const [moderationNote, setModerationNote] = useState<string>('');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase() === 'biitsumajin@gmail.com';

  const fetchAllProposals = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('hanafuda_proposals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Admin fetch error:', error.message);
          setProposals(INITIAL_HANAFUDA_CARDS);
        } else if (data) {
          const formatted: HanafudaCard[] = data.map(d => ({
            id: d.id,
            user_id: d.user_id,
            chapter_number: d.chapter_number,
            card_title: d.card_title,
            kanji: d.kanji,
            symbol: d.symbol,
            description: d.description,
            image_url: d.image_url,
            status: d.status as ProposalStatus,
            moderation_notes: d.moderation_notes,
            created_at: d.created_at,
            author_name: d.user_id === user?.id ? 'Administrateur' : 'Lecteur'
          }));
          setProposals(formatted);
        }
      } else {
        setProposals(INITIAL_HANAFUDA_CARDS);
      }
    } catch (err) {
      console.error('Fetch all proposals error:', err);
      setProposals(INITIAL_HANAFUDA_CARDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllProposals();
    }
  }, [isOpen]);

  const handleUpdateStatus = async (cardId: string, newStatus: ProposalStatus) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('hanafuda_proposals')
          .update({
            status: newStatus,
            moderation_notes: moderationNote.trim() || (newStatus === 'approved' ? 'Approuvé par le Shogun' : 'Refusé pour non-conformité au thème d’Edo'),
            updated_at: new Date().toISOString()
          })
          .eq('id', cardId);

        if (error) throw error;
      }

      setProposals(prev =>
        prev.map(p =>
          p.id === cardId
            ? {
                ...p,
                status: newStatus,
                moderation_notes: moderationNote.trim() || (newStatus === 'approved' ? 'Approuvé par le Shogun' : 'Refusé')
              }
            : p
        )
      );

      setActiveCardId(null);
      setModerationNote('');
      zenAudio.playWaterDrop();
    } catch (err: any) {
      console.error('Moderation error:', err);
      alert('Erreur lors de la modération: ' + err.message);
    }
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#1A1613] border-2 border-red-500/50 text-center space-y-4 text-[#FAF4EB]">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold">Accès Réservé au Shogun</h3>
          <p className="text-xs text-[#C5A880] leading-relaxed">
            Seul l'administrateur (<strong className="text-[#FAF4EB]">biitsumajin@gmail.com</strong>) dispose des sceaux pour modérer les propositions Hanafuda et le registre.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#963532] text-xs font-bold font-serif uppercase tracking-wider"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const filteredProposals = proposals.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div
      id="admin-moderation-panel"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/92 backdrop-blur-lg animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl h-[92vh] rounded-2xl bg-[#141210] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col text-[#FAF4EB] font-serif">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#C5A880]/20 bg-[#1A1613] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#963532] text-[#FAF4EB] border border-[#D4AF37]/50 shadow">
              <TokugawaCrest size={24} color="#FAF4EB" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-wide">
                  Chambre de Modération Shogunale
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#963532] text-[#FAF4EB] font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-[#C5A880] font-sans">
                Validation et contrôle des motifs Hanafuda proposés par les membres
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#141210] border border-[#C5A880]/30 hover:bg-[#963532] text-xs transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quitter le panneau</span>
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="px-6 py-3 border-b border-[#C5A880]/15 bg-[#171310] flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#C5A880]">Filtrer par état :</span>
            {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-[#963532] text-[#FAF4EB] font-bold shadow'
                    : 'bg-[#141210] border border-[#C5A880]/20 text-[#FAF4EB]/70 hover:text-white'
                }`}
              >
                {status === 'pending'
                  ? 'En attente'
                  : status === 'approved'
                  ? 'Approuvées'
                  : status === 'rejected'
                  ? 'Refusées'
                  : 'Toutes'}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-[#D4AF37]">
            {filteredProposals.length} cartes listées
          </div>
        </div>

        {/* List of Proposals */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center py-16 font-mono text-xs opacity-60">
              Inspection des rouleaux de soumission...
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="text-center py-16 font-serif text-sm opacity-60 border border-dashed border-[#C5A880]/30 rounded-2xl">
              Aucune proposition Hanafuda dans cette catégorie.
            </div>
          ) : (
            filteredProposals.map((card) => {
              const isSelected = activeCardId === card.id;

              return (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl bg-[#1A1613] border border-[#C5A880]/25 flex flex-col md:flex-row gap-5 items-start justify-between relative group"
                >
                  {/* Card Mini Preview */}
                  <div className="w-24 h-32 rounded-xl overflow-hidden border border-[#D4AF37]/50 relative bg-black shrink-0 shadow-lg">
                    <img
                      src={card.image_url}
                      alt={card.card_title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 w-6 h-6 rounded bg-[#963532] font-kanji font-bold text-xs flex items-center justify-center text-[#FAF4EB]">
                      {card.kanji}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#141210] border border-[#C5A880]/30 text-[#D4AF37]">
                        Chapitre {card.chapter_number}
                      </span>
                      <h4 className="font-bold text-base text-[#FAF4EB]">
                        {card.card_title}
                      </h4>
                      <span className="text-xs text-[#C5A880] italic">
                        ({card.symbol})
                      </span>
                    </div>

                    <p className="text-xs text-[#FAF4EB]/80 leading-relaxed font-light">
                      {card.description}
                    </p>

                    <div className="text-[10px] font-mono text-[#C5A880]/70">
                      Soumis par {card.author_name || card.user_id} • Status : <strong className="text-[#FAF4EB] uppercase">{card.status}</strong>
                    </div>

                    {card.moderation_notes && (
                      <div className="text-[11px] text-[#D4AF37] italic bg-[#141210] p-2 rounded border border-[#C5A880]/20">
                        Note actuelle : {card.moderation_notes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons for Admin */}
                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(card.id, 'approved')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-500/50 shadow transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approuver</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(card.id, 'rejected')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-200 text-xs font-bold border border-red-500/50 shadow transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Refuser</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveCardId(isSelected ? null : card.id)}
                      className="text-[11px] text-[#C5A880] hover:text-[#D4AF37] underline text-center"
                    >
                      {isSelected ? 'Masquer motif personnalisé' : 'Ajouter un motif de modération'}
                    </button>
                  </div>

                  {/* Optional Moderation Note Input */}
                  {isSelected && (
                    <div className="w-full mt-3 pt-3 border-t border-[#C5A880]/20 flex gap-2">
                      <input
                        type="text"
                        value={moderationNote}
                        onChange={(e) => setModerationNote(e.target.value)}
                        placeholder="Motif officiel (ex: Conforme au style Hiroshige, validé)"
                        className="flex-1 p-2 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB]"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

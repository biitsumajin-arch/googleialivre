import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { HanafudaCard, ProposalStatus } from '../types';
import { INITIAL_HANAFUDA_CARDS } from '../data/extendedData';
import { CHAPTERS_LIST } from '../data/mockData';
import { TokugawaCrest } from './TokugawaCrest';
import { HankoSeal } from './HankoSeal';
import {
  Sparkles,
  Upload,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Layers,
  Info,
  Check,
  AlertCircle,
  Eye,
  BookOpen
} from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';
import { triggerEmailNotification } from '../lib/emailNotificationService';

interface HanafudaGallerySectionProps {
  onOpenAuth?: () => void;
  onOpenReaderChapter?: (num: number) => void;
}

export const HanafudaGallerySection: React.FC<HanafudaGallerySectionProps> = ({
  onOpenAuth,
  onOpenReaderChapter
}) => {
  const { user, profile } = useAuth();
  const [cards, setCards] = useState<HanafudaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'official' | 'community'>('all');
  const [selectedCard, setSelectedCard] = useState<HanafudaCard | null>(null);

  // Proposal Form Modal State
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [chapterNum, setChapterNum] = useState<number>(1);
  const [cardTitle, setCardTitle] = useState('');
  const [kanji, setKanji] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase() === 'biitsumajin@gmail.com';

  // Fetch approved + owned cards
  const fetchCards = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('hanafuda_proposals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Erreur Supabase hanafuda, chargement cartes initiales:', error.message);
          setCards(INITIAL_HANAFUDA_CARDS);
        } else if (data && data.length > 0) {
          // Merge initial official cards + DB proposals
          const dbCards: HanafudaCard[] = data.map(d => ({
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
            author_name: d.user_id === user?.id ? (profile?.display_name || 'Moi') : 'Lecteur du Tōkaidō',
            isOfficial: false
          }));

          // Deduplicate
          const combined = [...INITIAL_HANAFUDA_CARDS, ...dbCards];
          setCards(combined);
        } else {
          setCards(INITIAL_HANAFUDA_CARDS);
        }
      } else {
        setCards(INITIAL_HANAFUDA_CARDS);
      }
    } catch (err: any) {
      console.error('Fetch cards error:', err);
      setCards(INITIAL_HANAFUDA_CARDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  // Handle file select with 2 MB & mime type validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 2 MB (2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setFormError('L’image dépasse la limite maximale de 2 Mo imposée par les règles de conservation.');
      return;
    }

    // Check extension / MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormError('Format invalide. Seuls les formats .jpg, .png et .webp sont acceptés.');
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  // Submit proposal
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!cardTitle.trim() || !kanji.trim() || !symbol.trim() || !description.trim()) {
      setFormError('Veuillez remplir tous les champs du motif Hanafuda.');
      return;
    }

    if (!imageFile && !imagePreviewUrl) {
      setFormError('Veuillez charger une estampe ou illustration pour la carte (max 2 Mo).');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      let finalImageUrl = imagePreviewUrl || 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800';

      // 1. Upload to Supabase Storage 'hanafuda-images' bucket
      if (isSupabaseConfigured && supabase && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('hanafuda-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.warn('Storage upload error, using local fallback:', uploadError.message);
        } else if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('hanafuda-images')
            .getPublicUrl(uploadData.path);

          finalImageUrl = publicUrlData.publicUrl;
        }

        // 2. Insert into public.hanafuda_proposals
        const { data: insertData, error: insertError } = await supabase
          .from('hanafuda_proposals')
          .insert({
            user_id: user.id,
            chapter_number: chapterNum,
            card_title: cardTitle.trim(),
            kanji: kanji.trim(),
            symbol: symbol.trim(),
            description: description.trim(),
            image_url: finalImageUrl,
            status: 'pending'
          })
          .select()
          .single();

        if (insertError) throw insertError;
      }

      // Add to local state for immediate feedback
      const newCard: HanafudaCard = {
        id: `h-prop-local-${Date.now()}`,
        user_id: user.id,
        chapter_number: chapterNum,
        card_title: cardTitle.trim(),
        kanji: kanji.trim(),
        symbol: symbol.trim(),
        description: description.trim(),
        image_url: finalImageUrl,
        status: 'pending',
        author_name: profile?.display_name || 'Moi',
        created_at: new Date().toISOString()
      };

      setCards(prev => [newCard, ...prev]);

      // Déclencher la notification email vers biitsumajin@gmail.com
      triggerEmailNotification({
        type: 'new_hanafuda',
        customData: {
          chapter_number: chapterNum,
          display_name: profile?.display_name || 'Un membre du Tōkaidō',
          card_title: cardTitle.trim(),
          kanji: kanji.trim(),
          symbol: symbol.trim(),
          description: description.trim(),
          image_url: finalImageUrl
        }
      }).catch(e => console.warn('Notification email background:', e));

      setFormSuccess('Votre carte Hanafuda a été soumise avec succès au comité de modération shogunal.');
      zenAudio.playWaterDrop();

      setTimeout(() => {
        setSubmitModalOpen(false);
        setFormSuccess(null);
        setCardTitle('');
        setKanji('');
        setSymbol('');
        setDescription('');
        setImageFile(null);
        setImagePreviewUrl(null);
      }, 2500);

    } catch (err: any) {
      console.error('Submit proposal error:', err);
      setFormError(err.message || 'Erreur lors de la soumission de la carte.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Cards
  const filteredCards = cards.filter(c => {
    // If pending/rejected, only show if owner or admin
    if (c.status === 'pending' || c.status === 'rejected') {
      const isOwner = user && user.id === c.user_id;
      if (!isOwner && !isAdmin) return false;
    }

    if (selectedFilter === 'official') return c.isOfficial;
    if (selectedFilter === 'community') return !c.isOfficial;
    return true;
  });

  return (
    <section
      id="hanafuda-gallery-section"
      className="py-24 bg-[#141210] relative border-t border-[#C5A880]/20 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C5A880]/20 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1613] border border-[#C5A880]/30 text-xs font-mono text-[#D4AF37] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#963532]" />
              <span>Galerie Participative des Fleurs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
              Le Jeu des <span className="gold-gradient-text italic">Hanafuda</span> Littéraires
            </h2>
            <p className="text-sm sm:text-base text-[#C5A880]/80 font-light leading-relaxed">
              À chaque chapitre du roman correspond une allégorie florale et poétique de l’Ère Edo. Proposez votre propre carte illustrée pour enrichir le jeu de mémoire du Tōkaidō.
            </p>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (!user && onOpenAuth) {
                  onOpenAuth();
                } else {
                  setSubmitModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#963532] to-[#7B2725] hover:from-[#A83D3A] hover:to-[#8E2F2D] text-[#FAF4EB] text-xs font-bold font-serif tracking-wider uppercase border border-[#C5A880]/40 shadow-xl hover:shadow-[#963532]/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Forger une Carte Hanafuda</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap text-xs font-serif">
          <div className="flex items-center gap-2 bg-[#1A1613] p-1 rounded-xl border border-[#C5A880]/25">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#963532] text-[#FAF4EB] font-bold shadow'
                  : 'text-[#FAF4EB]/70 hover:text-[#FAF4EB]'
              }`}
            >
              Toutes les Cartes ({cards.length})
            </button>
            <button
              onClick={() => setSelectedFilter('official')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'official'
                  ? 'bg-[#963532] text-[#FAF4EB] font-bold shadow'
                  : 'text-[#FAF4EB]/70 hover:text-[#FAF4EB]'
              }`}
            >
              Estampes Officielles
            </button>
            <button
              onClick={() => setSelectedFilter('community')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedFilter === 'community'
                  ? 'bg-[#963532] text-[#FAF4EB] font-bold shadow'
                  : 'text-[#FAF4EB]/70 hover:text-[#FAF4EB]'
              }`}
            >
              Créations Communautaires
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#C5A880]">
            Format Hanafuda • 12 Suites Florales & 26 Chapitres
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs text-[#C5A880]">
            Déploiement des cartes du jeu Hanafuda...
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#C5A880]/30 rounded-2xl p-8 font-serif text-sm text-[#FAF4EB]/60">
            Aucune carte ne correspond au filtre sélectionné. Soyez le premier voyageur à forger une estampe.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCards.map((card) => {
              const isOwner = user && user.id === card.user_id;

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="group relative rounded-2xl bg-[#1A1613] border border-[#C5A880]/25 hover:border-[#D4AF37] p-4 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Top Status & Chapter Badge */}
                  <div className="flex items-center justify-between mb-3 z-10">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#141210] border border-[#C5A880]/30 text-[#D4AF37]">
                      Ch. {card.chapter_number}
                    </span>

                    {card.status === 'pending' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 border border-amber-500/50 text-amber-300 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>En modération</span>
                      </span>
                    )}

                    {card.status === 'rejected' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 border border-red-500/50 text-red-300 flex items-center gap-1 font-mono">
                        <XCircle className="w-3 h-3" />
                        <span>Refusée</span>
                      </span>
                    )}

                    {card.isOfficial && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#963532] text-[#FAF4EB] font-serif font-bold">
                        Édition Officielle
                      </span>
                    )}
                  </div>

                  {/* Card Illustration Area (Hanafuda Proportions 1:1.6) */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border-2 border-[#C5A880]/30 group-hover:border-[#D4AF37] transition-colors mb-4 bg-black/40 shadow-inner">
                    <img
                      src={card.image_url}
                      alt={card.card_title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Prominent Red Vermilion Kanji Emblem */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-[#963532] border border-[#D4AF37] flex items-center justify-center font-kanji font-bold text-lg text-[#FAF4EB] shadow-lg">
                      {card.kanji}
                    </div>

                    {/* Symbol Subtext at bottom of image */}
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <span className="text-[10px] font-serif text-[#FAF4EB] bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10 line-clamp-1">
                        {card.symbol}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-1.5 font-serif">
                    <h3 className="font-bold text-base text-[#FAF4EB] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {card.card_title}
                    </h3>
                    <p className="text-xs text-[#FAF4EB]/70 line-clamp-2 font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Card Footer: Author & Inspect */}
                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#C5A880]/70 font-mono">
                    <span className="line-clamp-1 max-w-[120px]">
                      {card.author_name || 'Voyageur d’Edo'}
                    </span>
                    <span className="group-hover:text-[#D4AF37] flex items-center gap-1 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examiner</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#1A1613] border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 text-[#FAF4EB] font-serif"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Card Illustration */}
            <div className="w-full md:w-1/2 aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#C5A880]/40 relative bg-black shrink-0 shadow-2xl">
              <img
                src={selectedCard.image_url}
                alt={selectedCard.card_title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 w-11 h-11 rounded-xl bg-[#963532] border-2 border-[#D4AF37] flex items-center justify-center font-kanji font-black text-2xl text-[#FAF4EB] shadow-2xl">
                {selectedCard.kanji}
              </div>
            </div>

            {/* Right: Literary Symbolism & Chapter link */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                    Chapitre {selectedCard.chapter_number}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#141210] border border-[#C5A880]/30 text-[#C5A880]">
                    {selectedCard.symbol}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#FAF4EB] mb-2">
                  {selectedCard.card_title}
                </h3>

                <div className="text-xs text-[#C5A880] mb-4 font-mono">
                  Sceau de création : <strong>{selectedCard.author_name || 'Auteur du roman'}</strong>
                </div>

                <p className="text-xs sm:text-sm text-[#FAF4EB]/85 leading-relaxed font-light mb-4">
                  {selectedCard.description}
                </p>

                {selectedCard.moderation_notes && (
                  <div className="p-3 rounded-lg bg-[#221B16] border border-[#D4AF37]/30 text-xs text-[#D4AF37]">
                    <strong>Note du Shogun :</strong> {selectedCard.moderation_notes}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                {onOpenReaderChapter && (
                  <button
                    onClick={() => {
                      setSelectedCard(null);
                      onOpenReaderChapter(selectedCard.chapter_number);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#963532] hover:bg-[#A83D3A] text-xs font-bold text-[#FAF4EB] shadow transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lire le Chapitre {selectedCard.chapter_number}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] hover:bg-[#201B17] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Proposal Modal */}
      {submitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md animate-fadeIn"
          onClick={() => setSubmitModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1A1613] border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-8 text-[#FAF4EB] font-serif space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#C5A880]/20 pb-4">
              <div className="flex items-center gap-3">
                <TokugawaCrest size={26} color="#D4AF37" />
                <div>
                  <h3 className="text-xl font-bold">Forger une Carte Hanafuda</h3>
                  <div className="text-xs font-mono text-[#D4AF37]">
                    Galerie Participative & Soumission aux Sceaux d'Edo
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded text-[#C5A880] hover:text-[#FAF4EB]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs font-serif">
              
              {/* Chapter Selection */}
              <div>
                <label className="block text-[#D4AF37] font-bold mb-1.5 uppercase tracking-wide">
                  Chapitre associé (1 à 26) :
                </label>
                <select
                  value={chapterNum}
                  onChange={(e) => setChapterNum(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37]"
                >
                  {CHAPTERS_LIST.map((c) => (
                    <option key={c.number} value={c.number}>
                      Chapitre {c.number} : {c.title} ({c.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Kanji & Symbol */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#D4AF37] font-bold mb-1.5">
                    Titre Poétique de la Carte :
                  </label>
                  <input
                    type="text"
                    required
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    placeholder="Ex: Le Cèdre brumeux de Hakone"
                    className="w-full p-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#D4AF37] font-bold mb-1.5">
                    Kanji Clé (1 caractère) :
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={kanji}
                    onChange={(e) => setKanji(e.target.value)}
                    placeholder="Ex: 杉"
                    className="w-full p-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-[#FAF4EB] text-center font-kanji text-base font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D4AF37] font-bold mb-1.5">
                  Symbole Floral / Animal Traditionnel :
                </label>
                <input
                  type="text"
                  required
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Ex: Sugi (Cèdre) & Sanglier des brumes"
                  className="w-full p-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#D4AF37] font-bold mb-1.5">
                  Allégorie littéraire & Résonance avec le roman :
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez la symbolique de cette carte et son lien avec le cheminement intérieur d'Adrien..."
                  className="w-full p-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              {/* Image Upload Area with 2 Mo validation */}
              <div className="border border-dashed border-[#C5A880]/40 rounded-xl p-4 text-center space-y-2 bg-[#141210]/50">
                <label className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                  <span className="font-bold text-xs text-[#FAF4EB] block">
                    {imageFile ? imageFile.name : 'Sélectionner une estampe (.jpg, .png, .webp)'}
                  </span>
                  <span className="text-[10px] text-[#C5A880]/70 font-mono block">
                    Taille maximale autorisée : 2 Mo • Validé par Supabase Storage
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {imagePreviewUrl && (
                  <div className="w-24 h-32 mx-auto rounded-lg overflow-hidden border border-[#D4AF37] mt-2">
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Form Status Messages */}
              {formError && (
                <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#963532] hover:bg-[#A83D3A] text-xs font-bold text-[#FAF4EB] border border-[#D4AF37] shadow transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Gravure du motif...' : 'Soumettre au Shogunat'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};

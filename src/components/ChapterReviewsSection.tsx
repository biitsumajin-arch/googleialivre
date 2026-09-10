import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { ChapterReview } from '../types';
import { INITIAL_CHAPTER_REVIEWS } from '../data/extendedData';
import { TokugawaCrest } from './TokugawaCrest';
import { HankoSeal } from './HankoSeal';
import { Star, Send, Trash2, Edit3, MessageSquare, AlertCircle, Sparkles, Check, Shield } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';
import { triggerEmailNotification } from '../lib/emailNotificationService';

interface ChapterReviewsSectionProps {
  chapterNumber: number;
  chapterTitle: string;
  theme?: 'washi' | 'lacquer' | 'sepia';
  onOpenAuth?: () => void;
}

export const ChapterReviewsSection: React.FC<ChapterReviewsSectionProps> = ({
  chapterNumber,
  chapterTitle,
  theme = 'washi',
  onOpenAuth
}) => {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<ChapterReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New review form
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit review state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState('');

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase() === 'biitsumajin@gmail.com';

  // Load reviews from Supabase or fallback
  const fetchReviews = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('chapter_reviews')
          .select(`
            id,
            chapter_number,
            user_id,
            rating,
            comment,
            created_at,
            updated_at
          `)
          .eq('chapter_number', chapterNumber)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Erreur chargement avis Supabase, bascule mémoire locale:', error.message);
          const initial = INITIAL_CHAPTER_REVIEWS.filter(r => r.chapter_number === chapterNumber);
          setReviews(initial);
        } else if (data && data.length > 0) {
          // Join profiles display names
          const userIds = Array.from(new Set(data.map(d => d.user_id)));
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, display_name, role')
            .in('id', userIds);

          const profileMap = new Map((profilesData || []).map(p => [p.id, p]));

          const enrichedReviews: ChapterReview[] = data.map(r => ({
            ...r,
            author_name: profileMap.get(r.user_id)?.display_name || 'Lecteur du Tōkaidō',
            author_role: profileMap.get(r.user_id)?.role || 'reader'
          }));

          setReviews(enrichedReviews);
        } else {
          // Check if mock has reviews
          const initial = INITIAL_CHAPTER_REVIEWS.filter(r => r.chapter_number === chapterNumber);
          setReviews(initial);
        }
      } else {
        const initial = INITIAL_CHAPTER_REVIEWS.filter(r => r.chapter_number === chapterNumber);
        setReviews(initial);
      }
    } catch (err: any) {
      console.error('Fetch reviews error:', err);
      const initial = INITIAL_CHAPTER_REVIEWS.filter(r => r.chapter_number === chapterNumber);
      setReviews(initial);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [chapterNumber]);

  // Submit new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Veuillez rédiger quelques mots pour partager votre ressenti de lecture.');
      return;
    }
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('chapter_reviews')
          .insert({
            chapter_number: chapterNumber,
            user_id: user.id,
            rating,
            comment: comment.trim()
          });

        if (error) throw error;
      }

      // Add locally for instant feedback
      const newReviewItem: ChapterReview = {
        id: `rev-local-${Date.now()}`,
        chapter_number: chapterNumber,
        user_id: user.id,
        rating,
        comment: comment.trim(),
        author_name: profile?.display_name || 'Lecteur du Tōkaidō',
        author_role: profile?.role || 'reader',
        created_at: new Date().toISOString()
      };

      setReviews(prev => [newReviewItem, ...prev]);

      // Déclencher la notification par email vers biitsumajin@gmail.com via l'Edge Function
      triggerEmailNotification({
        type: 'new_review',
        customData: {
          chapter_number: chapterNumber,
          chapter_title: chapterTitle,
          display_name: profile?.display_name || 'Un voyageur du Tōkaidō',
          rating,
          comment: comment.trim()
        }
      }).catch(e => console.warn('Notification email background:', e));

      setComment('');
      setRating(5);
      setSuccessMsg('Votre note de lecture a été enregistrée avec succès dans le registre.');
      zenAudio.playWaterDrop();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Submit review error:', err);
      setErrorMsg(err.message || 'Impossible d’enregistrer l’avis.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Supprimer cette note de lecture du registre ?')) return;

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('chapter_reviews')
          .delete()
          .eq('id', reviewId);

        if (error) throw error;
      }

      setReviews(prev => prev.filter(r => r.id !== reviewId));
      zenAudio.playWaterDrop();
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  // Update review
  const handleUpdateReview = async (reviewId: string) => {
    if (!editComment.trim()) return;

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('chapter_reviews')
          .update({
            rating: editRating,
            comment: editComment.trim()
          })
          .eq('id', reviewId);

        if (error) throw error;
      }

      setReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return { ...r, rating: editRating, comment: editComment.trim(), updated_at: new Date().toISOString() };
        }
        return r;
      }));

      setEditingReviewId(null);
      zenAudio.playWaterDrop();
    } catch (err: any) {
      console.error('Update error:', err);
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

  const isDark = theme === 'lacquer';

  return (
    <div className={`mt-16 pt-10 border-t ${isDark ? 'border-[#C5A880]/20' : 'border-[#963532]/20'}`}>
      
      {/* Header of reviews */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded ${
              isDark ? 'bg-[#963532]/80 text-[#FAF4EB]' : 'bg-[#963532] text-[#FAF4EB]'
            }`}>
              Registre de Lecture
            </span>
            <span className={`text-xs ${isDark ? 'text-[#C5A880]' : 'text-[#8A7968]'}`}>
              {reviews.length} témoignage{reviews.length > 1 ? 's' : ''}
            </span>
          </div>
          <h3 className={`font-serif text-2xl font-bold mt-1 ${isDark ? 'text-[#FAF4EB]' : 'text-[#141210]'}`}>
            Avis & Échos sur le Chapitre {chapterNumber}
          </h3>
        </div>

        {/* Global chapter score badge */}
        {reviews.length > 0 && (
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
            isDark ? 'bg-[#1A1613] border-[#C5A880]/30' : 'bg-[#FAF4EB] border-[#963532]/20 shadow-sm'
          }`}>
            <div className="flex items-center text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map((s) => {
                const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
                return (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avg) ? 'fill-[#D4AF37]' : 'text-[#C5A880]/30'}`}
                  />
                );
              })}
            </div>
            <span className={`font-serif font-bold text-sm ${isDark ? 'text-[#FAF4EB]' : 'text-[#141210]'}`}>
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 5
            </span>
          </div>
        )}
      </div>

      {/* Submit Review Form Box */}
      <div className={`p-6 rounded-2xl border mb-10 transition-all ${
        isDark
          ? 'bg-[#1A1613] border-[#C5A880]/30 shadow-xl shadow-black/40'
          : 'bg-[#F2ECE1] border-[#C5A880]/40 shadow-md'
      }`}>
        {user ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#FAF4EB] rounded p-0.5 border border-[#963532]">
                  <HankoSeal name={profile?.display_name || 'Voyageur'} size={24} />
                </div>
                <div>
                  <span className={`font-serif text-sm font-bold block ${isDark ? 'text-[#FAF4EB]' : 'text-[#141210]'}`}>
                    {profile?.display_name}
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-[#C5A880]' : 'text-[#8A7968]'}`}>
                    Apposer votre sceau de lecture
                  </span>
                </div>
              </div>

              {/* Star rating picker */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-[#D4AF37] hover:scale-125 transition-transform"
                    title={`${star} blasons shogonaux sur 5`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-[#C5A880]/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#963532]/20 border border-[#963532] text-xs text-[#FAF4EB]">
                <AlertCircle className="w-4 h-4 text-[#963532] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Partagez votre lecture du Chapitre ${chapterNumber} : résonance philosophique, échos personnels, passage marquant...`}
                className={`w-full p-3.5 rounded-xl text-xs font-serif leading-relaxed resize-none focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#141210] border border-[#C5A880]/30 text-[#FAF4EB] focus:border-[#D4AF37]'
                    : 'bg-[#FAF4EB] border border-[#C5A880]/50 text-[#141210] focus:border-[#963532]'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className={`text-[10px] italic ${isDark ? 'text-[#C5A880]/70' : 'text-[#8A7968]'}`}>
                Visible par tous les voyageurs du Tōkaidō. Notification transmise à l'auteur.
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#963532] hover:bg-[#A83D3A] text-[#FAF4EB] font-serif text-xs font-bold border border-[#D4AF37] shadow-lg transition-all"
              >
                {submitting ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Graver mon Avis</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#963532]/20 border border-[#963532] flex items-center justify-center mx-auto text-[#D4AF37]">
              <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className={`font-serif text-base font-bold ${isDark ? 'text-[#FAF4EB]' : 'text-[#141210]'}`}>
              Rejoindre le Registre des Lecteurs
            </div>
            <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-[#C5A880]' : 'text-[#8A7968]'}`}>
              Connectez-vous pour apposer votre sceau Hanko et consigner vos impressions sur ce chapitre.
            </p>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#963532] text-[#FAF4EB] font-serif text-xs font-bold border border-[#D4AF37] shadow-md hover:bg-[#A83D3A] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Se connecter / Forger mon Sceau</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* List of Reviews */}
      {loading ? (
        <div className="text-center py-10 space-y-2">
          <Sparkles className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs text-[#C5A880] font-mono">Consultation des archives du chapitre...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className={`text-center py-12 border border-dashed rounded-2xl ${
          isDark ? 'border-[#C5A880]/30 text-[#C5A880]' : 'border-[#963532]/30 text-[#8A7968]'
        }`}>
          <TokugawaCrest size={32} color={isDark ? '#C5A880' : '#963532'} className="mx-auto mb-2 opacity-60" />
          <p className="font-serif text-sm">Le registre de ce chapitre attend son premier témoignage.</p>
          <p className="text-[11px] mt-1 opacity-70">Soyez le premier voyageur à consigner vos mots.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isAuthor = user && rev.user_id === user.id;
            const canManage = isAuthor || isAdmin;
            const isEditing = editingReviewId === rev.id;

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-[#1A1613]/90 border-[#C5A880]/20 hover:border-[#C5A880]/40'
                    : 'bg-[#FAF4EB] border-[#C5A880]/40 hover:border-[#963532]/40 shadow-sm'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold">Modifier votre note :</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setEditRating(s)}
                            className="p-1"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                editRating >= s ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#C5A880]/30'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className={`w-full p-3 rounded-lg text-xs font-serif ${
                        isDark ? 'bg-[#141210] text-[#FAF4EB] border border-[#C5A880]/30' : 'bg-[#F2ECE1] text-[#141210] border border-[#C5A880]/50'
                      }`}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="px-3 py-1.5 rounded text-xs text-[#C5A880] hover:text-[#FAF4EB]"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleUpdateReview(rev.id)}
                        className="px-4 py-1.5 rounded bg-[#963532] text-[#FAF4EB] font-serif text-xs font-bold"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Header of single review */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#FAF4EB] rounded p-0.5 border border-[#963532] shrink-0 shadow-sm">
                          <HankoSeal name={rev.author_name || 'Voyageur'} size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-serif text-sm font-bold ${isDark ? 'text-[#FAF4EB]' : 'text-[#141210]'}`}>
                              {rev.author_name}
                            </span>
                            {rev.author_role === 'admin' && (
                              <span className="flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#963532] text-[#FAF4EB] border border-[#D4AF37]">
                                <Shield className="w-2.5 h-2.5" /> Shogun (Admin)
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-mono ${isDark ? 'text-[#C5A880]/70' : 'text-[#8A7968]'}`}>
                            {new Date(rev.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Rating Stars */}
                        <div className="flex items-center text-[#D4AF37]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-[#D4AF37]' : 'text-[#C5A880]/30'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Action buttons if owner or admin */}
                        {canManage && (
                          <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
                            {isAuthor && (
                              <button
                                onClick={() => {
                                  setEditingReviewId(rev.id);
                                  setEditRating(rev.rating);
                                  setEditComment(rev.comment);
                                }}
                                title="Modifier mon avis"
                                className="p-1 text-[#C5A880] hover:text-[#D4AF37] transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              title="Supprimer l'avis"
                              className="p-1 text-[#C5A880] hover:text-[#963532] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className={`font-serif text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pl-9 ${
                      isDark ? 'text-[#FAF4EB]/90' : 'text-[#2D2824]'
                    }`}>
                      {rev.comment}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

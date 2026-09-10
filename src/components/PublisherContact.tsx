import React, { useState } from 'react';
import { TokugawaCrest } from './TokugawaCrest';
import { Mail, Send, ShieldCheck, FileCheck, CheckCircle2, Building, User, Phone, Sparkles } from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';
import { triggerEmailNotification } from '../lib/emailNotificationService';

export const PublisherContact: React.FC = () => {
  const [formData, setFormData] = useState({
    publisherName: '',
    contactPerson: '',
    email: '',
    phone: '',
    inquiryType: 'manuscript_request',
    message: '',
    confidentialityAccepted: true,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.publisherName || !formData.contactPerson || !formData.email) return;

    setLoading(true);
    
    // Trigger Edge Function send-email notification for publishers
    await triggerEmailNotification({
      type: 'editorial_inquiry',
      customData: {
        publisherName: formData.publisherName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        inquiryType: formData.inquiryType,
        message: formData.message
      }
    });

    setLoading(false);
    setSubmitted(true);
    zenAudio.playTempleBell(1.2);
  };

  return (
    <section
      id="publisher-section"
      className="py-24 bg-lacquer-pattern border-t border-[#C5A880]/20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Presentation & Pitch Deck */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1613] border border-[#C5A880]/30 text-xs font-mono text-[#D4AF37] uppercase tracking-widest">
              <Building className="w-3.5 h-3.5 text-[#963532]" />
              <span>Espace Maisons d’Édition & Droits</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF4EB] tracking-tight">
              Dossier Éditorial & <span className="gold-gradient-text italic">Service de Presse</span>
            </h2>

            <p className="text-sm text-[#FAF4EB]/80 leading-relaxed font-light">
              Le manuscrit intégral (80 000 mots, 26 chapitres + épilogue), le synopsis détaillé ainsi que la note d’intention de l’auteur sont mis à disposition des comités de lecture, directeurs de collection et agents littéraires.
            </p>

            {/* Editorial Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1A1613] border border-[#C5A880]/20">
                <FileCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#FAF4EB]">Manuscrit Finalisé & Relu</div>
                  <div className="text-[#C5A880]/80">Format PDF, ePub ou broché sous pli confidentiel</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1A1613] border border-[#C5A880]/20">
                <ShieldCheck className="w-5 h-5 text-[#963532] shrink-0" />
                <div className="text-xs">
                  <div className="font-serif font-bold text-[#FAF4EB]">Droits Premiers & Adaptations Libres</div>
                  <div className="text-[#C5A880]/80">Droits d’édition papier, audio, traduction et audiovisuels disponibles</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1A1613] border border-[#C5A880]/30 flex items-center gap-3">
              <TokugawaCrest size={28} color="#D4AF37" />
              <div className="text-xs text-[#FAF4EB]/85 font-serif italic">
                « Un pont littéraire rare entre le monde des affaires contemporain et la sagesse du Japon d'Edo. »
              </div>
            </div>
          </div>

          {/* Right Column: Secure Publisher Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl bg-[#1A1613] border-2 border-[#C5A880]/35 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#963532]/20 border-2 border-[#963532] flex items-center justify-center text-[#D4AF37] mx-auto shadow-xl">
                    <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#FAF4EB]">
                    Demande de Manuscrit Transmise
                  </h3>
                  <p className="text-sm text-[#C5A880] max-w-md mx-auto font-light leading-relaxed">
                    Merci pour votre intérêt pour <span className="text-[#FAF4EB] font-medium">« Le Fardeau et le Chemin »</span>. Le service éditorial et l’auteur vous transmettront le dossier complet à l'adresse <strong>{formData.email}</strong> dans les plus brefs délais.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-lg bg-[#221C18] border border-[#C5A880]/30 text-xs font-serif text-[#FAF4EB] hover:border-[#D4AF37] transition-colors"
                    >
                      Envoyer une autre demande
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-[#C5A880]/20 pb-4 mb-2">
                    <h3 className="font-serif text-xl font-bold text-[#FAF4EB]">
                      Formulaire d’Accès Éditorial Confidentiel
                    </h3>
                    <p className="text-xs text-[#C5A880]/80 mt-0.5">
                      Réservé aux professionnels du livre et comités de lecture.
                    </p>
                  </div>

                  {/* Maison d'édition & Nom Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                        Maison d’Édition / Agence *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ex. Éditions Gallimard, Actes Sud..."
                        value={formData.publisherName}
                        onChange={(e) => setFormData({ ...formData, publisherName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                        Nom & Fonction *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ex. Éléonore B., Directrice de collection"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                        Email Professionnel *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@editeur.fr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                        Téléphone (Optionnel)
                      </label>
                      <input
                        type="tel"
                        placeholder="+33 1 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>

                  {/* Nature de la demande */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                      Nature de la Demande *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] transition-all"
                    >
                      <option value="manuscript_request">Demande du manuscrit intégral (80 000 mots)</option>
                      <option value="synopsis_pitch">Dossier de présentation & Pitch deck</option>
                      <option value="rights_adaptation">Renseignements sur les droits d'adaptation</option>
                      <option value="direct_exchange">Échange direct avec l'auteur</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-1.5">
                      Précisions / Note pour l'Auteur
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Indiquez vos délais de lecture souhaités ou toute précision relative à votre ligne éditoriale..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#141210] border border-[#C5A880]/30 text-xs text-[#FAF4EB] focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  {/* Confidentiality agreement checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="confidentiality"
                      checked={formData.confidentialityAccepted}
                      onChange={(e) => setFormData({ ...formData, confidentialityAccepted: e.target.checked })}
                      className="rounded bg-[#141210] border-[#C5A880]/40 text-[#963532] focus:ring-0"
                    />
                    <label htmlFor="confidentiality" className="text-[11px] text-[#FAF4EB]/70 select-none">
                      Engagement de confidentialité éditoriale (non-diffusion publique du manuscrit).
                    </label>
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
                        Transmission sécurisée...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmettre la Demande Éditrice</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { TokaidoStation } from '../types';
import { X, ZoomIn, ZoomOut, Maximize2, Sparkles, MapPin, Feather, Compass } from 'lucide-react';
import { TokugawaCrest } from './TokugawaCrest';

interface UkiyoEModalProps {
  station: TokaidoStation | null;
  onClose: () => void;
}

export const UkiyoEModal: React.FC<UkiyoEModalProps> = ({ station, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!station) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.3, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      id="ukiyo-e-full-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#161311] border border-[#C5A880]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1613] border-b border-[#C5A880]/25">
          <div className="flex items-center gap-3">
            <TokugawaCrest size={24} color="#D4AF37" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF4EB]">
                  {station.ukiyoEImage.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#963532]/70 text-[#FAF4EB] font-serif border border-[#963532]">
                  {station.japaneseName}
                </span>
              </div>
              <p className="text-xs text-[#C5A880] font-mono">
                {station.ukiyoEImage.artist} • {station.ukiyoEImage.period}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-[#141210] border border-[#C5A880]/30 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-[#FAF4EB]/70 hover:text-[#D4AF37] transition-colors"
                title="Dézoomer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 text-xs font-mono text-[#C5A880]"
                title="Réinitialiser le zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-[#FAF4EB]/70 hover:text-[#D4AF37] transition-colors"
                title="Zoomer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              id="close-ukiyo-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#141210] border border-[#C5A880]/30 hover:border-[#963532] text-[#FAF4EB] hover:text-[#963532] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Visualizer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Image Container with Zoom & Pan */}
          <div className="lg:col-span-8 overflow-hidden rounded-xl bg-black/60 border border-[#C5A880]/20 flex items-center justify-center min-h-[300px] sm:min-h-[420px] relative group">
            <div
              className="transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing max-h-[500px]"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={station.ukiyoEImage.imageUrl}
                alt={station.ukiyoEImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[480px] w-auto object-contain rounded shadow-2xl mx-auto"
              />
            </div>

            {/* Stamp watermark on image */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estampe HD du Tōkaidō</span>
            </div>
          </div>

          {/* Right Column: Literary & Historical Commentary */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
            
            {/* Station Stage Badge */}
            <div className="p-4 rounded-xl bg-[#1A1613] border border-[#C5A880]/25">
              <div className="flex items-center justify-between text-xs text-[#C5A880] mb-2 font-mono">
                <span>RELAIS : {station.stageNumber}</span>
                <span>ALTITUDE : {station.elevation || '—'}</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-[#FAF4EB] mb-1">
                {station.name}
              </h4>
              <p className="text-xs text-[#FAF4EB]/70 leading-relaxed font-light">
                {station.modernLocation}
              </p>
            </div>

            {/* Estampe Description */}
            <div className="p-4 rounded-xl bg-[#141210] border border-[#C5A880]/15">
              <div className="text-[11px] font-serif uppercase tracking-widest text-[#D4AF37] mb-1 font-bold">
                Analyse & Registre Pictural
              </div>
              <p className="text-xs text-[#FAF4EB]/85 leading-relaxed font-light">
                {station.ukiyoEImage.description}
              </p>
            </div>

            {/* Quote if available */}
            {station.quote && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#221715] to-[#1A1613] border-l-4 border-[#963532] border border-[#C5A880]/25">
                <div className="flex items-center gap-1.5 text-[11px] font-serif text-[#C5A880] mb-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#963532]" />
                  <span>Passage Gravé dans le Manuscrit</span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm text-[#FAF4EB] leading-relaxed">
                  {station.quote}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#963532] hover:bg-[#A83D3A] text-[#FAF4EB] text-xs font-serif uppercase tracking-wider border border-[#C5A880]/30 transition-colors"
            >
              Retourner à la Carte
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

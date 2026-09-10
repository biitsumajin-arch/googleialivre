import React, { useState } from 'react';
import { TOKAIDO_STATIONS } from '../data/mockData';
import { TokaidoStation } from '../types';
import { TokugawaCrest } from './TokugawaCrest';
import { UkiyoEModal } from './UkiyoEModal';
import {
  MapPin,
  Image as ImageIcon,
  Quote,
  Feather,
  Compass,
  ArrowRight,
  Maximize2,
  Share2,
  Check,
  Sparkles,
  List,
  Map,
  ChevronRight,
  Info
} from 'lucide-react';
import { zenAudio } from '../utils/audioSynthesizer';

export const TokaidoInteractiveMap: React.FC = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>('nihonbashi');
  const [activeUkiyoEStation, setActiveUkiyoEStation] = useState<TokaidoStation | null>(null);
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedStation = TOKAIDO_STATIONS.find(s => s.id === selectedStationId) || TOKAIDO_STATIONS[4];

  const handleSelectStation = (station: TokaidoStation) => {
    setSelectedStationId(station.id);
    zenAudio.playWaterDrop();
  };

  const handleCopyQuote = (quoteText: string) => {
    navigator.clipboard.writeText(quoteText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2200);
  };

  const filteredStations = TOKAIDO_STATIONS.filter(st => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'written') return st.isWritten;
    if (filterCategory === 'shogun') return st.category === 'shogun_legacy';
    if (filterCategory === 'tokaido') return st.category === 'tokaido_post';
    return true;
  });

  return (
    <section
      id="tokaido-map-section"
      className="relative py-24 bg-[#141210] border-t border-[#C5A880]/20 overflow-hidden"
    >
      {/* Background Ambience & Japanese mist patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="asanoha-bg" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z" fill="none" stroke="#C5A880" strokeWidth="0.5" />
              <path d="M30 0 L30 60 M0 15 L60 45 M0 45 L60 15" stroke="#C5A880" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asanoha-bg)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title & Philosophy Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#C5A880]/20 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#963532] mb-2 font-mono">
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Cartographie Littéraire & Historique</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
              La Route du <span className="gold-gradient-text italic">Tōkaidō</span>
            </h2>
            <p className="text-sm text-[#C5A880]/80 mt-2 max-w-2xl font-light">
              De l’arène de verre de La Défense jusqu’aux sépultures sacrées d’Edo et du Mont Kunō. Cliquez sur chaque relais pour explorer le tracé, les notices historiques et les passages gravés du roman.
            </p>
          </div>

          {/* Desktop/Mobile View Switcher & Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mobile View Toggle */}
            <div className="flex lg:hidden bg-[#1A1613] p-1 rounded-lg border border-[#C5A880]/30 mr-2">
              <button
                onClick={() => setMobileTab('map')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-serif ${
                  mobileTab === 'map' ? 'bg-[#963532] text-[#FAF4EB]' : 'text-[#FAF4EB]/70'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Carte SVG</span>
              </button>
              <button
                onClick={() => setMobileTab('list')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-serif ${
                  mobileTab === 'list' ? 'bg-[#963532] text-[#FAF4EB]' : 'text-[#FAF4EB]/70'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Liste ({TOKAIDO_STATIONS.length})</span>
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 bg-[#1A1613] p-1 rounded-lg border border-[#C5A880]/20 text-xs">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterCategory === 'all' ? 'bg-[#C5A880] text-[#141210] font-bold' : 'text-[#FAF4EB]/70 hover:text-[#FAF4EB]'
                }`}
              >
                Tous (14)
              </button>
              <button
                onClick={() => setFilterCategory('written')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterCategory === 'written' ? 'bg-[#963532] text-[#FAF4EB] font-bold' : 'text-[#FAF4EB]/70 hover:text-[#FAF4EB]'
                }`}
              >
                Passages Écrits
              </button>
              <button
                onClick={() => setFilterCategory('shogun')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterCategory === 'shogun' ? 'bg-[#D4AF37] text-[#141210] font-bold' : 'text-[#FAF4EB]/70 hover:text-[#FAF4EB]'
                }`}
              >
                Sanctuaires Shogun
              </button>
            </div>
          </div>
        </div>

        {/* Main Interactive Grid: Map Canvas + Station Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Canvas: The Panoramic Ukiyo-E Map SVG */}
          <div
            id="tokaido-map-canvas-container"
            className={`lg:col-span-8 rounded-2xl bg-[#171412] border-2 border-[#C5A880]/30 shadow-2xl overflow-hidden relative ${
              mobileTab === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* SVG Panoramique Ukiyo-e */}
            <div className="relative w-full aspect-[16/10] min-h-[380px] sm:min-h-[480px]">
              
              {/* Ukiyo-e Panoramic Vector Landscape */}
              <svg
                viewBox="0 0 1000 620"
                className="w-full h-full select-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Sky & Horizon Gradient */}
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#14110F" />
                    <stop offset="40%" stopColor="#221A15" />
                    <stop offset="70%" stopColor="#301F19" />
                    <stop offset="100%" stopColor="#1A1512" />
                  </linearGradient>

                  {/* Golden Mist Gradient (Suyari-gasumi) */}
                  <linearGradient id="mistGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                    <stop offset="30%" stopColor="#D4AF37" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#C5A880" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </linearGradient>

                  {/* Sea Gradient */}
                  <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#161A1D" />
                    <stop offset="100%" stopColor="#0E1214" />
                  </linearGradient>

                  {/* Path Glow Filter */}
                  <filter id="glowPath" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Sky Background */}
                <rect width="1000" height="620" fill="url(#skyGrad)" />

                {/* Distant Mountain Ridges */}
                <path
                  d="M 0 320 Q 150 260 300 290 T 600 270 T 850 250 T 1000 290 L 1000 620 L 0 620 Z"
                  fill="#1E1713"
                  opacity="0.7"
                />

                {/* Majestic Mount Fuji (Fuji-san) Silhouette */}
                <g transform="translate(480, 70)" id="mount-fuji-vector">
                  {/* Outer Slope */}
                  <polygon
                    points="120,0 20,240 220,240"
                    fill="#2A1E19"
                    stroke="#D4AF37"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />
                  {/* Snowcap / Sacred Summit */}
                  <polygon
                    points="120,0 70,100 95,90 120,110 145,90 170,100"
                    fill="#FAF4EB"
                    opacity="0.3"
                  />
                  {/* Subtle red sunrise aura behind Fuji */}
                  <circle cx="120" cy="80" r="70" fill="#963532" opacity="0.25" filter="url(#glowPath)" />
                </g>

                {/* Sea / Coastal waters at bottom */}
                <path
                  d="M 0 460 Q 250 430 500 480 T 1000 470 L 1000 620 L 0 620 Z"
                  fill="url(#seaGrad)"
                  opacity="0.8"
                />

                {/* Seigaiha wave ripples in water */}
                <g stroke="#C5A880" strokeWidth="0.6" opacity="0.2" fill="none">
                  <path d="M 100 520 A 20 20 0 0 1 140 520 A 20 20 0 0 1 180 520" />
                  <path d="M 120 530 A 20 20 0 0 1 160 530 A 20 20 0 0 1 200 530" />
                  <path d="M 400 540 A 25 25 0 0 1 450 540 A 25 25 0 0 1 500 540" />
                  <path d="M 680 530 A 20 20 0 0 1 720 530 A 20 20 0 0 1 760 530" />
                  <path d="M 700 545 A 20 20 0 0 1 740 545" />
                </g>

                {/* Golden Mist Ribbons (Suyari-gasumi - 霞) */}
                <g fill="url(#mistGold)">
                  {/* Upper ribbon */}
                  <rect x="50" y="90" width="340" height="22" rx="11" />
                  <rect x="180" y="120" width="260" height="16" rx="8" />
                  {/* Middle ribbon over Fuji foot */}
                  <rect x="520" y="240" width="420" height="26" rx="13" />
                  <rect x="420" y="275" width="280" height="18" rx="9" />
                  {/* Lower coastal mist */}
                  <rect x="80" y="420" width="380" height="24" rx="12" />
                  <rect x="620" y="440" width="300" height="20" rx="10" />
                </g>

                {/* Historical Tokaido Road Path Trace (SVG Polyline/Curve) */}
                <path
                  d="M 50 450 Q 120 380 180 220 T 230 180 T 280 100 T 350 280 T 440 340 T 500 385 T 580 420 T 630 435 T 680 450 T 740 405 T 800 340 T 880 310 T 940 270"
                  fill="none"
                  stroke="#963532"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />

                {/* Glowing underlay path */}
                <path
                  d="M 50 450 Q 120 380 180 220 T 230 180 T 280 100 T 350 280 T 440 340 T 500 385 T 580 420 T 630 435 T 680 450 T 740 405 T 800 340 T 880 310 T 940 270"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  opacity="0.9"
                />

                {/* Interactive Station Nodes */}
                {TOKAIDO_STATIONS.map((station, index) => {
                  const isSelected = station.id === selectedStationId;
                  const isWritten = station.isWritten;

                  // Convert x, y percentage to SVG 1000x620 coordinate space
                  const svgX = (station.coordinates.x / 100) * 1000;
                  const svgY = (station.coordinates.y / 100) * 620;

                  return (
                    <g
                      key={station.id}
                      id={`svg-station-node-${station.id}`}
                      transform={`translate(${svgX}, ${svgY})`}
                      onClick={() => handleSelectStation(station)}
                      className="cursor-pointer group"
                    >
                      {/* Selection Aura */}
                      {isSelected && (
                        <circle
                          r="22"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="2"
                          className="animate-ping"
                          opacity="0.4"
                        />
                      )}

                      {/* Outer Ring */}
                      <circle
                        r={isSelected ? 16 : 11}
                        fill={isSelected ? '#963532' : '#1A1613'}
                        stroke={isSelected ? '#D4AF37' : isWritten ? '#C5A880' : '#685949'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="transition-all duration-300 group-hover:scale-125"
                      />

                      {/* Center Pin / Mon */}
                      <circle
                        r={isSelected ? 6 : 4}
                        fill={isWritten ? '#FAF4EB' : '#8A7B6B'}
                      />

                      {/* Station Label */}
                      <text
                        y={svgY > 480 ? -20 : 28}
                        textAnchor="middle"
                        className={`text-[11px] font-serif font-semibold tracking-wider select-none pointer-events-none transition-all ${
                          isSelected
                            ? 'fill-[#D4AF37] font-bold text-[13px]'
                            : 'fill-[#FAF4EB]/80 group-hover:fill-[#D4AF37]'
                        }`}
                      >
                        {station.name.split(' ')[0]}
                      </text>

                      {/* Kanji label */}
                      <text
                        y={svgY > 480 ? -32 : 40}
                        textAnchor="middle"
                        className="text-[9px] font-kanji fill-[#C5A880]/60 select-none pointer-events-none"
                      >
                        {station.japaneseName}
                      </text>
                    </g>
                  );
                })}

                {/* Authentic Ukiyo-e Traditional Cartouche (東海道絵図) */}
                <g transform="translate(40, 40)" id="tokaido-title-cartouche">
                  {/* Cartouche Outer Frame */}
                  <rect
                    x="0"
                    y="0"
                    width="46"
                    height="190"
                    rx="4"
                    fill="#1A1613"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    filter="url(#glowPath)"
                  />
                  <rect
                    x="4"
                    y="4"
                    width="38"
                    height="182"
                    fill="#221C18"
                    stroke="#C5A880"
                    strokeWidth="0.8"
                  />
                  {/* Vertical Title Text */}
                  <text
                    x="23"
                    y="32"
                    textAnchor="middle"
                    className="font-kanji text-[16px] font-bold fill-[#D4AF37] select-none tracking-[0.3em]"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    東海道絵図
                  </text>

                  {/* Red Shogunal Hanko Seal at bottom of Cartouche */}
                  <rect
                    x="11"
                    y="145"
                    width="24"
                    height="24"
                    rx="3"
                    fill="#963532"
                    stroke="#D4AF37"
                    strokeWidth="1"
                  />
                  <text
                    x="23"
                    y="162"
                    textAnchor="middle"
                    className="font-kanji text-[13px] font-bold fill-[#FAF4EB] select-none"
                  >
                    印
                  </text>
                </g>

                {/* Scale & Km 0 Indicator Marker */}
                <g transform="translate(800, 560)">
                  <rect x="0" y="0" width="160" height="34" rx="4" fill="#1A1613" stroke="#C5A880" strokeWidth="0.8" opacity="0.85" />
                  <text x="80" y="16" textAnchor="middle" className="text-[10px] font-serif fill-[#C5A880]">
                    53 Stations • 492 km (Edo-Kyoto)
                  </text>
                  <line x1="20" y1="24" x2="140" y2="24" stroke="#D4AF37" strokeWidth="1.5" />
                  <line x1="20" y1="20" x2="20" y2="28" stroke="#D4AF37" strokeWidth="1.5" />
                  <line x1="140" y1="20" x2="140" y2="28" stroke="#D4AF37" strokeWidth="1.5" />
                </g>

              </svg>

              {/* Float Hint on map */}
              <div className="absolute top-4 right-4 bg-[#141210]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C5A880]/30 text-[11px] text-[#FAF4EB]/80 flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sélectionnez un relais sur la carte</span>
              </div>
            </div>

            {/* Quick Station Step Bar below map */}
            <div className="bg-[#1A1613] p-3 border-t border-[#C5A880]/20 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-mono text-[#C5A880] uppercase tracking-wider shrink-0 px-2">
                Parcours :
              </span>
              {TOKAIDO_STATIONS.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(st)}
                  className={`px-2.5 py-1 rounded text-xs font-serif shrink-0 transition-all ${
                    st.id === selectedStationId
                      ? 'bg-[#963532] text-[#FAF4EB] font-bold border border-[#D4AF37]'
                      : 'bg-[#141210] text-[#FAF4EB]/70 border border-white/5 hover:border-[#C5A880]/40'
                  }`}
                >
                  {i + 1}. {st.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Inspector Panel: Station Detail, Quotes, Modern vs Edo & Ukiyo-e Preview */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* Selected Station Card */}
            <div
              id="station-detail-inspector-card"
              className="p-6 rounded-2xl bg-[#1A1613] border-2 border-[#C5A880]/35 shadow-2xl relative overflow-hidden flex flex-col"
            >
              {/* Background Red Hanko */}
              <div className="absolute top-4 right-4 font-kanji text-5xl text-[#963532]/10 select-none pointer-events-none">
                {selectedStation.japaneseName}
              </div>

              {/* Top Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TokugawaCrest size={22} color="#D4AF37" />
                  <span className="text-xs uppercase tracking-widest font-mono text-[#D4AF37]">
                    Relais {selectedStation.stageNumber}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[#963532]/80 text-[#FAF4EB] font-serif border border-[#963532]">
                  {selectedStation.japaneseName}
                </span>
              </div>

              {/* Station Main Name */}
              <h3 className="font-serif text-2xl font-bold text-[#FAF4EB] mb-1">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-[#C5A880] mb-4 font-light">
                {selectedStation.modernLocation}
              </p>

              {/* Distance & Elevation Tags */}
              <div className="grid grid-cols-2 gap-2 mb-5 text-xs">
                <div className="p-2.5 rounded bg-[#141210] border border-[#C5A880]/15">
                  <div className="text-[10px] text-[#C5A880]/70 uppercase">Distance d'Edo</div>
                  <div className="font-serif font-bold text-[#FAF4EB]">{selectedStation.distanceFromEdo}</div>
                </div>
                <div className="p-2.5 rounded bg-[#141210] border border-[#C5A880]/15">
                  <div className="text-[10px] text-[#C5A880]/70 uppercase">Altitude</div>
                  <div className="font-serif font-bold text-[#FAF4EB]">{selectedStation.elevation || 'Plaine'}</div>
                </div>
              </div>

              {/* Engraved Literary Quote (If available) */}
              {selectedStation.quote ? (
                <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-[#241715] to-[#1E1613] border-l-4 border-[#963532] border border-[#C5A880]/30 shadow-lg relative">
                  <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-serif mb-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Feather className="w-3.5 h-3.5 text-[#963532]" />
                      Passage Gravé du Roman
                    </span>
                    <button
                      onClick={() => handleCopyQuote(selectedStation.quote!)}
                      className="text-[#FAF4EB]/60 hover:text-[#FAF4EB] flex items-center gap-1 transition-colors"
                      title="Copier la citation"
                    >
                      {copiedQuote ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="font-serif italic text-sm text-[#FAF4EB] leading-relaxed">
                    {selectedStation.quote}
                  </p>
                </div>
              ) : (
                <div className="mb-5 p-3 rounded-lg bg-[#141210] border border-white/5 text-xs text-[#FAF4EB]/60 italic">
                  Étape philosophique & historique intégrée au voyage d'Adrien sur le Tōkaidō.
                </div>
              )}

              {/* Historical Context vs. Modern Reality */}
              <div className="space-y-3 mb-6">
                <div className="text-xs">
                  <span className="font-serif font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
                    Héritage Shogunal & Edo (1603) :
                  </span>
                  <p className="text-[#FAF4EB]/80 leading-relaxed font-light">
                    {selectedStation.historicalContext}
                  </p>
                </div>

                <div className="text-xs pt-2 border-t border-white/5">
                  <span className="font-serif font-bold text-[#C5A880] uppercase tracking-wider block mb-0.5">
                    Résonance Contemporaine :
                  </span>
                  <p className="text-[#FAF4EB]/80 leading-relaxed font-light">
                    {selectedStation.modernContext}
                  </p>
                </div>
              </div>

              {/* Ukiyo-e Visualizer Trigger Card */}
              <div
                onClick={() => setActiveUkiyoEStation(selectedStation)}
                className="relative rounded-xl overflow-hidden border border-[#C5A880]/30 group cursor-pointer shadow-lg hover:border-[#D4AF37] transition-all"
              >
                <div className="h-32 w-full overflow-hidden bg-black/60 relative">
                  <img
                    src={selectedStation.ukiyoEImage.imageUrl}
                    alt={selectedStation.ukiyoEImage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/30" />
                  
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-[#FAF4EB]">
                    <div>
                      <div className="font-serif font-bold text-[#FAF4EB] text-sm">
                        {selectedStation.ukiyoEImage.title}
                      </div>
                      <div className="text-[10px] text-[#C5A880]">
                        {selectedStation.ukiyoEImage.artist} ({selectedStation.ukiyoEImage.period})
                      </div>
                    </div>
                    <span className="p-1.5 rounded-full bg-[#963532] text-[#FAF4EB] group-hover:scale-110 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* List view for mobile or secondary navigation */}
            {mobileTab === 'list' && (
              <div className="lg:hidden space-y-3">
                <h4 className="font-serif text-lg font-bold text-[#D4AF37]">
                  Toutes les Étapes du Manuscrit ({filteredStations.length})
                </h4>
                {filteredStations.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStationId(st.id);
                      setMobileTab('map');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      st.id === selectedStationId
                        ? 'bg-[#221B16] border-[#D4AF37]'
                        : 'bg-[#1A1613] border-[#C5A880]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#D4AF37]">
                        Relais {st.stageNumber}
                      </span>
                      <span className="text-xs font-kanji text-[#C5A880]">
                        {st.japaneseName}
                      </span>
                    </div>
                    <div className="font-serif text-base font-bold text-[#FAF4EB] mt-1">
                      {st.name}
                    </div>
                    {st.quote && (
                      <p className="text-xs font-serif italic text-[#FAF4EB]/80 mt-2 line-clamp-2">
                        {st.quote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Ukiyo-E HD Fullscreen Viewer Modal */}
      <UkiyoEModal
        station={activeUkiyoEStation}
        onClose={() => setActiveUkiyoEStation(null)}
      />
    </section>
  );
};

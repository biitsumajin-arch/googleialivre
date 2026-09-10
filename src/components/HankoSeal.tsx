import React from 'react';

interface HankoSealProps {
  name: string;
  size?: number; // size in px
  shape?: 'circle' | 'square' | 'oval';
  className?: string;
  color?: string;
  showBorder?: boolean;
}

export const HankoSeal: React.FC<HankoSealProps> = ({
  name,
  size = 48,
  shape = 'circle',
  className = '',
  color = '#963532',
  showBorder = true,
}) => {
  const cleanName = (name || 'Lecteur').trim();

  // Convert name into 2-4 seal characters or formatted initials/monogram
  const getSealChars = (str: string) => {
    // If Japanese/Kanji characters are present, use the first 2-4 characters
    const hasCjk = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(str);
    if (hasCjk) {
      const chars = Array.from(str).slice(0, 4);
      return {
        isCjk: true,
        chars: chars,
        topRight: chars[0] || '荷',
        bottomRight: chars[1] || '道',
        topLeft: chars[2] || '之',
        bottomLeft: chars[3] || '印',
      };
    }

    // For Western names: split into initials or syllable chunks
    const parts = str.split(/[\s_\-.]+/).filter(Boolean);
    let initials: string[] = [];

    if (parts.length >= 2) {
      initials = [
        parts[0].charAt(0).toUpperCase(),
        parts[1].charAt(0).toUpperCase(),
      ];
      if (parts.length >= 3) {
        initials.push(parts[2].charAt(0).toUpperCase());
      }
    } else {
      // Single word: take up to 3 uppercase letters
      const word = parts[0] || 'L';
      initials = [
        word.charAt(0).toUpperCase(),
        word.charAt(1)?.toUpperCase() || '',
      ].filter(Boolean);
    }

    return {
      isCjk: false,
      chars: initials,
      mainText: initials.slice(0, 3).join(''),
      fullName: str.slice(0, 8),
    };
  };

  const sealData = getSealChars(cleanName);

  // Determine SVG layout based on shape
  const strokeColor = color;
  const fillColor = '#FAF4EB'; // Pale washi background for contrast

  return (
    <div
      className={`inline-flex items-center justify-center select-none relative group ${className}`}
      style={{ width: size, height: size }}
      title={`Sceau Hanko de ${cleanName}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        {/* Seal Outer Boundary */}
        {shape === 'circle' && (
          <>
            <circle
              cx="50"
              cy="50"
              r="46"
              fill={strokeColor}
              fillOpacity="0.12"
              stroke={strokeColor}
              strokeWidth={showBorder ? "4" : "0"}
              strokeDasharray="98 2 98 2"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
          </>
        )}

        {shape === 'square' && (
          <>
            <rect
              x="6"
              y="6"
              width="88"
              height="88"
              rx="10"
              fill={strokeColor}
              fillOpacity="0.12"
              stroke={strokeColor}
              strokeWidth={showBorder ? "4" : "0"}
            />
            <rect
              x="12"
              y="12"
              width="76"
              height="76"
              rx="6"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
          </>
        )}

        {shape === 'oval' && (
          <>
            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="46"
              fill={strokeColor}
              fillOpacity="0.12"
              stroke={strokeColor}
              strokeWidth={showBorder ? "4" : "0"}
            />
            <ellipse
              cx="50"
              cy="50"
              rx="32"
              ry="40"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
          </>
        )}

        {/* Seal Content In Vermilion */}
        {sealData.isCjk ? (
          <g fill={strokeColor} className="font-serif font-bold text-[28px] text-anchor-middle">
            {sealData.chars.length === 2 ? (
              <>
                <text x="50" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontFamily="'Noto Serif JP', serif">
                  {sealData.chars[0]}
                </text>
                <text x="50" y="74" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontFamily="'Noto Serif JP', serif">
                  {sealData.chars[1]}
                </text>
              </>
            ) : (
              // 4 quadrant layout (traditional seal script style)
              <>
                <text x="68" y="38" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontFamily="'Noto Serif JP', serif">
                  {sealData.topRight}
                </text>
                <text x="68" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontFamily="'Noto Serif JP', serif">
                  {sealData.bottomRight}
                </text>
                <text x="32" y="38" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontFamily="'Noto Serif JP', serif">
                  {sealData.topLeft}
                </text>
                <text x="32" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontFamily="'Noto Serif JP', serif">
                  {sealData.bottomLeft}
                </text>
              </>
            )}
          </g>
        ) : (
          <g fill={strokeColor} className="select-none">
            {/* Monogram stylized in Japanese seal frame */}
            <text
              x="50"
              y="45"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Cinzel', 'Cormorant Garamond', serif"
              fontSize={sealData.mainText.length > 2 ? "26" : "32"}
              fontWeight="800"
              letterSpacing="2"
            >
              {sealData.mainText}
            </text>

            {/* Kanji footer mark "印" (Seal) & Tokaido ornament */}
            <line x1="25" y1="62" x2="75" y2="62" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.8" />
            
            <text
              x="50"
              y="75"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Noto Serif JP', serif"
              fontSize="12"
              fontWeight="bold"
              letterSpacing="3"
            >
              荷•印
            </text>
          </g>
        )}

        {/* Authentic red ink spatter / texture dots */}
        <circle cx="28" cy="24" r="1" fill={strokeColor} opacity="0.4" />
        <circle cx="72" cy="76" r="1.2" fill={strokeColor} opacity="0.5" />
        <circle cx="75" cy="30" r="0.8" fill={strokeColor} opacity="0.3" />
      </svg>
    </div>
  );
};

import React from 'react';

interface TokugawaCrestProps {
  className?: string;
  size?: number;
  color?: string;
  secondaryColor?: string;
}

export const TokugawaCrest: React.FC<TokugawaCrestProps> = ({
  className = "w-8 h-8",
  size = 32,
  color = "#D4AF37",
  secondaryColor = "rgba(150, 53, 50, 0.4)"
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      aria-label="Blason Tokugawa (Mitsuba Aoi - 三つ葉葵)"
    >
      {/* Outer Ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
      />
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      
      {/* Central Axis & Three Mallow Leaves (Aoi) */}
      <g fill={color} stroke={secondaryColor} strokeWidth="0.5">
        {/* Top Leaf */}
        <path d="M 50,16 C 42,24 35,33 42,42 C 45,46 50,47 50,47 C 50,47 55,46 58,42 C 65,33 58,24 50,16 Z" />
        <path d="M 50,47 L 50,22" stroke="#141210" strokeWidth="1.5" />
        <path d="M 45,30 L 50,35 L 55,30" stroke="#141210" strokeWidth="1.2" fill="none" />
        <path d="M 43,38 L 50,42 L 57,38" stroke="#141210" strokeWidth="1.2" fill="none" />

        {/* Bottom Right Leaf (Rotated 120 deg) */}
        <g transform="rotate(120 50 50)">
          <path d="M 50,16 C 42,24 35,33 42,42 C 45,46 50,47 50,47 C 50,47 55,46 58,42 C 65,33 58,24 50,16 Z" />
          <path d="M 50,47 L 50,22" stroke="#141210" strokeWidth="1.5" />
          <path d="M 45,30 L 50,35 L 55,30" stroke="#141210" strokeWidth="1.2" fill="none" />
          <path d="M 43,38 L 50,42 L 57,38" stroke="#141210" strokeWidth="1.2" fill="none" />
        </g>

        {/* Bottom Left Leaf (Rotated 240 deg) */}
        <g transform="rotate(240 50 50)">
          <path d="M 50,16 C 42,24 35,33 42,42 C 45,46 50,47 50,47 C 50,47 55,46 58,42 C 65,33 58,24 50,16 Z" />
          <path d="M 50,47 L 50,22" stroke="#141210" strokeWidth="1.5" />
          <path d="M 45,30 L 50,35 L 55,30" stroke="#141210" strokeWidth="1.2" fill="none" />
          <path d="M 43,38 L 50,42 L 57,38" stroke="#141210" strokeWidth="1.2" fill="none" />
        </g>
      </g>

      {/* Center Core Circle */}
      <circle cx="50" cy="50" r="5" fill="#141210" stroke={color} strokeWidth="2" />
    </svg>
  );
};

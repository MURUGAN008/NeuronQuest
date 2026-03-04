import React from 'react';

interface Props {
    className?: string;
}

const RocketLogo: React.FC<Props> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Outer Flame (Orange) */}
        <path d="M 28 35 Q 0 50 28 65 Q 22 50 28 35 Z" fill="#f59e0b" />

        {/* Inner Flame (Yellow) */}
        <path d="M 28 42 Q 10 50 28 58 Q 24 50 28 42 Z" fill="#fde047" />

        {/* Top Fin */}
        <path d="M 45 30 Q 30 0 15 15 Q 25 25 32 35 Z" fill="#ef4444" />
        {/* Top Fin Highlight */}
        <path d="M 40 28 Q 28 8 18 16 Q 25 22 28 28 Z" fill="#f87171" />

        {/* Bottom Fin */}
        <path d="M 45 70 Q 30 100 15 85 Q 25 75 32 65 Z" fill="#dc2626" />

        {/* Center Fin (Base) */}
        <path d="M 35 50 L 15 58 L 15 42 Z" fill="#dc2626" />

        {/* Body Base (Lighter, covers whole area) */}
        <path d="M 30 25 Q 60 25 90 50 Q 60 75 30 75 Q 25 50 30 25 Z" fill="#ffffff" />

        {/* Body Shadow (Darker, bottom half only for 3D split) */}
        <path d="M 30 50 L 90 50 Q 60 75 30 75 Q 27.5 62.5 30 50 Z" fill="#e5e7eb" />

        {/* Nose Cone Base (Lighter red) */}
        <path d="M 70 34 Q 82 40 90 50 Q 82 60 70 66 Q 66 50 70 34 Z" fill="#ef4444" />

        {/* Nose Cone Shadow (Darker red, bottom half only) */}
        <path d="M 70 50 L 90 50 Q 82 60 70 66 Q 68 58 70 50 Z" fill="#dc2626" />

        {/* Window Outer Ring */}
        <circle cx="55" cy="50" r="14" fill="#374151" />

        {/* Window Glass */}
        <circle cx="55" cy="50" r="10" fill="#a5f3fc" />

        {/* Window Reflections */}
        <circle cx="51" cy="46" r="3" fill="#ffffff" />
        <circle cx="57" cy="43" r="1.5" fill="#ffffff" />
    </svg>
);

export default RocketLogo;

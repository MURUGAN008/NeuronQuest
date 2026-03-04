import React from 'react';

interface Props {
    className?: string;
}

const PlanetLogo: React.FC<Props> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Planet Base */}
        <circle cx="50" cy="50" r="30" fill="#ea580c" />
        <circle cx="50" cy="50" r="30" fill="url(#mars-shade)" opacity="0.4" />

        {/* Atmosphere/Glow */}
        <circle cx="50" cy="50" r="32" stroke="#fb923c" strokeWidth="2" opacity="0.5" />

        {/* Rings (Dust rings) */}
        <ellipse cx="50" cy="50" rx="48" ry="10" transform="rotate(-20 50 50)" stroke="#fdba74" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        <path d="M11 36 C 25 55, 60 70, 89 64" fill="none" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

        {/* Craters */}
        <circle cx="40" cy="40" r="5" fill="#9a3412" opacity="0.4" />
        <circle cx="60" cy="55" r="7" fill="#9a3412" opacity="0.4" />
        <circle cx="55" cy="35" r="3" fill="#9a3412" opacity="0.4" />
        <circle cx="35" cy="58" r="4" fill="#9a3412" opacity="0.5" />

        <defs>
            <radialGradient id="mars-shade" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35 35) rotate(45) scale(60)">
                <stop stopColor="#ffffff" stopOpacity="0" />
                <stop offset="1" stopColor="#7c2d12" />
            </radialGradient>
        </defs>
    </svg>
);

export default PlanetLogo;

import React from 'react';

interface Props {
    className?: string;
}

const PlanetLogo: React.FC<Props> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Planet Base */}
        <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="4" />
        {/* Rings */}
        <ellipse cx="50" cy="50" rx="45" ry="12" transform="rotate(-20 50 50)" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M11 36 C 25 55, 60 70, 89 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        {/* Craters */}
        <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="60" cy="60" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="55" cy="35" r="3" fill="currentColor" opacity="0.3" />
    </svg>
);

export default PlanetLogo;

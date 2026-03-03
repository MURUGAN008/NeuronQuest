import React from 'react';

interface Props {
    className?: string;
}

const ChevronTurnLeft: React.FC<Props> = ({ className }) => (
    // Turn Left: Enters from BOTTOM (x=50), turns to LEFT (y=50).
    // Default orientation (0 deg rotation) means h=0 (traveling UP) changes to h=3 (traveling LEFT)
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Bottom pointing UP */}
        <path d="M35 90 L50 75 L65 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 70 L50 55 L65 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Left pointing LEFT */}
        <path d="M45 35 L30 50 L45 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 35 L10 50 L25 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ChevronTurnLeft;

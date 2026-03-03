import React from 'react';

interface Props {
    className?: string;
}

const ChevronTurnRight: React.FC<Props> = ({ className }) => (
    // Turn Right: Enters from BOTTOM (x=50), turns to RIGHT (y=50).
    // Default orientation (0 deg rotation) means h=0 (traveling UP) changes to h=1 (traveling RIGHT)
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Bottom pointing UP */}
        <path d="M35 90 L50 75 L65 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 70 L50 55 L65 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Right pointing RIGHT */}
        <path d="M55 35 L70 50 L55 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M75 35 L90 50 L75 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ChevronTurnRight;

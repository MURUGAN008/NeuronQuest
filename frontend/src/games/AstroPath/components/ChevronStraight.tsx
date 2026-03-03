import React from 'react';

interface Props {
    className?: string;
}

const ChevronStraight: React.FC<Props> = ({ className }) => (
    // Default orientation is pointing UP (0 degrees)
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Top chevron */}
        <path d="M25 45 L50 20 L75 45" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        {/* Middle chevron */}
        <path d="M25 65 L50 40 L75 65" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom chevron */}
        <path d="M25 85 L50 60 L75 85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ChevronStraight;

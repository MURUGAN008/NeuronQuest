import React from 'react';

interface Props {
    className?: string;
}

const RocketLogo: React.FC<Props> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Flame */}
        <path d="M10 50 C2 55, 2 45, 10 50 Z" fill="#ef4444" />
        <path d="M15 50 C5 58, 5 42, 15 50 Z" fill="#f97316" />
        {/* Fins */}
        <path d="M20 70 L10 90 L30 70 Z" fill="currentColor" />
        <path d="M20 30 L10 10 L30 30 Z" fill="currentColor" />
        {/* Body */}
        <path d="M20 30 C50 30, 80 40, 90 50 C80 60, 50 70, 20 70 C20 60, 15 60, 15 50 C15 40, 20 40, 20 30 Z" fill="white" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        {/* Window */}
        <circle cx="60" cy="50" r="6" fill="#0f172a" />
        <circle cx="62" cy="48" r="2" fill="white" />
    </svg>
);

export default RocketLogo;

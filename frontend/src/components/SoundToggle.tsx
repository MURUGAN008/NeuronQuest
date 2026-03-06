import { useSoundEnabled } from '../context/SoundContext';

const SoundToggle = () => {
    const { soundEnabled, toggleSound } = useSoundEnabled();

    return (
        <button
            onClick={toggleSound}
            className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full glass-panel glass-panel-hover flex items-center justify-center transition-all duration-300 group"
            title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
            {soundEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-600">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-rose-500">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            )}
        </button>
    );
};

export default SoundToggle;

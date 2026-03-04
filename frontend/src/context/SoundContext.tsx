import { createContext, useContext, useState, type ReactNode } from 'react';

interface SoundContextType {
    soundEnabled: boolean;
    toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType>({
    soundEnabled: true,
    toggleSound: () => { },
});

export const useSoundEnabled = () => useContext(SoundContext);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);

    const toggleSound = () => {
        setSoundEnabled(prev => {
            if (prev && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            return !prev;
        });
    };

    return (
        <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
            {children}
        </SoundContext.Provider>
    );
};

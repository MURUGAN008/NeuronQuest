import failSoundFile from '../assets/fahhhhh.mp3';

let failAudio: HTMLAudioElement | null = null;

export const playFailSound = (soundEnabled: boolean) => {
    if (!soundEnabled) return;
    if (!failAudio) {
        failAudio = new Audio(failSoundFile);
    }
    failAudio.currentTime = 0;
    failAudio.volume = 0.6;
    failAudio.play().catch(() => { });
};

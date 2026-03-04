export type Trial = {
    position: number; // 0-8 for the 3x3 grid
    letter: string;   // A-Z auditory stimuli
};

export type MatchStats = {
    visualHits: number;
    visualMisses: number;
    visualFalseAlarms: number;
    audioHits: number;
    audioMisses: number;
    audioFalseAlarms: number;
    totalVisualMatches: number;
    totalAudioMatches: number;
};

// Standard consonants used in N-Back to avoid vowel confusion
const LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

/**
 * Generates an N-Back sequence ensuring a minimum number of visual, audio, 
 * and dual matches to prevent the player from having 'empty' rounds.
 */
export function generateNBackSequence(n: number, totalTrials: number = 24): Trial[] {
    const sequence: Trial[] = [];

    // We typically want ~20-30% of trials to be targets (matches)
    const targetMatchCount = Math.floor(totalTrials * 0.3);

    // Predetermine which trials will be visual matches, audio matches, or both (dual)
    // We can only have matches starting from index 'n'
    const availableIndices = Array.from({ length: totalTrials - n }, (_, i) => i + n);

    // Shuffle available indices to pick random match positions
    for (let i = availableIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }

    const visualMatchIndices = new Set(availableIndices.slice(0, targetMatchCount));
    const audioMatchIndices = new Set(availableIndices.slice(Math.floor(targetMatchCount / 2), targetMatchCount + Math.floor(targetMatchCount / 2)));

    for (let i = 0; i < totalTrials; i++) {
        let position: number;
        let letter: string;

        if (visualMatchIndices.has(i)) {
            // It's a visual match, copy position from 'n' steps ago
            position = sequence[i - n].position;
        } else {
            // Random position, ensuring it's NOT an accidental match 
            // (unless we are forced to by random chance, but we explicitly try to avoid it)
            do {
                position = Math.floor(Math.random() * 9);
            } while (i >= n && position === sequence[i - n].position);
        }

        if (audioMatchIndices.has(i)) {
            // It's an audio match, copy letter from 'n' steps ago
            letter = sequence[i - n].letter;
        } else {
            // Random letter, ensuring it's NOT an accidental match
            do {
                letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
            } while (i >= n && letter === sequence[i - n].letter);
        }

        sequence.push({ position, letter });
    }

    return sequence;
}

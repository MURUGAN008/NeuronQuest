export type SequenceMode = 'NUMBERS' | 'LETTERS' | 'MIXED';

const NUMBERS = '0123456789';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MIXED = NUMBERS + LETTERS;

export const generateSequence = (length: number, mode: SequenceMode): string[] => {
    const sequence: string[] = [];
    let pool = '';

    switch (mode) {
        case 'NUMBERS':
            pool = NUMBERS;
            break;
        case 'LETTERS':
            pool = LETTERS;
            break;
        case 'MIXED':
            pool = MIXED;
            break;
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        sequence.push(pool[randomIndex]);
    }

    return sequence;
};

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateSequence, type SequenceMode } from './SequenceEngine';
import { useSoundEnabled } from '../../context/SoundContext';
import { playFailSound } from '../../utils/sounds';
import SEO from '../../components/SEO';

const INITIAL_SEQUENCE_LENGTH = 3;
const DISPLAY_DURATION_MS = 1000; // How long each item shows
const PAUSE_DURATION_MS = 200;    // Blank screen between items

type GameState = 'START' | 'START_NEXT' | 'SHOWING' | 'WAITING_INPUT' | 'RESULT' | 'GAME_OVER';

const SequenceMemory = () => {
    const { soundEnabled } = useSoundEnabled();
    const [gameState, setGameState] = useState<GameState>('START');
    const [mode, setMode] = useState<SequenceMode>('NUMBERS');

    // Level & Stats
    const [level, setLevel] = useState<number>(1);
    const [score, setScore] = useState<number>(0);

    // Sequence State
    const [sequence, setSequence] = useState<string[]>([]);
    const [displayIndex, setDisplayIndex] = useState<number>(-1); // -1 means blank
    const [userInputs, setUserInputs] = useState<string[]>([]);

    // Animation & Input Refs
    const displayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // ============================================
    // Game Loop Methods
    // ============================================

    const startRound = useCallback((overrideMode?: SequenceMode) => {
        const activeMode = overrideMode || mode;
        const length = INITIAL_SEQUENCE_LENGTH + (level - 1);
        const newSeq = generateSequence(length, activeMode);
        setSequence(newSeq);
        setUserInputs([]);
        setDisplayIndex(-1);
        setGameState('SHOWING');
    }, [level, mode]);

    const handleRestart = () => {
        setLevel(1);
        setScore(0);
        setGameState('START');
    };

    // Auto-advance to next level
    useEffect(() => {
        if (gameState === 'START_NEXT') {
            startRound();
        }
    }, [gameState, startRound]);

    // ============================================
    // Flashing Logic
    // ============================================

    useEffect(() => {
        if (gameState === 'SHOWING') {
            let index = 0;

            const showNext = () => {
                if (index < sequence.length) {
                    // Show item
                    setDisplayIndex(index);

                    displayTimer.current = setTimeout(() => {
                        // Hide item briefly
                        setDisplayIndex(-1);
                        index++;

                        displayTimer.current = setTimeout(showNext, PAUSE_DURATION_MS);
                    }, DISPLAY_DURATION_MS);
                } else {
                    // Sequence finished showing
                    setDisplayIndex(-1);
                    setGameState('WAITING_INPUT');
                }
            };

            // Start flashing after short delay
            displayTimer.current = setTimeout(showNext, 500);

            return () => {
                if (displayTimer.current) clearTimeout(displayTimer.current);
            };
        }
    }, [gameState, sequence]);

    // ============================================
    // Input Logic
    // ============================================

    // Handle typing into a specific box (OTP style)
    const handleBoxInput = (index: number, val: string) => {
        if (gameState !== 'WAITING_INPUT') return;

        // Take only the last character entered if they pasted or typed fast
        const char = val.slice(-1).toUpperCase();

        // Validate character based on mode
        const isNumber = /^[0-9]$/.test(char);
        const isLetter = /^[A-Z]$/.test(char);

        let isValid = false;
        if (mode === 'NUMBERS' && isNumber) isValid = true;
        if (mode === 'LETTERS' && isLetter) isValid = true;
        if (mode === 'MIXED' && (isNumber || isLetter)) isValid = true;

        if (isValid) {
            const newInputs = [...userInputs];
            // Ensure array is long enough if they click ahead
            while (newInputs.length <= index) newInputs.push('');
            newInputs[index] = char;
            setUserInputs(newInputs);

            // Auto-advance focus to next empty box, or next box in line
            if (index < sequence.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            // Check if all boxes are filled
            if (newInputs.length === sequence.length && newInputs.every(c => c !== '')) {
                // Short delay so they can see the last letter typed before evaluating
                setTimeout(() => setGameState('RESULT'), 200);
            }
        } else if (val === '') {
            // Handle clearing a box
            const newInputs = [...userInputs];
            newInputs[index] = '';
            setUserInputs(newInputs);
        }
    };

    const handleBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !userInputs[index] && index > 0) {
            // If the box is already empty and they hit backspace, focus the previous box
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < sequence.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Auto-focus the first box when it becomes the user's turn
    useEffect(() => {
        if (gameState === 'WAITING_INPUT' && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [gameState]);

    // ============================================
    // Result Evaluation
    // ============================================

    const evaluateRound = () => {
        // Calculate correct entries for this round
        let roundCorrect = 0;
        for (let i = 0; i < sequence.length; i++) {
            if (userInputs[i] === sequence[i]) roundCorrect++;
        }

        // Add to score based on mode multiplier and speed (simplified speed bonus for now)
        const modeMultiplier = mode === 'NUMBERS' ? 1 : mode === 'LETTERS' ? 1.5 : 2;
        const roundScore = Math.floor((roundCorrect * 10) * modeMultiplier);

        // Calculate Accuracy for CURRENT round
        const roundAcc = Math.round((roundCorrect / sequence.length) * 100);

        if (roundAcc < 70) {
            setGameState('GAME_OVER');
            playFailSound(soundEnabled);
        } else {
            // Success, add score and proceed to next level automatically
            setScore(prev => prev + roundScore);
            setLevel(prev => prev + 1);
            // We need a slight delay to let the state update before generating the new sequence,
            // or we can just trigger it via useEffect. Setting to SHOWING here is fine, but StartRound Needs to run.
            // A common pattern is to just call startRound directly after updating level, but level update is async.
            // So we can set a flag or just use a new game state 'PREP_NEXT_LEVEL'.
            // For simplicity, we'll just set it to 'START' to use our Next Level button, or auto-fire it.
            // Let's create an auto-advance state.
            setGameState('START_NEXT');
        }
    };

    // ============================================
    // Renders
    // ============================================

    return (
        <main className="min-h-screen bg-transparent flex flex-col items-center pt-20 pb-10 px-4">
            <SEO title="Sequence Memory | CortexPlay" description="Test your cognitive memory limits with Sequence Memory." />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-gradient-cyan neon-text-cyan drop-shadow-lg">Sequence Memory</h1>

            {(gameState !== 'START' && gameState !== 'GAME_OVER') && (
                <header className="mb-8 flex flex-col items-center">
                    <p className="text-xl text-slate-300 font-medium mb-1">Level {level}</p>
                    <p className="text-lg font-bold text-cyan-400 mb-3 tracking-wide neon-text-cyan">SCORE: {score}</p>
                </header>
            )}

            {gameState === 'START' && (
                <div className="glass-panel p-12 rounded-3xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                    <h2 className="text-3xl font-bold text-slate-100 mb-6 drop-shadow-sm">Choose Mode</h2>
                    <div className="flex flex-col gap-4 mb-8">
                        <button
                            onClick={() => {
                                setMode('NUMBERS');
                                startRound('NUMBERS');
                            }}
                            className={`px-6 py-4 rounded-xl font-bold transition-all border-2 ${mode === 'NUMBERS' ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/50 transform scale-105 neon-glow-cyan' : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:border-cyan-400 hover:bg-slate-800'}`}
                        >
                            Numbers Only (0-9)
                        </button>
                        <button
                            onClick={() => {
                                setMode('LETTERS');
                                startRound('LETTERS');
                            }}
                            className={`px-6 py-4 rounded-xl font-bold transition-all border-2 ${mode === 'LETTERS' ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50 transform scale-105 neon-glow-purple' : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:border-purple-400 hover:bg-slate-800'}`}
                        >
                            Letters Only (A-Z)
                        </button>
                        <button
                            onClick={() => {
                                setMode('MIXED');
                                startRound('MIXED');
                            }}
                            className={`px-6 py-4 rounded-xl font-bold transition-all border-2 ${mode === 'MIXED' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/50 transform scale-105 neon-glow-emerald' : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:border-emerald-400 hover:bg-slate-800'}`}
                        >
                            Mixed (Hard Mode)
                        </button>
                    </div>

                    <a href="/" className="bg-slate-800 text-slate-300 px-8 py-3 mt-4 rounded-xl font-bold hover:bg-slate-700 transition-colors block w-full border border-slate-700">Back to Games</a>
                </div>
            )}

            {gameState === 'SHOWING' && (
                <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm">
                    <h3 className="text-xl text-cyan-400 mb-8 animate-pulse font-medium tracking-wide">Memorize the sequence...</h3>
                    <div className="w-48 h-48 glass-panel rounded-3xl flex items-center justify-center transform scale-105 shadow-2xl shadow-cyan-900/20">
                        {displayIndex !== -1 ? (
                            <span className="text-8xl font-black text-slate-100 animate-in zoom-in duration-100 drop-shadow-lg neon-text-cyan">
                                {sequence[displayIndex]}
                            </span>
                        ) : null}
                    </div>
                </div>
            )}

            {gameState === 'WAITING_INPUT' && (
                <div className="flex flex-col items-center flex-1 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300 relative">
                    <h3 className="text-2xl text-cyan-400 font-bold mb-8 text-center max-w-[280px] drop-shadow-sm neon-text-cyan">Your Turn! Enter the sequence.</h3>

                    {/* OTP Style Input Display Area */}
                    <div className="glass-panel p-6 rounded-3xl mb-8 w-full min-h-[100px] flex items-center justify-center flex-wrap gap-3">
                        {Array.from({ length: sequence.length }).map((_, i) => (
                            <input
                                key={i}
                                ref={(el) => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode={mode === 'NUMBERS' ? 'numeric' : 'text'}
                                maxLength={1}
                                value={userInputs[i] || ''}
                                onChange={(e) => handleBoxInput(i, e.target.value)}
                                onKeyDown={(e) => handleBoxKeyDown(i, e)}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                className={`w-12 h-14 rounded-xl text-center text-2xl font-bold border-b-4 outline-none transition-all duration-200
                                    focus:border-cyan-400 focus:bg-cyan-900/40 focus:-translate-y-1 focus:neon-glow-cyan text-slate-100
                                    ${userInputs[i] ? 'border-cyan-400 bg-cyan-900/50 neon-glow-cyan' : 'border-slate-600 bg-slate-800/50'}`}
                            />
                        ))}
                    </div>

                    <p className="text-slate-400 text-sm mb-6 text-center max-w-[280px] font-medium">Type to enter. You can click on any box to change it.</p>
                </div>
            )}

            {gameState === 'RESULT' && (
                <div className="glass-panel p-12 rounded-3xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300 mt-10">
                    <h2 className="text-3xl font-bold text-slate-100 mb-6 drop-shadow-md">Round Summary</h2>

                    <div className="flex flex-col gap-4 mb-8 text-lg text-slate-300 font-medium">
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                            <span>Target:</span>
                            <span className="font-mono text-cyan-400 tracking-widest font-bold neon-text-cyan">{sequence.join(' ')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                            <span>You Typed:</span>
                            <span className="font-mono tracking-widest font-bold flex gap-2">
                                {userInputs.map((char, i) => (
                                    <span key={i} className={char === sequence[i] ? 'text-emerald-400 drop-shadow-md' : 'text-rose-400 drop-shadow-md'}>
                                        {char}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>

                    <button onClick={evaluateRound} className="bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/50 w-full block transform hover:-translate-y-1">
                        Continue
                    </button>
                </div>
            )}

            {gameState === 'GAME_OVER' && (() => {
                let roundCorrect = 0;
                for (let i = 0; i < sequence.length; i++) {
                    if (userInputs[i] === sequence[i]) roundCorrect++;
                }
                const roundAcc = Math.round((roundCorrect / sequence.length) * 100);

                return (
                    <div className="glass-panel border-rose-900/50 p-12 rounded-3xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                        <h2 className="text-4xl font-bold text-rose-500 mb-4 drop-shadow-md">You Lost!</h2>
                        <p className="text-xl text-slate-100 font-bold mb-2">Final Score: {score}</p>
                        <p className="text-lg text-slate-300 font-medium mb-1">Levels Survived: {level - 1}</p>
                        <p className="text-lg text-rose-400 font-bold mb-8">Level Accuracy: {roundAcc}% (Need 70%)</p>

                        <button onClick={handleRestart} className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-colors shadow-lg hover:shadow-cyan-500/50 w-full block mb-3">Play Again</button>
                        <a href="/" className="bg-slate-800 text-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors block w-full border border-slate-700">Back to Games</a>
                    </div>
                );
            })()}

        </main>
    );
};

export default SequenceMemory;

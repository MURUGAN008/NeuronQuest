import { useState, useEffect, useCallback, useRef } from 'react';
import { generateNBackSequence, type Trial } from './NBackEngine';
import { useSoundEnabled } from '../../context/SoundContext';
import { playFailSound } from '../../utils/sounds';

const TRIAL_DURATION = 3000;
const STIMULUS_DURATION = 2000;

type TrialResult = {
    visualIsTarget: boolean;
    audioIsTarget: boolean;
    playerPressedVisual: boolean;
    playerPressedAudio: boolean;
};

const DualNBack = () => {
    const { soundEnabled } = useSoundEnabled();
    const [nBackLevel, setNBackLevel] = useState<number>(1);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
    const [sequence, setSequence] = useState<Trial[]>([]);
    const [currentTrialIndex, setCurrentTrialIndex] = useState<number>(0);
    const [isStimulusVisible, setIsStimulusVisible] = useState<boolean>(false);

    // Feedback colors for buttons
    const [visualFeedback, setVisualFeedback] = useState<'neutral' | 'hit' | 'false-alarm'>('neutral');
    const [audioFeedback, setAudioFeedback] = useState<'neutral' | 'hit' | 'false-alarm'>('neutral');

    // Track ALL trial results in a ref (not state, to avoid closure issues)
    const trialResultsRef = useRef<TrialResult[]>([]);

    // Refs for button press tracking (survives across renders without stale closures) 
    const pressedVisualRef = useRef(false);
    const pressedAudioRef = useRef(false);

    // Refs for game context needed inside timeouts
    const sequenceRef = useRef<Trial[]>([]);
    const nBackLevelRef = useRef(1);
    const currentTrialIndexRef = useRef(0);

    // Keep refs in sync
    sequenceRef.current = sequence;
    nBackLevelRef.current = nBackLevel;
    currentTrialIndexRef.current = currentTrialIndex;

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stimulusHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Speech
    const speakLetter = (letter: string) => {
        if (!soundEnabled) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(letter);
            utterance.rate = 1.2;
            utterance.pitch = 1.0;
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(v => v.lang.startsWith('en-'));
            if (englishVoice) utterance.voice = englishVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Start Round
    const startRound = useCallback(() => {
        const total = 20 + nBackLevel;
        const newSequence = generateNBackSequence(nBackLevel, total);
        setSequence(newSequence);
        sequenceRef.current = newSequence;
        setCurrentTrialIndex(0);
        currentTrialIndexRef.current = 0;
        trialResultsRef.current = [];
        pressedVisualRef.current = false;
        pressedAudioRef.current = false;
        setVisualFeedback('neutral');
        setAudioFeedback('neutral');
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setGameState('PLAYING');
    }, [nBackLevel]);

    // Main Game Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const idx = currentTrialIndex;
        const seq = sequenceRef.current;

        if (idx >= seq.length) {
            setGameState('RESULT');
            return;
        }

        // Show stimulus
        const trial = seq[idx];
        setIsStimulusVisible(true);
        speakLetter(trial.letter);

        // Hide stimulus after STIMULUS_DURATION
        stimulusHideTimerRef.current = setTimeout(() => {
            setIsStimulusVisible(false);
        }, STIMULUS_DURATION);

        // After TRIAL_DURATION, record result and move to next trial
        timerRef.current = setTimeout(() => {
            const n = nBackLevelRef.current;
            const curIdx = currentTrialIndexRef.current;
            const curSeq = sequenceRef.current;

            // Determine if this trial was actually a match
            let visualIsTarget = false;
            let audioIsTarget = false;
            if (curIdx >= n) {
                visualIsTarget = curSeq[curIdx].position === curSeq[curIdx - n].position;
                audioIsTarget = curSeq[curIdx].letter === curSeq[curIdx - n].letter;
            }

            // Record what the player did
            trialResultsRef.current.push({
                visualIsTarget,
                audioIsTarget,
                playerPressedVisual: pressedVisualRef.current,
                playerPressedAudio: pressedAudioRef.current,
            });

            // Reset for next trial
            pressedVisualRef.current = false;
            pressedAudioRef.current = false;
            setVisualFeedback('neutral');
            setAudioFeedback('neutral');
            setCurrentTrialIndex(prev => prev + 1);
        }, TRIAL_DURATION);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (stimulusHideTimerRef.current) clearTimeout(stimulusHideTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, currentTrialIndex]);

    // Click Handlers — score feedback happens here, immediately
    const handleVisualClick = () => {
        if (gameState !== 'PLAYING' || pressedVisualRef.current) return;
        pressedVisualRef.current = true;
        const idx = currentTrialIndexRef.current;
        const n = nBackLevelRef.current;
        const seq = sequenceRef.current;
        if (idx >= n) {
            const isMatch = seq[idx].position === seq[idx - n].position;
            setVisualFeedback(isMatch ? 'hit' : 'false-alarm');
        }
    };

    const handleAudioClick = () => {
        if (gameState !== 'PLAYING' || pressedAudioRef.current) return;
        pressedAudioRef.current = true;
        const idx = currentTrialIndexRef.current;
        const n = nBackLevelRef.current;
        const seq = sequenceRef.current;
        if (idx >= n) {
            const isMatch = seq[idx].letter === seq[idx - n].letter;
            setAudioFeedback(isMatch ? 'hit' : 'false-alarm');
        }
    };

    // Keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState === 'PLAYING') {
                if (e.key.toLowerCase() === 'a') handleVisualClick();
                if (e.key.toLowerCase() === 'l') handleAudioClick();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    // Compute final stats from trialResults
    const computeStats = () => {
        const results = trialResultsRef.current;
        let vHits = 0, vMisses = 0, vFA = 0, vTargets = 0;
        let aHits = 0, aMisses = 0, aFA = 0, aTargets = 0;

        for (const r of results) {
            // Visual
            if (r.visualIsTarget) {
                vTargets++;
                if (r.playerPressedVisual) vHits++;
                else vMisses++;
            } else {
                if (r.playerPressedVisual) vFA++;
            }
            // Audio
            if (r.audioIsTarget) {
                aTargets++;
                if (r.playerPressedAudio) aHits++;
                else aMisses++;
            } else {
                if (r.playerPressedAudio) aFA++;
            }
        }

        const visualAcc = vTargets > 0 ? Math.max(0, ((vHits) / vTargets) * 100) : 100;
        const audioAcc = aTargets > 0 ? Math.max(0, ((aHits) / aTargets) * 100) : 100;
        const avgAcc = (visualAcc + audioAcc) / 2;

        return { vHits, vMisses, vFA, vTargets, aHits, aMisses, aFA, aTargets, visualAcc, audioAcc, avgAcc };
    };

    // Next Round
    const nextRound = () => {
        const { avgAcc } = computeStats();
        if (avgAcc >= 70) {
            setNBackLevel(prev => prev + 1);
        } else if (avgAcc < 50 && nBackLevel > 1) {
            setNBackLevel(prev => prev - 1);
            playFailSound(soundEnabled);
        }
        // 50-69% stays at current level
        setGameState('START');
    };

    // --- Renders ---
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center pt-8 pb-10 px-4 font-sans select-none overflow-x-hidden">
            <h1 className="text-4xl md:text-5xl font-black mb-2 text-indigo-600 tracking-tight">Dual N-Back</h1>
            <p className="text-slate-500 mb-8 max-w-md text-center">
                Mental training to expand fluid intelligence and working memory capacity.
            </p>

            {gameState === 'START' && (
                <div className="flex flex-col items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full">
                    <h2 className="text-3xl font-black text-slate-800 mb-4">Level {nBackLevel}</h2>
                    <p className="text-slate-600 mb-6 tracking-wide leading-relaxed">
                        The grid will flash blue and a voice will speak a letter every 2.5 seconds.<br /><br />
                        Press <strong>Visual Match (A)</strong> if the square matches the position from {nBackLevel} step{nBackLevel > 1 ? 's' : ''} ago.<br />
                        Press <strong>Audio Match (L)</strong> if the spoken letter matches the one from {nBackLevel} step{nBackLevel > 1 ? 's' : ''} ago.
                    </p>

                    {/* Progression Rules */}
                    <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-8 text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 text-center">🏆 How Scoring Works</h3>

                        <p className="text-sm text-slate-600 mb-4 text-center">
                            Your <strong>Overall Accuracy</strong> = average of Visual + Audio hit rates.<br />
                            This decides if you level up, stay, or reset.
                        </p>

                        {/* Visual Bar */}
                        <div className="w-full h-9 rounded-full bg-slate-200 relative overflow-hidden mb-2 flex">
                            <div className="h-full bg-rose-400 flex items-center justify-center text-[11px] font-bold text-white" style={{ width: '50%' }}>
                                🔄 Drop 1 Level
                            </div>
                            <div className="h-full bg-amber-400 flex items-center justify-center text-[11px] font-bold text-white" style={{ width: '20%' }}>
                                ↔ Stay
                            </div>
                            <div className="h-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-white" style={{ width: '30%' }}>
                                ↑ Next Level
                            </div>
                        </div>

                        {/* Percentage Labels */}
                        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-5 px-1">
                            <span>0%</span>
                            <span className="text-rose-500">50%</span>
                            <span className="text-emerald-600">70%</span>
                            <span>100%</span>
                        </div>

                        {/* Rules list */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2.5">
                                <span className="w-3 h-3 mt-0.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <span className="text-slate-700">
                                    <strong>≥ 70%</strong> → Level up! You move to <strong>{nBackLevel + 1}-Back</strong> (no limit — keep climbing!)
                                </span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="w-3 h-3 mt-0.5 rounded-full bg-amber-400 shrink-0"></span>
                                <span className="text-slate-700">
                                    <strong>50%–69%</strong> → Stay at <strong>{nBackLevel}-Back</strong>. Practice makes perfect.
                                </span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="w-3 h-3 mt-0.5 rounded-full bg-rose-400 shrink-0"></span>
                                <span className="text-slate-700">
                                    <strong>Below 50%</strong> → Drop to <strong>{Math.max(1, nBackLevel - 1)}-Back</strong> (go back one level).
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startRound}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:-translate-y-1 mb-4"
                    >
                        Start Round
                    </button>
                    <a href="/" className="w-full block bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-8 py-3 rounded-xl transition-colors text-center mt-2">
                        ← Back to Hub
                    </a>
                </div>
            )}

            {gameState === 'PLAYING' && (
                <div className="flex flex-col items-center w-full max-w-lg">
                    <div className="flex w-full justify-between items-center bg-white shadow-sm p-4 rounded-2xl border border-slate-200 mb-8">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Target</span>
                            <span className="text-2xl font-black text-indigo-600">{nBackLevel}-Back</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Progress</span>
                            <span className="text-2xl font-bold text-slate-800">{currentTrialIndex + 1} / {sequence.length}</span>
                        </div>
                    </div>

                    {/* 3x3 Grid — fixed size */}
                    <div className="grid grid-cols-3 grid-rows-3 gap-3 p-5 bg-white rounded-3xl shadow-lg border border-slate-100 mb-10 w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => {
                            const isFlashed = isStimulusVisible && sequence[currentTrialIndex]?.position === index;
                            const letter = isFlashed ? sequence[currentTrialIndex]?.letter : null;
                            return (
                                <div
                                    key={index}
                                    className={`rounded-2xl transition-colors duration-150 border-2 flex items-center justify-center
                                        ${isFlashed ? 'bg-indigo-500 border-indigo-600 shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)]' : 'bg-slate-50 border-slate-200'}
                                    `}
                                >
                                    {letter && (
                                        <span className="text-4xl md:text-5xl font-black text-white drop-shadow-md">
                                            {letter}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full gap-4 px-4">
                        <button
                            onClick={handleVisualClick}
                            className={`flex flex-col items-center justify-center flex-1 py-4 md:py-6 rounded-2xl font-bold text-lg transition-all border-b-4
                                ${visualFeedback === 'hit'
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-700 scale-[0.98]' :
                                    visualFeedback === 'false-alarm'
                                        ? 'bg-rose-100 border-rose-400 text-rose-700 scale-[0.98]' :
                                        'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow active:scale-[0.98]'
                                }
                            `}
                        >
                            <span className="mb-1">Visual Match</span>
                            <span className="text-sm font-semibold text-slate-400 border border-slate-200 rounded px-2 bg-slate-50">(A)</span>
                        </button>
                        <button
                            onClick={handleAudioClick}
                            className={`flex flex-col items-center justify-center flex-1 py-4 md:py-6 rounded-2xl font-bold text-lg transition-all border-b-4
                                ${audioFeedback === 'hit'
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-700 scale-[0.98]' :
                                    audioFeedback === 'false-alarm'
                                        ? 'bg-rose-100 border-rose-400 text-rose-700 scale-[0.98]' :
                                        'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow active:scale-[0.98]'
                                }
                            `}
                        >
                            <span className="mb-1">Audio Match</span>
                            <span className="text-sm font-semibold text-slate-400 border border-slate-200 rounded px-2 bg-slate-50">(L)</span>
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'RESULT' && (() => {
                const stats = computeStats();
                const overallColor = stats.avgAcc >= 70 ? 'text-emerald-600' : stats.avgAcc < 50 ? 'text-rose-500' : 'text-amber-500';
                const overallBg = stats.avgAcc >= 70 ? 'bg-emerald-50 border-emerald-200' : stats.avgAcc < 50 ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200';
                return (
                    <div className="flex flex-col items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
                        <h2 className="text-3xl font-black text-slate-800 mb-2 text-center">Round Complete</h2>
                        <p className="text-sm text-slate-400 mb-6">{nBackLevel}-Back</p>

                        {/* Big Overall Score */}
                        <div className={`w-full p-6 rounded-2xl border-2 ${overallBg} mb-6 text-center`}>
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-500 block mb-1">Overall Accuracy</span>
                            <span className={`text-6xl font-black ${overallColor}`}>{Math.round(stats.avgAcc)}%</span>
                            <span className="text-xs text-slate-400 block mt-2">(Visual {Math.round(stats.visualAcc)}% + Audio {Math.round(stats.audioAcc)}%) ÷ 2</span>
                        </div>

                        {/* Score Bar showing where they landed */}
                        <div className="w-full mb-6">
                            <div className="w-full h-6 rounded-full bg-slate-200 relative overflow-hidden flex">
                                <div className="h-full bg-rose-400" style={{ width: '50%' }}></div>
                                <div className="h-full bg-amber-400" style={{ width: '20%' }}></div>
                                <div className="h-full bg-emerald-500" style={{ width: '30%' }}></div>
                                {/* Player's score marker */}
                                <div className="absolute top-0 h-full w-0.5 bg-slate-900 shadow-lg" style={{ left: `${Math.min(100, Math.max(0, stats.avgAcc))}%` }}>
                                    <div className="absolute -top-5 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {Math.round(stats.avgAcc)}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1 px-0.5">
                                <span>0%</span>
                                <span>50%</span>
                                <span>70%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="w-full space-y-3 mb-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl relative overflow-hidden">
                                <div className="absolute right-0 top-0 h-full bg-blue-100/50 w-20 flex items-center justify-center">
                                    <span className="text-xl font-black text-blue-600">{Math.round(stats.visualAcc)}%</span>
                                </div>
                                <h3 className="font-bold text-blue-800 mb-1 text-sm">👁 Visual</h3>
                                <div className="text-xs text-blue-700/80 grid grid-cols-3 gap-y-1 relative z-10 w-3/4">
                                    <span>Targets: {stats.vTargets}</span>
                                    <span className="font-semibold text-emerald-600">Hits: {stats.vHits}</span>
                                    <span className="text-rose-600">Missed: {stats.vMisses}</span>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl relative overflow-hidden">
                                <div className="absolute right-0 top-0 h-full bg-purple-100/50 w-20 flex items-center justify-center">
                                    <span className="text-xl font-black text-purple-600">{Math.round(stats.audioAcc)}%</span>
                                </div>
                                <h3 className="font-bold text-purple-800 mb-1 text-sm">🔊 Audio</h3>
                                <div className="text-xs text-purple-700/80 grid grid-cols-3 gap-y-1 relative z-10 w-3/4">
                                    <span>Targets: {stats.aTargets}</span>
                                    <span className="font-semibold text-emerald-600">Hits: {stats.aHits}</span>
                                    <span className="text-rose-600">Missed: {stats.aMisses}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="w-full text-center p-4 bg-slate-50 rounded-xl mb-8 border border-slate-200">
                            {stats.avgAcc >= 70 ? (
                                <span className="text-lg font-bold text-emerald-600 flex items-center justify-center gap-2">
                                    🎉 Level Up! Moving to {nBackLevel + 1}-Back
                                </span>
                            ) : stats.avgAcc < 50 ? (
                                <span className="text-lg font-bold text-rose-500 flex items-center justify-center gap-2">
                                    Drop to {Math.max(1, nBackLevel - 1)}-Back. Keep practicing!
                                </span>
                            ) : (
                                <span className="text-lg font-bold text-amber-600 flex items-center justify-center gap-2">
                                    Stay at {nBackLevel}-Back. Need ≥70% to level up!
                                </span>
                            )}
                        </div>

                        <button
                            onClick={nextRound}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:-translate-y-1 mb-4"
                        >
                            Continue
                        </button>
                    </div>
                );
            })()}
        </div>
    );
};

export default DualNBack;

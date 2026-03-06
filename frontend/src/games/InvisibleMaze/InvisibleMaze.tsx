import { useState, useEffect, useCallback, useRef } from 'react';
import { generateMaze } from './MazeGenerator';
import type { MazeConfig, Point } from './MazeGenerator';
import { useSoundEnabled } from '../../context/SoundContext';
import { playFailSound } from '../../utils/sounds';
import SEO from '../../components/SEO';

// Use clear visual SVGs for Key, Door, Player
const PlayerSVG = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#3b82f6" />
        <circle cx="35" cy="40" r="10" fill="white" />
        <circle cx="65" cy="40" r="10" fill="white" />
        <path d="M 30 70 Q 50 85 70 70" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

const KeySVG = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="50" r="20" stroke="#fbbf24" strokeWidth="12" />
        <path d="M 50 50 L 90 50 L 90 70 M 70 50 L 70 70" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DoorSVG = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="10" width="60" height="90" rx="4" fill="#8b5cf6" />
        <circle cx="70" cy="55" r="5" fill="#fde047" />
        <path d="M 20 10 L 80 10 L 80 100 L 20 100 Z" stroke="#ede9fe" strokeWidth="4" />
    </svg>
);

const useTimer = (initialTime: number) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    return {
        timeLeft,
        setTimeLeft,
        start: () => setIsRunning(true),
        stop: () => setIsRunning(false)
    };
};

const InvisibleMaze = () => {
    const { soundEnabled } = useSoundEnabled();
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN' | 'GAME_OVER'>('START');

    const [config, setConfig] = useState<MazeConfig | null>(null);
    const [playerPos, setPlayerPos] = useState<Point>({ x: 0, y: 0 });
    const [hasKey, setHasKey] = useState(false);

    // Animation state for "hitting" a wall
    const [hitWall, setHitWall] = useState<{ x: number, y: number, dir: 'up' | 'right' | 'down' | 'left' } | null>(null);

    const initialTime = Math.max(15, 45 - (level * 2));

    const { timeLeft, setTimeLeft, start, stop } = useTimer(initialTime);

    // Create a ref to store state for the keyboard listener without triggering re-renders
    const stateRef = useRef({ gameState, playerPos, config, hasKey });
    useEffect(() => {
        stateRef.current = { gameState, playerPos, config, hasKey };
    }, [gameState, playerPos, config, hasKey]);

    const initLevel = useCallback(() => {
        const newSize = 3 + Math.floor(level / 2);
        const newConfig = generateMaze(newSize, newSize);
        setConfig(newConfig);
        setPlayerPos(newConfig.start);
        setHasKey(false);
        setHitWall(null);
        setTimeLeft(Math.max(15, 45 - (level * 2)));
        setGameState('PLAYING');
        start();
    }, [level, setTimeLeft, start]);

    useEffect(() => {
        if (gameState === 'START') {
            initLevel();
        }
    }, [gameState, initLevel]);

    useEffect(() => {
        if (gameState === 'PLAYING' && timeLeft === 0) {
            setGameState('GAME_OVER');
            stop();
            playFailSound(soundEnabled);
        }
    }, [gameState, timeLeft, stop, soundEnabled]);

    const handleMove = useCallback((dx: number, dy: number) => {
        const { gameState: currState, playerPos: currPos, config: currConfig, hasKey: currHasKey } = stateRef.current;
        if (currState !== 'PLAYING' || !currConfig || hitWall) return; // Ignore input while animating a hit

        const nx = currPos.x + dx;
        const ny = currPos.y + dy;

        // Boundary checks
        if (nx < 0 || nx >= currConfig.width || ny < 0 || ny >= currConfig.height) {
            // Treat bounds as invisible walls for consistency in penalty
            triggerHit(currPos.x, currPos.y, dx, dy);
            return;
        }

        // Invisible Wall checking based on direction
        let hit = false;
        if (dx === 1 && currConfig.verticalWalls.has(`${currPos.x},${currPos.y}`)) hit = true;
        if (dx === -1 && currConfig.verticalWalls.has(`${nx},${ny}`)) hit = true;
        if (dy === 1 && currConfig.horizontalWalls.has(`${currPos.x},${currPos.y}`)) hit = true;
        if (dy === -1 && currConfig.horizontalWalls.has(`${nx},${ny}`)) hit = true;

        if (hit) {
            triggerHit(currPos.x, currPos.y, dx, dy);
            return;
        }

        // Move successfully
        setPlayerPos({ x: nx, y: ny });

        // Check objectives
        if (!currHasKey && nx === currConfig.key.x && ny === currConfig.key.y) {
            setHasKey(true);
        } else if (currHasKey && nx === currConfig.door.x && ny === currConfig.door.y) {
            stop();
            setGameState('WIN');
            const levelBonus = level * 500;
            const timeBonus = stateRef.current.hasKey ? timeLeft * 20 : 0; // ensure latest state
            setScore(s => s + levelBonus + timeBonus);
        }

    }, [stop, level, hitWall]);

    const triggerHit = (x: number, y: number, dx: number, dy: number) => {
        let dir: 'up' | 'right' | 'down' | 'left' = 'up';
        if (dy === -1) dir = 'up';
        if (dx === 1) dir = 'right';
        if (dy === 1) dir = 'down';
        if (dx === -1) dir = 'left';

        setHitWall({ x, y, dir });

        // Wait briefly for the animation to play, then reset position
        setTimeout(() => {
            setHitWall(null);
            if (stateRef.current.config) {
                setPlayerPos(stateRef.current.config.start);
                setHasKey(false); // They drop the key and start over!
            }
        }, 600);
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    handleMove(0, -1); break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    handleMove(1, 0); break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    handleMove(0, 1); break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    handleMove(-1, 0); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove]);

    if (!config) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center pt-8 pb-10 px-4 font-sans select-none overflow-x-hidden">
            <SEO title="Invisible Maze | CortexPlay" description="Memorize the hidden walls and navigate the Invisible Maze." />
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-gradient-cyan neon-text-cyan drop-shadow-lg">Invisible Maze</h1>
            <p className="text-slate-300 font-medium mb-6 text-center max-w-lg tracking-wide">
                Memorize the hidden walls. Grab the Key, reach the Door. Hitting a wall resets you and drops the key!
            </p>

            {/* Dashboard */}
            <header className="flex w-full max-w-xl justify-between items-center glass-panel p-4 rounded-3xl mb-8">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Level</span>
                    <span className="text-xl font-bold text-slate-100">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Time</span>
                    <span className={`text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse neon-text-rose' : 'text-cyan-400 neon-text-cyan'}`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Inventory</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${hasKey ? 'bg-slate-800 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800/50 border-slate-700'}`}>
                        {hasKey && <KeySVG className="w-6 h-6 drop-shadow-md" />}
                    </div>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Score</span>
                    <span className="text-xl font-bold text-slate-100">{score}</span>
                </div>
            </header>

            {/* Game Area */}
            {(gameState === 'PLAYING') && (
                <section className="flex flex-col items-center mb-6 relative" aria-label="Game Board">
                    <div
                        className="glass-panel p-2 rounded-2xl border border-cyan-900/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] grid relative"
                        style={{ gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))` }}
                    >
                        {Array.from({ length: config.height }).map((_, y) => (
                            Array.from({ length: config.width }).map((_, x) => {
                                const isPlayer = playerPos.x === x && playerPos.y === y;
                                const isKey = config.key.x === x && config.key.y === y && !hasKey;
                                const isDoor = config.door.x === x && config.door.y === y;

                                // Render red wall flash if hit
                                const isHitHere = hitWall?.x === x && hitWall?.y === y;

                                return (
                                    <div
                                        key={`${x}-${y}`}
                                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 m-0.5 rounded-xl flex items-center justify-center relative bg-slate-900/60 border border-slate-800/50 overflow-hidden"
                                    >
                                        {/* Board Entities */}
                                        {isDoor && <DoorSVG className="w-10 h-10 sm:w-14 sm:h-14 opacity-90 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" />}
                                        {isKey && <KeySVG className="w-10 h-10 sm:w-14 sm:h-14 animate-bounce drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}

                                        {/* Player */}
                                        {isPlayer && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-200 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                                                <PlayerSVG className="w-12 h-12 sm:w-16 sm:h-16" />
                                            </div>
                                        )}

                                        {/* Hit Wall Animation Overlay */}
                                        {isHitHere && hitWall.dir === 'up' && <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500 neon-glow-rose animate-pulse z-20" />}
                                        {isHitHere && hitWall.dir === 'right' && <div className="absolute top-0 right-0 bottom-0 w-2 bg-rose-500 neon-glow-rose animate-pulse z-20" />}
                                        {isHitHere && hitWall.dir === 'down' && <div className="absolute bottom-0 left-0 right-0 h-2 bg-rose-500 neon-glow-rose animate-pulse z-20" />}
                                        {isHitHere && hitWall.dir === 'left' && <div className="absolute top-0 left-0 bottom-0 w-2 bg-rose-500 neon-glow-rose animate-pulse z-20" />}

                                        {/* DEV CHEAT: uncomment to see hidden walls */}
                                        {/* {config.verticalWalls.has(`${x},${y}`) && <div className="absolute right-0 top-0 bottom-0 w-1 bg-slate-700 z-0" />} */}
                                        {/* {config.horizontalWalls.has(`${x},${y}`) && <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700 z-0" />} */}
                                    </div>
                                );
                            })
                        ))}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden grid grid-cols-3 gap-2 mt-8 w-48 mx-auto">
                        <div />
                        <button onClick={() => handleMove(0, -1)} className="glass-panel text-slate-300 hover:text-cyan-400 rounded-xl p-4 flex justify-center active:scale-95 transition-transform hover:shadow-cyan-900/50 hover:border-cyan-500/50">▲</button>
                        <div />
                        <button onClick={() => handleMove(-1, 0)} className="glass-panel text-slate-300 hover:text-cyan-400 rounded-xl p-4 flex justify-center active:scale-95 transition-transform hover:shadow-cyan-900/50 hover:border-cyan-500/50">◀</button>
                        <button onClick={() => handleMove(0, 1)} className="glass-panel text-slate-300 hover:text-cyan-400 rounded-xl p-4 flex justify-center active:scale-95 transition-transform hover:shadow-cyan-900/50 hover:border-cyan-500/50">▼</button>
                        <button onClick={() => handleMove(1, 0)} className="glass-panel text-slate-300 hover:text-cyan-400 rounded-xl p-4 flex justify-center active:scale-95 transition-transform hover:shadow-cyan-900/50 hover:border-cyan-500/50">▶</button>
                    </div>
                </section>
            )}

            {/* Win Screen */}
            {gameState === 'WIN' && (
                <div className="flex flex-col items-center glass-panel border border-cyan-500/30 p-8 md:p-12 rounded-3xl text-center animate-in zoom-in duration-500 max-w-md w-full">
                    <h2 className="text-5xl font-black text-cyan-400 mb-4 drop-shadow-md neon-text-cyan tracking-tight">Escaped!</h2>
                    <p className="text-slate-300 font-medium mb-8 tracking-wide">You memorized the labyrinth.</p>

                    <button
                        onClick={() => {
                            setLevel(l => l + 1);
                            setGameState('START');
                        }}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/50 hover:-translate-y-1 mb-4 flex items-center justify-center"
                    >
                        Next Floor <span className="ml-2 font-mono">→</span>
                    </button>
                    <a href="/" className="w-full block bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-semibold px-8 py-3 rounded-xl transition-colors mt-2 text-center">
                        Return to Hub
                    </a>
                </div>
            )}

            {/* Loss Screen */}
            {gameState === 'GAME_OVER' && (
                <div className="flex flex-col items-center glass-panel p-8 md:p-12 border border-rose-900/50 rounded-3xl text-center animate-in zoom-in duration-500 max-w-md w-full">
                    <h2 className="text-5xl font-black text-rose-500 mb-4 drop-shadow-md neon-text-rose tracking-tight">Trapped</h2>
                    <p className="text-slate-400 font-medium mb-6 tracking-wide">Time ran out.</p>
                    <p className="text-2xl font-bold text-slate-100 mb-8 tracking-tight">Final Score: {score}</p>

                    <button
                        onClick={() => {
                            setLevel(1);
                            setScore(0);
                            setGameState('START');
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-1 mb-4 flex items-center justify-center"
                    >
                        Try Again <span className="ml-2">↻</span>
                    </button>
                    <a href="/" className="w-full block bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-semibold px-8 py-3 rounded-xl transition-colors mt-2 text-center">
                        Return to Hub
                    </a>
                </div>
            )}

            {gameState !== 'WIN' && gameState !== 'GAME_OVER' && (
                <a href="/" className="text-slate-400 hover:text-cyan-400 tracking-wide text-sm font-semibold transition-colors mt-auto pt-8 flex items-center gap-1">
                    <span>←</span> Back to Games
                </a>
            )}
        </main>
    );
};

export default InvisibleMaze;

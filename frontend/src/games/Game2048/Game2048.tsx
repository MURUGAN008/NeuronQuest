import React, { useState, useEffect, useCallback } from 'react';
import type { Grid, Direction } from './Game2048Logic';
import {
    getLevelConfig,
    createEmptyGrid,
    addObstacles,
    addRandomTile,
    moveGrid,
    checkGameOver,
    OBSTACLE
} from './Game2048Logic';
import { useSoundEnabled } from '../../context/SoundContext';
import { playFailSound } from '../../utils/sounds';

const Game2048 = () => {
    const { soundEnabled } = useSoundEnabled();
    const [level, setLevel] = useState<number>(1);
    const [score, setScore] = useState<number>(0);
    const [bestScore, setBestScore] = useState<number>(() => parseInt(localStorage.getItem('cortexPlay_2048_best') || '0', 10));
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN' | 'GAME_OVER'>('START');

    // We start with a generic 4x4, but initLevel will overwrite it
    const [grid, setGrid] = useState<Grid>(Array(4).fill(Array(4).fill(null)));
    const [config, setConfig] = useState(getLevelConfig(1));

    // Touch handling
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    const initLevel = useCallback((targetLevel: number, preserveScore: boolean = false) => {
        const c = getLevelConfig(targetLevel);
        setConfig(c);
        setLevel(targetLevel);

        if (!preserveScore) setScore(0);

        let newGrid = createEmptyGrid(c.size);
        if (c.obstacles > 0) {
            newGrid = addObstacles(newGrid, c.obstacles);
        }
        // Start with 2 random tiles
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);

        setGrid(newGrid);
        setGameState('PLAYING');
    }, []);

    useEffect(() => {
        if (gameState === 'START') {
            initLevel(1);
        }
    }, [gameState, initLevel]);

    const handleMove = useCallback((direction: Direction) => {
        if (gameState !== 'PLAYING') return;

        const { newGrid, scoreAdded, moved } = moveGrid(grid, direction);

        if (moved) {
            if (scoreAdded > 0 && soundEnabled) {
                // Play a tiny beep for merges
                const audio = new Audio('/sounds/pop.mp3'); // Fallback to pop if score sound is too long
                audio.volume = 0.2;
                audio.play().catch(() => { });
            }

            const updatedGrid = addRandomTile(newGrid);
            setGrid(updatedGrid);

            const newScore = score + scoreAdded;
            setScore(newScore);
            if (newScore > bestScore) {
                setBestScore(newScore);
                localStorage.setItem('cortexPlay_2048_best', newScore.toString());
            }

            // Did they win this level?
            let wonLevel = false;
            for (let r = 0; r < updatedGrid.length; r++) {
                for (let c = 0; c < updatedGrid[r].length; c++) {
                    if (updatedGrid[r][c] !== null && updatedGrid[r][c]! >= config.winScore) {
                        wonLevel = true;
                        break;
                    }
                }
                if (wonLevel) break;
            }

            if (wonLevel) {
                setGameState('WIN');
                return;
            }

            // Check Game Over
            if (checkGameOver(updatedGrid)) {
                setGameState('GAME_OVER');
                playFailSound(soundEnabled);
            }
        }
    }, [grid, gameState, score, bestScore, config.winScore, soundEnabled]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'PLAYING') return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault(); handleMove('UP'); break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault(); handleMove('DOWN'); break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault(); handleMove('LEFT'); break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault(); handleMove('RIGHT'); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove, gameState]);

    // Touch controls
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };

        const dx = touchEnd.x - touchStart.x;
        const dy = touchEnd.y - touchStart.y;

        // Threshold
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            handleMove(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
            handleMove(dy > 0 ? 'DOWN' : 'UP');
        }
        setTouchStart(null);
    };

    // Styling helpers
    const getTileColorClass = (val: number | null) => {
        if (val === null) return 'bg-slate-900/60 border-slate-800 shadow-inner';
        if (val === OBSTACLE) return 'bg-slate-950 border-rose-900/40 text-rose-500/50 flex items-center justify-center'; // Asteroid

        // The classic 2048 colors, adapted for neon dark mode
        switch (val) {
            case 2: return 'bg-slate-800 border-slate-600 text-slate-200 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]';
            case 4: return 'bg-slate-700 border-slate-500 text-slate-100 shadow-[inset_0_0_12px_rgba(255,255,255,0.1)]';
            case 8: return 'bg-indigo-900/80 border-indigo-500/50 text-indigo-200 neon-glow-indigo';
            case 16: return 'bg-blue-900/80 border-blue-500/50 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
            case 32: return 'bg-cyan-900/80 border-cyan-400/50 text-cyan-200 neon-glow-cyan';
            case 64: return 'bg-emerald-900/80 border-emerald-400/50 text-emerald-200 neon-glow-emerald';
            case 128: return 'bg-amber-900/80 border-amber-400/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
            case 256: return 'bg-orange-900/80 border-orange-400/50 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.5)]';
            case 512: return 'bg-rose-900/80 border-rose-400/50 text-rose-200 neon-glow-rose';
            case 1024: return 'bg-pink-900/80 border-pink-400/50 text-pink-200 shadow-[0_0_25px_rgba(236,72,153,0.6)]';
            case 2048: return 'bg-purple-900/80 border-purple-400 text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.8)]';
            case 4096: return 'bg-fuchsia-900 border-fuchsia-300 text-white shadow-[0_0_40px_rgba(217,70,239,0.9)]';
            case 8192: return 'bg-white border-slate-200 text-slate-900 shadow-[0_0_50px_rgba(255,255,255,1)]';
            default: return 'bg-slate-100 border-white text-slate-900 shadow-[0_0_50px_rgba(255,255,255,1)]';
        }
    };

    const getGridSizeClass = (size: number) => {
        if (size === 3) return 'grid-cols-3 grid-rows-3';
        if (size === 5) return 'grid-cols-5 grid-rows-5';
        return 'grid-cols-4 grid-rows-4';
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center pt-8 pb-10 px-4 font-sans select-none overflow-x-hidden">
            {/* Header */}
            <div className="w-full max-w-lg flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-5xl font-black mb-1 text-cyan-400 neon-text-cyan drop-shadow-lg tracking-tight">2048</h1>
                    <p className="text-slate-400 text-sm font-semibold tracking-wide">Level {level} • Target: {config.winScore}</p>
                </div>
                <div className="flex gap-3">
                    <div className="glass-panel px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Score</span>
                        <span className="text-xl font-black text-slate-200">{score}</span>
                    </div>
                    <div className="glass-panel px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Best</span>
                        <span className="text-xl font-black text-slate-200">{bestScore}</span>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="relative w-full max-w-lg">

                {/* 
                    The grid container 
                    We use aspect-square so it's always a perfect box.
                */}
                <div
                    className={`glass-panel w-full aspect-square p-3 sm:p-4 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-900/30 grid gap-2 sm:gap-3 ${getGridSizeClass(config.size)} touch-none`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {grid.map((row, r) => (
                        row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                className={`
                                    flex items-center justify-center rounded-xl sm:rounded-2xl text-2xl sm:text-4xl font-black border transition-all duration-150 transform
                                    ${getTileColorClass(cell)}
                                    ${cell !== null && cell !== OBSTACLE ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}
                                `}
                            >
                                {cell !== null && cell !== OBSTACLE ? cell : ''}
                                {cell === OBSTACLE && '☄️'}
                            </div>
                        ))
                    ))}
                </div>

                {/* Overlays */}
                {(gameState === 'WIN' || gameState === 'GAME_OVER') && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-3xl"></div>

                        <div className="relative glass-panel p-8 text-center rounded-2xl border border-slate-700 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-500">
                            {gameState === 'WIN' ? (
                                <>
                                    <h2 className="text-4xl font-black text-emerald-400 neon-text-emerald mb-2">Level Cleared!</h2>
                                    <p className="text-slate-300 mb-6">You reached the {config.winScore} tile! Ready for a harder grid?</p>
                                    <button
                                        onClick={() => initLevel(level + 1, true)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-1 mb-3 neon-glow-emerald border border-emerald-400/50"
                                    >
                                        Next Level
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl font-black text-rose-500 neon-text-rose mb-2">Game Over</h2>
                                    <p className="text-slate-300 mb-6">No more moves! You made it to Level {level}.</p>
                                    <button
                                        onClick={() => initLevel(1, false)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-1 mb-3"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}

                            <a href="/" className="w-full block bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors mt-2 text-sm border border-slate-700">
                                Back to Hub
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mt-8 text-center text-slate-500 text-sm max-w-sm">
                <p>Join the numbers and get to the <strong className="text-cyan-400">{config.winScore}</strong> tile to level up!</p>
                <p className="mt-2 text-xs">Use <strong className="text-slate-400">arrow keys</strong>, <strong className="text-slate-400">WASD</strong>, or <strong className="text-slate-400">swipe</strong> to move tiles.</p>
                {config.obstacles > 0 && (
                    <p className="mt-2 text-xs text-rose-400/80">Watch out for the asteroid obstacles (☄️)! Tiles cannot move through them.</p>
                )}
            </div>

            {gameState === 'PLAYING' && (
                <a href="/" className="mt-8 text-slate-500 hover:text-slate-300 text-sm font-semibold transition-colors">
                    ← Back to Menu
                </a>
            )}
        </div>
    );
};

export default Game2048;

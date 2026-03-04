import React, { useState, useEffect, useCallback } from 'react';
import { generateLevel } from './PathGenerator';
import type { GridCell, LevelConfig } from './PathGenerator';
import { checkWin } from './pathResolver';
import { useSoundEnabled } from '../../context/SoundContext';
import { playFailSound } from '../../utils/sounds';
import type { PathNode } from './pathResolver';
import ChevronStraight from './components/ChevronStraight';
import ChevronTurnRight from './components/ChevronTurnRight';
import ChevronTurnLeft from './components/ChevronTurnLeft';
import RocketLogo from './components/RocketLogo';
import PlanetLogo from './components/PlanetLogo';

// Hook for the timer
function useTimer(initialTime: number) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    return {
        timeLeft,
        start: () => setIsRunning(true),
        stop: () => setIsRunning(false),
        restart: () => {
            setTimeLeft(initialTime);
            setIsRunning(true);
        },
        setTimeLeft
    };
}

const AstroPath = () => {
    const { soundEnabled } = useSoundEnabled();
    const [level, setLevel] = useState<number>(1);
    const [score, setScore] = useState<number>(0);
    const [rotations, setRotations] = useState<number>(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'ANIMATING' | 'WIN' | 'GAME_OVER'>('START');
    const [config, setConfig] = useState<LevelConfig | null>(null);
    const [grid, setGrid] = useState<GridCell[][]>([]);

    // Animation states
    const [animFrames, setAnimFrames] = useState<{ x: number, y: number, deg: number }[]>([]);
    const [animatingIndex, setAnimatingIndex] = useState(0);

    // Dynamic difficulty: larger grids and tighter times
    const currentGridSize = 4 + Math.floor(level / 2); // 4x4, 4x4, 5x5, 5x5...
    // The player gets 40 seconds base, minus 2 seconds per level, with a minimum floor of 20 seconds.
    // This gives them more breathing room since the generator now actively tries to trick them with branches.
    const initialTime = Math.max(20, 40 - (level * 2));

    // We cannot destructure initialTime directly into the hook without it going stale on level change
    // so we handle it gracefully with useEffect.
    const { timeLeft, start, stop, setTimeLeft } = useTimer(initialTime);

    const initLevel = useCallback(() => {
        const newConfig = generateLevel(currentGridSize, currentGridSize);
        setConfig(newConfig);
        setGrid(newConfig.grid);
        setRotations(0);
        setTimeLeft(initialTime);
        setAnimFrames([]);
        setAnimatingIndex(0);
        setGameState('PLAYING');
        start();
    }, [currentGridSize, initialTime, setTimeLeft, start]);

    useEffect(() => {
        if (gameState === 'START') {
            initLevel();
        }
    }, [gameState, initLevel]);

    useEffect(() => {
        if (gameState === 'PLAYING') {
            if (timeLeft === 0) {
                setGameState('GAME_OVER');
                stop();
                playFailSound(soundEnabled);
            } else if (config) {
                const pathResult = checkWin(grid, config);
                if (pathResult) {
                    stop();

                    const frames: { x: number, y: number, deg: number }[] = [];
                    let currentH = 1; // Start heading is RIGHT (1)
                    let currentDeg = 0; // The rocket SVG natively points RIGHT, so 0 deg = RIGHT

                    // Add an initial frame just outside the board
                    frames.push({ x: config.startX - 1, y: config.startY, deg: currentDeg });

                    for (const node of pathResult) {
                        // Move into the tile maintaining current heading
                        frames.push({ x: node.x, y: node.y, deg: currentDeg });

                        if (node.entry_h !== node.exit_h) {
                            // Turn inside the tile
                            let diff = node.exit_h - currentH;
                            if (diff === -3) diff = 1;
                            if (diff === 3) diff = -1;

                            currentDeg += diff * 90;
                            currentH = node.exit_h;

                            frames.push({ x: node.x, y: node.y, deg: currentDeg });
                        } else {
                            currentH = node.exit_h;
                        }
                    }

                    setAnimFrames(frames);
                    setAnimatingIndex(0);
                    setGameState('ANIMATING');
                }
            }
        }
    }, [grid, config, timeLeft, gameState, stop, soundEnabled]);

    // Rocket Traverse Animation Loop
    useEffect(() => {
        if (gameState === 'ANIMATING' && animFrames.length > 0) {
            if (animatingIndex < animFrames.length - 1) {
                const timer = setTimeout(() => {
                    setAnimatingIndex(prev => prev + 1);
                }, 300); // 300ms transition time per action
                return () => clearTimeout(timer);
            } else if (animatingIndex === animFrames.length - 1) {
                // Wait briefly at the end before showing win screen
                const timer = setTimeout(() => {
                    setGameState('WIN');
                }, 400);
                return () => clearTimeout(timer);
            }
        }
    }, [gameState, animatingIndex, animFrames]);

    const handleRotate = (x: number, y: number) => {
        if (gameState !== 'PLAYING') return;

        setGrid(prev => {
            const newGrid = [...prev].map(row => [...row]);
            const cell = newGrid[y][x];

            if (cell.type !== 'empty') {
                cell.rotation = (cell.rotation + 1) % 4;
                setRotations(r => r + 1);
            }
            return newGrid;
        });
    };

    const nextLevel = () => {
        // Calculate score
        const levelBase = level * 1000;
        const timeBonus = timeLeft * 50;
        const penalty = rotations * 10;
        const earned = Math.max(0, levelBase + timeBonus - penalty);
        setScore(s => s + earned);

        setLevel(l => l + 1);
        setGameState('START');
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setGameState('START');
    };

    if (!config || grid.length === 0) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">Loading Systems...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center pt-10 pb-10 px-4 font-sans select-none overflow-x-hidden">
            <h1 className="text-4xl md:text-5xl font-black mb-2 text-emerald-500 tracking-tight">AstroPath</h1>

            <div className="flex w-full max-w-2xl justify-between items-center bg-white shadow-sm p-4 rounded-2xl border border-slate-200 mb-8 backdrop-blur-sm">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Level</span>
                    <span className="text-2xl font-bold text-slate-800">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Time</span>
                    <span className={`text-3xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Score</span>
                    <span className="text-2xl font-bold text-slate-800">{score}</span>
                </div>
            </div>

            {/* Game Grid Area */}
            {(gameState === 'PLAYING' || gameState === 'ANIMATING') && (
                <div className="flex flex-col items-center mb-6">
                    <div className="text-slate-500 text-sm font-medium mb-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        Rotations used: <span className="text-slate-800 font-bold">{rotations}</span>
                    </div>

                    <div
                        className="grid bg-white p-2 md:p-4 rounded-2xl border-2 border-slate-200 shadow-xl relative"
                        style={{
                            gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))`
                        }}
                    >
                        {/* Animating Rocket */}
                        {gameState === 'ANIMATING' && animFrames.length > 0 && (() => {
                            const frame = animFrames[Math.min(animatingIndex, animFrames.length - 1)];
                            const leftPercent = (frame.x + 0.5) * (100 / config.width);
                            const topPercent = (frame.y + 0.5) * (100 / config.height);

                            return (
                                <div
                                    className="absolute z-20 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 pointer-events-none transition-all duration-300 ease-linear"
                                    style={{
                                        left: `${leftPercent}%`,
                                        top: `${topPercent}%`,
                                        transform: `translate(-50%, -50%) rotate(${frame.deg}deg)`
                                    }}
                                >
                                    <RocketLogo className="w-full h-full drop-shadow-2xl text-emerald-300" />
                                </div>
                            );
                        })()}

                        {grid.map((row, y) => (
                            row.map((cell, x) => {
                                const isStart = x === config.startX && y === config.startY;
                                const isEnd = x === config.endX && y === config.endY;

                                return (
                                    <div
                                        key={`${x}-${y}`}
                                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 m-1 rounded-xl flex items-center justify-center relative transition-all duration-300
                                            ${cell.type === 'empty' ? 'bg-slate-50 border border-slate-100' : 'bg-slate-100 border-b-4 border-slate-300 cursor-pointer hover:bg-slate-200 active:border-b-0 active:translate-y-1'}
                                            ${isStart ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white' : ''}
                                            ${isEnd ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white' : ''}
                                        `}
                                        onClick={() => handleRotate(x, y)}
                                    >
                                        {/* Render Tile SVG based on type and rotation check */}
                                        {cell.type !== 'empty' && (
                                            <div
                                                className="w-full h-full p-2 md:p-3 transition-transform duration-200"
                                                style={{ transform: `rotate(${cell.rotation * 90}deg)` }}
                                            >
                                                {cell.type === 'straight' && <ChevronStraight className="w-full h-full text-emerald-500 opacity-90" />}
                                                {cell.type === 'turnRight' && <ChevronTurnRight className="w-full h-full text-blue-500 opacity-90" />}
                                                {cell.type === 'turnLeft' && <ChevronTurnLeft className="w-full h-full text-indigo-500 opacity-90" />}
                                            </div>
                                        )}

                                        {/* Overlays for Start/End */}
                                        {isStart && gameState !== 'ANIMATING' && (
                                            <div className="absolute -left-8 md:-left-12 z-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 pointer-events-none transform -rotate-90">
                                                <RocketLogo className="w-full h-full drop-shadow-lg" />
                                            </div>
                                        )}
                                        {isEnd && (
                                            <div className="absolute -right-6 md:-right-10 z-10 w-10 h-10 md:w-14 md:h-14 pointer-events-none">
                                                <PlanetLogo className="w-full h-full text-purple-400 drop-shadow-lg" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
            )}

            {/* Win / Loss Screens */}
            {gameState === 'WIN' && (
                <div className="flex flex-col items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in duration-500 max-w-md w-full">
                    <h2 className="text-4xl font-black text-emerald-500 mb-4">Connection Made!</h2>
                    <p className="text-slate-500 mb-2 tracking-wide">You routed the rocket successfully.</p>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl w-full mb-8 font-mono space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Level Bonus:</span> <span className="text-emerald-500 font-bold">+{level * 1000}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Time Left ({timeLeft}s):</span> <span className="text-emerald-500 font-bold">+{timeLeft * 50}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Rotations ({rotations}):</span> <span className="text-red-500 font-bold">-{rotations * 10}</span></div>
                    </div>
                    <button onClick={nextLevel} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:-translate-y-1 mb-4 flex items-center justify-center">
                        Engage Thrusters <span className="ml-2 font-mono text-xl">→</span>
                    </button>
                    <a href="/" className="w-full block bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-8 py-3 rounded-xl transition-colors mt-2 text-center">
                        Return to Hub
                    </a>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div className="flex flex-col items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in duration-500 max-w-md w-full">
                    <h2 className="text-4xl font-black text-red-500 mb-4">Signal Lost</h2>
                    <p className="text-slate-500 mb-8 tracking-wide">The rocket ran out of fuel before reaching the destination.</p>
                    <p className="text-2xl font-bold text-slate-800 mb-8">Final Score: {score}</p>
                    <button onClick={restartGame} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 mb-4 flex items-center justify-center">
                        Try Again <span className="ml-2 font-mono text-xl">↻</span>
                    </button>
                    <a href="/" className="w-full block bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-8 py-3 rounded-xl transition-colors mt-2 text-center">
                        Return to Hub
                    </a>
                </div>
            )}

            {gameState !== 'GAME_OVER' && gameState !== 'WIN' && (
                <a href="/" className="text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors mt-auto pt-8">
                    ← Back to Games
                </a>
            )}
        </div>
    );
};

export default AstroPath;

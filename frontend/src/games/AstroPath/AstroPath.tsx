import React, { useState, useEffect, useCallback } from 'react';
import { generateLevel } from './PathGenerator';
import type { GridCell, LevelConfig } from './PathGenerator';
import { checkWin } from './pathResolver';
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
    const [level, setLevel] = useState<number>(1);
    const [score, setScore] = useState<number>(0);
    const [rotations, setRotations] = useState<number>(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN' | 'GAME_OVER'>('START');
    const [config, setConfig] = useState<LevelConfig | null>(null);
    const [grid, setGrid] = useState<GridCell[][]>([]);

    // Dynamic difficulty: larger grids and tighter times
    const currentGridSize = 4 + Math.floor(level / 2); // 4x4, 4x4, 5x5, 5x5...
    const initialTime = Math.max(20, 45 - (level * 2));

    // We cannot destructure initialTime directly into the hook without it going stale on level change
    // so we handle it gracefully with useEffect.
    const { timeLeft, start, stop, setTimeLeft } = useTimer(initialTime);

    const initLevel = useCallback(() => {
        const newConfig = generateLevel(currentGridSize, currentGridSize);
        setConfig(newConfig);
        setGrid(newConfig.grid);
        setRotations(0);
        setTimeLeft(initialTime);
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
            } else if (config && checkWin(grid, config)) {
                // WON!
                stop();
                setGameState('WIN');
            }
        }
    }, [grid, config, timeLeft, gameState, stop]);

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

    if (!config || grid.length === 0) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Systems...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-10 pb-10 px-4 font-sans select-none overflow-x-hidden">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">AstroPath</h1>

            <div className="flex w-full max-w-2xl justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-8 backdrop-blur-sm">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Level</span>
                    <span className="text-2xl font-bold text-white">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Time</span>
                    <span className={`text-3xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Score</span>
                    <span className="text-2xl font-bold text-yellow-400">{score}</span>
                </div>
            </div>

            {/* Game Grid Area */}
            {gameState === 'PLAYING' && (
                <div className="flex flex-col items-center mb-6">
                    <div className="text-slate-400 text-sm mb-4 bg-slate-800/60 px-4 py-2 rounded-full border border-slate-700/50">
                        Rotations used: <span className="text-white font-bold">{rotations}</span>
                    </div>

                    <div
                        className="grid bg-slate-800 p-2 md:p-4 rounded-2xl border-4 border-slate-700 shadow-2xl relative"
                        style={{
                            gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))`
                        }}
                    >
                        {grid.map((row, y) => (
                            row.map((cell, x) => {
                                const isStart = x === config.startX && y === config.startY;
                                const isEnd = x === config.endX && y === config.endY;

                                return (
                                    <div
                                        key={`${x}-${y}`}
                                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 m-1 rounded-xl flex items-center justify-center relative transition-all duration-300
                                            ${cell.type === 'empty' ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-slate-700 border-b-4 border-slate-900 cursor-pointer hover:bg-slate-600 active:border-b-0 active:translate-y-1'}
                                            ${isStart ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-800' : ''}
                                            ${isEnd ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-800' : ''}
                                        `}
                                        onClick={() => handleRotate(x, y)}
                                    >
                                        {/* Render Tile SVG based on type and rotation check */}
                                        {cell.type !== 'empty' && (
                                            <div
                                                className="w-full h-full p-2 md:p-3 transition-transform duration-200"
                                                style={{ transform: `rotate(${cell.rotation * 90}deg)` }}
                                            >
                                                {cell.type === 'straight' && <ChevronStraight className="w-full h-full text-emerald-400 opacity-90" />}
                                                {cell.type === 'turnRight' && <ChevronTurnRight className="w-full h-full text-blue-400 opacity-90" />}
                                                {cell.type === 'turnLeft' && <ChevronTurnLeft className="w-full h-full text-indigo-400 opacity-90" />}
                                            </div>
                                        )}

                                        {/* Overlays for Start/End */}
                                        {isStart && (
                                            <div className="absolute -left-6 md:-left-10 z-10 w-8 h-8 md:w-12 md:h-12 pointer-events-none transform -rotate-90">
                                                <RocketLogo className="w-full h-full drop-shadow-lg" />
                                            </div>
                                        )}
                                        {isEnd && (
                                            <div className="absolute -right-6 md:-right-10 z-10 w-8 h-8 md:w-12 md:h-12 pointer-events-none">
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
                <div className="flex flex-col items-center bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-emerald-500/30 text-center animate-in zoom-in duration-500 max-w-md w-full backdrop-blur-md">
                    <h2 className="text-4xl font-black text-emerald-400 mb-4">Connection Made!</h2>
                    <p className="text-slate-300 mb-2">You routed the rocket successfully.</p>
                    <div className="bg-slate-900/50 p-4 rounded-xl w-full mb-8 font-mono space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Level Bonus:</span> <span className="text-emerald-400">+{level * 1000}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Time Left ({timeLeft}s):</span> <span className="text-emerald-400">+{timeLeft * 50}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Rotations ({rotations}):</span> <span className="text-red-400">-{rotations * 10}</span></div>
                    </div>
                    <button onClick={nextLevel} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-4 flex items-center justify-center">
                        Engage Thrusters <span className="ml-2 font-mono text-xl">→</span>
                    </button>
                    <a href="/" className="w-full block bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-3 mx-2 rounded-xl transition-colors mt-2 text-center">
                        Return to Hub
                    </a>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div className="flex flex-col items-center bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-red-500/30 text-center animate-in zoom-in duration-500 max-w-md w-full backdrop-blur-md">
                    <h2 className="text-4xl font-black text-red-500 mb-4">Signal Lost</h2>
                    <p className="text-slate-300 mb-8">The rocket ran out of fuel before reaching the destination.</p>
                    <p className="text-2xl font-bold text-yellow-400 mb-8 tracking-wide">Final Score: {score}</p>
                    <button onClick={restartGame} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.4)] mb-4 flex items-center justify-center">
                        Try Again <span className="ml-2 font-mono text-xl">↻</span>
                    </button>
                    <a href="/" className="w-full block bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors mt-2 text-center">
                        Return to Hub
                    </a>
                </div>
            )}

            {gameState !== 'GAME_OVER' && gameState !== 'WIN' && (
                <a href="/" className="text-slate-500 hover:text-slate-300 text-sm font-semibold transition-colors mt-auto pt-8">
                    ← Back to Games
                </a>
            )}
        </div>
    );
};

export default AstroPath;

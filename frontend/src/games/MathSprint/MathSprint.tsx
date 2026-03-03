import { useEffect, useState } from "react";
import { generateQuestions, type QuestionData } from "./GameData";
import Bubble from "./Bubble";
import reArrange from "./reArrange";
import ShowTime from "./ShowTime";
import useTimer from "../../hooks/useTimer";

const MathSprint = () => {
    const [level, setLevel] = useState<number>(1);
    const [score, setScore] = useState<number>(0);
    const [roundState, setRoundState] = useState<'START' | 'PLAYING' | 'RESULT' | 'GAME_OVER'>('START');
    const [data, setData] = useState<QuestionData[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<number[]>([]);

    // Give more time per level as complexity naturally increases slightly
    const { timeLeft, stop, restart } = useTimer(15 + Math.floor(level / 3) * 5);
    const count = level <= 3 ? 3 : level <= 6 ? 4 : 5; // dynamic count based on level

    const startRound = () => {
        const newData = generateQuestions(level, count);
        reArrange(newData);
        setData(newData);
        setSelectedOrder([]);
        restart();
        setRoundState('PLAYING');
    };

    useEffect(() => {
        if (roundState === 'START') {
            startRound();
        }
    }, [roundState]);

    useEffect(() => {
        if (roundState === 'PLAYING') {
            if (timeLeft === 0) {
                setRoundState('RESULT');
            } else if (selectedOrder.length === count) {
                stop();
                setRoundState('RESULT');
            }
        }
    }, [timeLeft, selectedOrder, count, roundState, stop]);

    const handleClick = (id: number): void => {
        if (roundState !== 'PLAYING') return;

        if (selectedOrder.includes(id)) {
            // Remove the item and push subsequent selections down in order
            setSelectedOrder(prev => prev.filter(selectedId => selectedId !== id));
            return;
        }

        setSelectedOrder([...selectedOrder, id]);
    };

    const isPerfect = selectedOrder.length === count && selectedOrder.every((id, idx) => data.find(d => d.id === id)?.sortedIndex === idx + 1);

    const nextLevel = () => {
        if (isPerfect) {
            setScore(prev => prev + (level * 100) + (timeLeft * 10)); // Time bonus!
        }

        if (level < 10) {
            setLevel(prev => prev + 1);
            setRoundState('START');
        } else {
            setRoundState('GAME_OVER');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-20 pb-10 px-4">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Math Sprint</h1>
            {roundState !== 'GAME_OVER' && (
                <div className="mb-8 flex flex-col items-center">
                    <p className="text-xl text-slate-600 font-medium mb-1">Level {level} / 10</p>
                    <p className="text-lg font-bold text-blue-600 mb-3 tracking-wide">SCORE: {score}</p>
                    <ShowTime timeLeft={timeLeft} />
                </div>
            )}

            {roundState === 'GAME_OVER' ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Challenge Complete!</h2>
                    <p className="text-xl text-blue-600 font-bold mb-2">Final Score: {score}</p>
                    <p className="text-slate-600 mb-8">You have conquered all 10 levels of MathSprint.</p>
                    <button onClick={() => { setLevel(1); setScore(0); setRoundState('START'); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm w-full block mb-3">Play Again</button>
                    <a href="/" className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors block w-full">Back to Games</a>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap justify-center gap-6 max-w-3xl w-full mb-10">
                        {data.map((item) => (
                            <Bubble
                                key={item.id}
                                item={item}
                                handleClick={handleClick}
                                selectedOrder={selectedOrder}
                                roundState={roundState}
                            />
                        ))}
                    </div>

                    {roundState === 'RESULT' && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 font-mono">
                                {isPerfect ? "Perfect! 🌟" + ` (+${level * 100 + timeLeft * 10} pts)` : "Round Completed!"}
                            </h3>
                            <button
                                onClick={nextLevel}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1"
                            >
                                {level < 10 ? "Next Level" : "Finish Game"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MathSprint;
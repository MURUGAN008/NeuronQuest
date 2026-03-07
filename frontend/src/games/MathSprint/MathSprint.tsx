import { useEffect, useState } from "react";
import { generateQuestions, type QuestionData } from "./GameData";
import Bubble from "./Bubble";
import reArrange from "./reArrange";
import ShowTime from "./ShowTime";
import useTimer from "../../hooks/useTimer";
import { useSoundEnabled } from "../../context/SoundContext";
import { playFailSound } from "../../utils/sounds";
import SEO from "../../components/SEO";
import GameSEOContent from "../../components/GameSEOContent";

const MathSprint = () => {
    const { soundEnabled } = useSoundEnabled();
    const [level, setLevel] = useState<number>(1);
    const [score, setScore] = useState<number>(0);
    const [totalCorrect, setTotalCorrect] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
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
            if (timeLeft === 0 || selectedOrder.length === count) {
                stop();
                setRoundState('RESULT');
            }
        }
    }, [timeLeft, selectedOrder.length, count, roundState, stop]);

    const handleClick = (id: number): void => {
        if (roundState !== 'PLAYING') return;

        if (selectedOrder.includes(id)) {
            // Remove the item and push subsequent selections down in order
            setSelectedOrder(prev => prev.filter(selectedId => selectedId !== id));
            return;
        }

        setSelectedOrder([...selectedOrder, id]);
    };

    const correctCount = selectedOrder.reduce((acc, id, idx) => {
        const item = data.find(d => d.id === id);
        return acc + (item?.sortedIndex === idx + 1 ? 1 : 0);
    }, 0);
    const accuracy = count > 0 ? Math.round((correctCount / count) * 100) : 0;
    const isPerfect = selectedOrder.length === count && selectedOrder.every((id, idx) => data.find(d => d.id === id)?.sortedIndex === idx + 1);

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setTotalCorrect(0);
        setTotalItems(0);
        setRoundState('START');
    };

    const nextLevel = () => {
        if (isPerfect) {
            setScore(prev => prev + (level * 100) + (timeLeft * 10)); // Time bonus!
        }

        const newTotalCorrect = totalCorrect + correctCount;
        const newTotalItems = totalItems + count;

        setTotalCorrect(newTotalCorrect);
        setTotalItems(newTotalItems);

        if (level < 10) {
            setLevel(prev => prev + 1);
            setRoundState('START');
        } else {
            setRoundState('GAME_OVER');
            const finalAcc = newTotalItems > 0 ? Math.round((newTotalCorrect / newTotalItems) * 100) : 0;
            if (finalAcc < 70) {
                playFailSound(soundEnabled);
            }
        }
    };

    return (
        <main className="min-h-screen bg-transparent flex flex-col items-center pt-20 pb-10 px-4">
            <SEO
                title="Math Sprint – Free Mental Math Speed Game Online | CortexPlay"
                description="Play Math Sprint free online. Race against the clock to solve mental math problems across 10 levels. Improve arithmetic speed, numerical fluency and cognitive performance. No download needed."
                url="https://cortexplay.games/MathSprint"
                keywords="mental math game, math speed test, arithmetic training, free math game online, brain math exercises, number games, math puzzle game"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "VideoGame",
                    "name": "Math Sprint",
                    "url": "https://cortexplay.games/MathSprint",
                    "description": "A fast-paced mental arithmetic game with 10 progressively harder levels. Test and improve your math speed.",
                    "genre": "Brain Training",
                    "gamePlatform": "Web Browser",
                    "applicationCategory": "Game",
                    "operatingSystem": "Any",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                    "publisher": { "@type": "Organization", "name": "CortexPlay", "url": "https://cortexplay.games" }
                }}
            />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-gradient-cyan neon-text-cyan drop-shadow-lg">Math Sprint</h1>
            {roundState !== 'GAME_OVER' && (
                <header className="mb-8 flex flex-col items-center">
                    <p className="text-xl text-slate-300 font-medium mb-1">Level {level} / 10</p>
                    <p className="text-lg font-bold text-cyan-400 mb-3 tracking-wide neon-text-cyan">SCORE: {score}</p>
                    <ShowTime timeLeft={timeLeft} />
                </header>
            )}

            {roundState === 'GAME_OVER' ? (() => {
                const finalAcc = totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0;
                const isFailed = finalAcc < 70;

                return (
                    <div className="glass-panel p-12 rounded-3xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                        {isFailed ? (
                            <>
                                <h2 className="text-4xl font-bold text-rose-500 mb-4 drop-shadow-md">You Lost!</h2>
                                <p className="text-xl text-slate-100 font-bold mb-2">Final Score: {score}</p>
                                <p className="text-lg text-rose-400 font-bold mb-6">Overall Accuracy: {finalAcc}% (Need 70%)</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-bold text-emerald-400 mb-4 drop-shadow-md">Challenge Complete!</h2>
                                <p className="text-xl text-cyan-400 font-bold mb-2">Final Score: {score}</p>
                                <p className="text-lg text-emerald-400 font-bold mb-2">Overall Accuracy: {finalAcc}%</p>
                                <p className="text-slate-300 mb-8 font-medium">You have conquered all 10 levels of MathSprint.</p>
                            </>
                        )}
                        <button onClick={restartGame} className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-colors shadow-lg hover:shadow-cyan-500/50 w-full block mb-3">Play Again</button>
                        <a href="/" className="bg-slate-800 text-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors block w-full border border-slate-700">Back to Games</a>
                    </div>
                );
            })() : (
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
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel p-8 rounded-3xl w-full max-w-sm mt-4">
                            <h3 className="text-3xl font-bold text-emerald-400 mb-2 font-mono drop-shadow-md">
                                {isPerfect ? "Perfect! 🌟" : "Level Cleared! 🎉"}
                            </h3>
                            <p className="text-lg text-slate-300 font-bold mb-6">
                                Accuracy: {accuracy}% <span className="text-emerald-400">{isPerfect && `(+${level * 100 + timeLeft * 10} pts)`}</span>
                            </p>
                            <button
                                onClick={nextLevel}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-1 w-full"
                            >
                                {level < 10 ? "Next Level" : "Finish Game"}
                            </button>
                        </div>
                    )}
                </>
            )}

            <GameSEOContent
                title="Math Sprint"
                sections={[
                    {
                        heading: 'How to Play Math Sprint',
                        content: 'Math Sprint is a fast-paced mental arithmetic game that challenges you to solve math problems under intense time pressure. Each round presents you with a set of numbered bubbles that must be clicked in the correct ascending order based on their calculated values. The game features 10 progressively harder levels, starting with simple addition and subtraction before introducing multiplication, division, and multi-step operations. You earn points for each correct answer, with bonus points awarded for perfect rounds and remaining time on the clock.'
                    },
                    {
                        heading: 'Scoring System & Progression',
                        content: 'Your score in Math Sprint is calculated based on accuracy and speed. Each level awards base points multiplied by the level number, and a time bonus rewards players who solve problems quickly. A perfect round where every bubble is selected in the exact correct order earns the maximum score. The game dynamically increases the number of bubbles from 3 at the early levels to 5 at the higher levels, and the mathematical operations become significantly more complex. To clear the full game, you must maintain at least 70% accuracy across all 10 levels. Falling below this threshold results in a game over.'
                    },
                    {
                        heading: 'Cognitive Benefits of Mental Math',
                        content: 'Practicing mental arithmetic regularly has been shown to improve numerical fluency, enhance working memory, and strengthen the brain\'s executive function. Studies published in journals like Cognitive Psychology and Neuropsychologia demonstrate that individuals who regularly engage in mental math exercises show improved performance in problem-solving tasks, faster decision-making, and better academic and professional outcomes. Math Sprint is specifically designed to push you just beyond your comfort zone with its adaptive difficulty system, ensuring that the training remains challenging and effective as your skills improve over time.'
                    },
                    {
                        heading: 'Tips for High Scores',
                        content: 'Focus on evaluating all the bubbles before clicking any of them. Look for the smallest and largest values first to establish your ordering anchors. In later levels where operations get complex, try to estimate values rather than compute exact answers — often you only need to know which value is larger, not the precise number. Practice regularly to build mental shortcuts for common multiplication tables and division patterns.'
                    }
                ]}
                keywords={['mental math game', 'arithmetic training', 'math puzzle', 'brain math exercises', 'number games online', 'math speed test', 'cognitive math training']}
            />
        </main>
    );
}

export default MathSprint;
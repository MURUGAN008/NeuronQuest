import { Link, useNavigate } from "react-router-dom";
import SEO from '../components/SEO';
import GameSEOContent from '../components/GameSEOContent';
import mathSprintThumb from '../assets/mathsprint-thumb.png';
import astropathThumb from '../assets/astropath-thumb.png';
import invisibleMazeThumb from '../assets/invisiblemaze-thumb.png';
import dualNBackThumb from '../assets/dualnback-thumb.png';
import sequenceMemoryThumb from '../assets/sequencememory-thumb.png';
import Game2048Thumb from '../assets/2048-thumb.png';

const Games = () => {
    const navigate = useNavigate();

    const games = [
        {
            id: 'math-sprint',
            title: 'Math Sprint',
            description: 'Test your mental math speed with progressively harder shortcuts.',
            path: '/MathSprint',
            color: 'bg-blue-500',
            image: mathSprintThumb
        },
        {
            id: 'astropath',
            title: 'AstroPath',
            description: 'Guide the rocket! Rotate path tiles strategically to build an unbroken route.',
            path: '/astropath',
            color: 'bg-emerald-500',
            image: astropathThumb
        },
        {
            id: 'invisible-maze',
            title: 'Invisible Maze',
            description: 'Memory challenge! Navigate a labyrinth where walls are hidden until you crash into them.',
            path: '/invisible-maze',
            color: 'bg-indigo-500',
            image: invisibleMazeThumb
        },
        {
            id: 'dual-n-back',
            title: 'Dual N-Back',
            description: 'The ultimate working memory test. Track simultaneous audio and visual sequences to expand your fluid intelligence.',
            path: '/dual-n-back',
            color: 'bg-purple-500',
            image: dualNBackThumb
        },
        {
            id: '2048',
            title: '2048',
            description: 'Swipe, merge, and reach the final tile while dodging asteroids',
            color: 'bg-cyan-500',
            path: '/2048',
            image: Game2048Thumb
        },
        {
            id: 'sequence-memory',
            title: 'Sequence Memory',
            description: 'Test your working memory by perfectly recalling sequences of numbers and letters.',
            path: '/sequence-memory',
            color: 'bg-rose-500',
            image: sequenceMemoryThumb
        }
    ];

    const playRandomGame = () => {
        const paths = games.map(g => g.path);
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        navigate(randomPath);
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-transparent">
            <SEO
                title="Free Brain Training Games Online | CortexPlay – Improve Memory & Focus"
                description="Play free brain training games online at CortexPlay. Improve memory, focus, reaction speed and spatial reasoning with 6 scientifically-designed cognitive exercises. No download required."
                url="https://cortexplay.games/"
                keywords="brain training games, free brain games, memory games online, cognitive training, brain exercises, puzzle games, mental fitness, free online games"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "CortexPlay",
                    "url": "https://cortexplay.games",
                    "applicationCategory": "GameApplication",
                    "operatingSystem": "Any",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                    "description": "Free premium brain training games to improve memory, focus, reaction speed and spatial reasoning.",
                    "screenshot": "https://cortexplay.games/preview.png",
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "150" }
                }}
            />
            <div className="max-w-5xl w-full">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-gradient-cyan neon-text-cyan drop-shadow-lg">
                        CortexPlay
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium mb-8">
                        Sharpen your mind with our premium cognitive training platform.
                    </p>

                    {/* Play Random Game Button */}
                    <button
                        onClick={playRandomGame}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-panel glass-panel-hover font-bold text-lg text-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-95"
                    >
                        <span className="text-2xl group-hover:animate-bounce">🎲</span>
                        <span className="group-hover:neon-text-cyan transition-all">Play Random Game</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {/* Subtle pulsing glow */}
                        <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 animate-pulse pointer-events-none" />
                    </button>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Game Selection">
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            to={game.path}
                            className="group relative glass-panel glass-panel-hover rounded-3xl p-8 overflow-hidden flex flex-col cursor-pointer"
                        >
                            {/* Animated Top Border Glow */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${game.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-80`} />

                            {/* Dynamic background glow based on game color */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${game.color.split('-')[1]}-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {game.image && (
                                <div className="w-full h-48 mb-6 rounded-2xl border border-slate-700/50 shadow-inner overflow-hidden bg-slate-800/50 flex items-center justify-center p-2 backdrop-blur-sm z-10">
                                    <img src={game.image} alt={`${game.title} preview`} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.08]" />
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors z-10 drop-shadow-md">
                                {game.title}
                            </h2>
                            <p className="text-slate-400 leading-relaxed mb-8 flex-grow z-10 font-medium">
                                {game.description}
                            </p>

                            <div className="flex items-center text-cyan-400 font-bold tracking-wide z-10 mt-auto">
                                <span className="group-hover:neon-text-cyan transition-all">Play Now</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-3 transition-transform duration-300 group-hover:text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </section>

                <GameSEOContent
                    title="CortexPlay"
                    sections={[
                        {
                            heading: 'What is CortexPlay?',
                            content: 'CortexPlay is a free, premium brain training platform designed to help you sharpen your cognitive abilities through beautifully crafted, scientifically-inspired games. Unlike traditional brain training apps that feel clinical and boring, CortexPlay combines cutting-edge neuroscience principles with stunning neon-dark aesthetics and satisfying micro-animations to make cognitive improvement genuinely enjoyable. Every game on the platform is carefully designed to target specific mental faculties including working memory, spatial reasoning, mathematical fluency, pattern recognition, and reaction speed.'
                        },
                        {
                            heading: 'Why Train Your Brain?',
                            content: 'Research in cognitive neuroscience has consistently shown that regular mental exercise can improve fluid intelligence, enhance working memory capacity, and even slow age-related cognitive decline. Just as physical exercise strengthens your muscles, cognitive training strengthens neural pathways in your brain. CortexPlay makes this process accessible and fun by gamifying the training experience. Whether you are a student looking to improve focus and academic performance, a professional wanting to stay mentally sharp, or simply someone who enjoys challenging puzzles, CortexPlay offers games tailored to every skill level with adaptive difficulty that grows with you.'
                        },
                        {
                            heading: 'Our Games',
                            content: 'CortexPlay currently features six unique brain training games. Math Sprint tests your mental arithmetic under time pressure across 10 progressively harder levels. AstroPath challenges your spatial reasoning by having you rotate path tiles to guide a rocket to its destination. Invisible Maze trains your memory by making you navigate through a labyrinth where walls are completely hidden. Dual N-Back is the gold standard of working memory training, requiring you to track both visual positions and spoken letters simultaneously. Sequence Memory tests your short-term recall with progressively longer sequences of numbers, letters, or mixed characters. Finally, 2048 Neon Edition puts a fresh spin on the classic tile-merging puzzle with asteroid obstacles and multiple difficulty levels.'
                        },
                        {
                            heading: 'Play Anywhere, Anytime',
                            content: 'CortexPlay is built as a modern web application that works seamlessly on desktop computers, tablets, and mobile phones. There is nothing to download or install — simply open your browser and start playing. All your high scores are saved locally so you can track your improvement over time. The platform is completely free to use with no account required, making it the most accessible brain training tool available online today.'
                        }
                    ]}
                    keywords={['brain training games', 'cognitive training', 'memory games', 'puzzle games online', 'brain exercises', 'mental fitness', 'working memory', 'free brain games', 'brain training app']}
                />
            </div>
        </main>
    )
}

export default Games;
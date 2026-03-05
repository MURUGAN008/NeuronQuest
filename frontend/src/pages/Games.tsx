import { Link } from "react-router-dom";
import mathSprintThumb from '../assets/mathsprint-thumb.png';
import astropathThumb from '../assets/astropath-thumb.png';
import invisibleMazeThumb from '../assets/invisiblemaze-thumb.png';
import dualNBackThumb from '../assets/dualnback-thumb.png';
import sequenceMemoryThumb from '../assets/sequencememory-thumb.png';

const Games = () => {
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
            id: 'sequence-memory',
            title: 'Sequence Memory',
            description: 'Test your working memory by perfectly recalling sequences of numbers and letters.',
            path: '/sequence-memory',
            color: 'bg-rose-500',
            image: sequenceMemoryThumb
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
            <div className="max-w-5xl w-full">
                <div className="mb-16 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-gradient-cyan neon-text-cyan drop-shadow-lg">
                        NeuronQuest
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
                        Sharpen your mind with our premium cognitive training platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                </div>
            </div>
        </div>
    )
}

export default Games;
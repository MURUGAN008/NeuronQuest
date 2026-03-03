import { Link } from "react-router-dom";

const Games = () => {
    const games = [
        {
            id: 'math-sprint',
            title: 'Math Sprint',
            description: 'Test your mental math speed with progressively harder shortcuts.',
            path: '/MathSprint',
            color: 'bg-blue-500'
        },
        {
            id: 'astropath',
            title: 'AstroPath',
            description: 'Guide the rocket! Rotate path tiles strategically to build an unbroken route.',
            path: '/astropath',
            color: 'bg-emerald-500'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        NeuronQuest
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Sharpen your mind with our collection of specialized cognitive games.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            to={game.path}
                            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col"
                        >
                            <div className={`absolute top-0 left-0 w-full h-2 ${game.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`} />

                            <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                                {game.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                                {game.description}
                            </p>

                            <div className="flex items-center text-blue-600 font-medium">
                                <span>Play Now</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
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
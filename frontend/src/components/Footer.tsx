import { Link } from 'react-router-dom';

const Footer = () => {
    const gameLinks = [
        { path: '/MathSprint', label: 'Math Brain Training' },
        { path: '/astropath', label: 'Spatial Reasoning Game' },
        { path: '/invisible-maze', label: 'Memory Maze Game' },
        { path: '/dual-n-back', label: 'Working Memory Training' },
        { path: '/sequence-memory', label: 'Memory Test Online' },
        { path: '/2048', label: '2048 Puzzle Game' },
    ];

    return (
        <footer className="w-full mt-auto pt-12 pb-8 px-6 border-t border-slate-800/50">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-200 mb-3">CortexPlay</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Free online brain training games designed to improve memory, focus, reaction speed, and cognitive performance.
                        </p>
                    </div>

                    {/* Game Links */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Brain Games</h3>
                        <nav aria-label="Game navigation">
                            <ul className="space-y-2">
                                {gameLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className="text-slate-500 hover:text-cyan-400 text-sm transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">About</h3>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>Free to play — no account needed</li>
                            <li>Works on desktop, tablet &amp; mobile</li>
                            <li>Scientifically-inspired exercises</li>
                            <li>Scores saved locally</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-600">
                        © {new Date().getFullYear()} CortexPlay. Free brain training games online.
                    </p>
                    <div className="flex gap-4 text-xs text-slate-600">
                        <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
                        <span>·</span>
                        <a href="/sitemap.xml" className="hover:text-slate-400 transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

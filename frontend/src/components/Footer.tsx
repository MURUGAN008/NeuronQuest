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

    const resourceLinks = [
        { path: '/blog', label: 'Brain Training Blog' },
        { path: '/about', label: 'About CortexPlay' },
        { path: '/contact', label: 'Contact & FAQ' },
    ];

    const legalLinks = [
        { path: '/privacy-policy', label: 'Privacy Policy' },
        { path: '/terms-of-service', label: 'Terms of Service' },
    ];

    return (
        <footer className="w-full mt-auto pt-12 pb-8 px-6 border-t border-slate-800/50">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Resources</h3>
                        <nav aria-label="Resource navigation">
                            <ul className="space-y-2">
                                {resourceLinks.map((link) => (
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

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Legal</h3>
                        <nav aria-label="Legal navigation">
                            <ul className="space-y-2">
                                {legalLinks.map((link) => (
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
                        <div className="mt-4">
                            <a
                                href="mailto:murs4002@gmail.com"
                                className="text-slate-500 hover:text-cyan-400 text-sm transition-colors duration-200"
                            >
                                murs4002@gmail.com
                            </a>
                        </div>
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
                        <Link to="/blog" className="hover:text-slate-400 transition-colors">Blog</Link>
                        <span>·</span>
                        <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy</Link>
                        <span>·</span>
                        <Link to="/terms-of-service" className="hover:text-slate-400 transition-colors">Terms</Link>
                        <span>·</span>
                        <a href="/sitemap.xml" className="hover:text-slate-400 transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About = () => {
    const features = [
        { icon: '🧠', title: 'Science-Backed Design', desc: 'Every game targets specific cognitive functions identified by neuroscience research.' },
        { icon: '🎮', title: '6 Unique Games', desc: 'From mental math to spatial reasoning, each game challenges a different part of your brain.' },
        { icon: '⚡', title: 'Instant Play', desc: 'No downloads, no accounts, no setup. Open the browser and start training immediately.' },
        { icon: '📊', title: 'Track Progress', desc: 'Scores are saved locally so you can monitor your improvement over time.' },
        { icon: '📱', title: 'Multi-Device', desc: 'Play on desktop, tablet, or mobile — the experience adapts to any screen size.' },
        { icon: '🆓', title: '100% Free', desc: 'All games are completely free with no hidden paywalls or premium tiers.' },
    ];

    return (
        <main className="min-h-screen flex justify-center px-6 py-20 bg-transparent">
            <SEO
                title="About CortexPlay – Free Brain Training Games Platform"
                description="Learn about CortexPlay's mission to make cognitive training accessible, fun, and free. Discover the science behind our brain training games and meet the creator."
                url="https://cortexplay.games/about"
                keywords="about CortexPlay, brain training platform, cognitive games, free brain exercises, brain training science"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    "name": "About CortexPlay",
                    "url": "https://cortexplay.games/about",
                    "description": "Learn about CortexPlay's mission to make cognitive training accessible, fun, and free for everyone.",
                    "mainEntity": {
                        "@type": "WebApplication",
                        "name": "CortexPlay",
                        "url": "https://cortexplay.games"
                    }
                }}
            />
            <div className="max-w-3xl w-full">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gradient-cyan neon-text-cyan drop-shadow-lg">
                    About CortexPlay
                </h1>
                <p className="text-xl text-slate-300 mb-12 leading-relaxed font-medium">
                    A free brain training platform built to make cognitive improvement accessible, 
                    enjoyable, and beautiful for everyone.
                </p>

                {/* Mission */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Mission</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        CortexPlay was born from a simple belief: <strong className="text-cyan-400">everyone deserves access to tools that sharpen their mind</strong>. 
                        Most brain training platforms lock their best features behind expensive subscriptions, leaving millions of people without 
                        access to quality cognitive exercises. We built CortexPlay to change that.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        Our platform offers premium-quality brain training games that are completely free — no accounts, no subscriptions, 
                        no hidden costs. Every game on CortexPlay is designed with care, combining insights from cognitive neuroscience 
                        with modern web technology to deliver an experience that feels polished, responsive, and genuinely fun to use.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        We believe that cognitive fitness is just as important as physical fitness. Just as you might go for a daily run 
                        or lift weights to stay in shape, spending a few minutes each day with brain training games can help maintain and 
                        improve mental sharpness, processing speed, and memory capacity. CortexPlay makes this daily mental workout 
                        accessible to anyone with a web browser.
                    </p>
                </section>

                {/* Science Section */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">The Science Behind Brain Training</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        The concept of brain training is rooted in <strong className="text-slate-100">neuroplasticity</strong> — the brain's ability to 
                        reorganize itself by forming new neural connections throughout life. Research has shown that targeted cognitive exercises 
                        can strengthen specific neural pathways, leading to measurable improvements in cognitive function.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        Working memory training, such as the Dual N-Back task featured on CortexPlay, has been studied extensively in peer-reviewed 
                        journals. A landmark 2008 study by Jaeggi et al. published in the Proceedings of the National Academy of Sciences demonstrated 
                        that working memory training could transfer to improvements in fluid intelligence — the ability to reason and solve novel problems.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        Mental arithmetic exercises, like our Math Sprint game, have been shown to activate the prefrontal cortex and improve numerical 
                        fluency and executive function. Spatial reasoning tasks, such as navigating mazes and planning paths, engage the hippocampus and 
                        parietal cortex — regions critical for memory formation and spatial awareness.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        While we make no medical claims, the scientific literature supports the idea that regular cognitive exercise can contribute to 
                        maintaining mental sharpness, improving processing speed, and potentially delaying age-related cognitive decline when combined 
                        with a healthy lifestyle.
                    </p>
                </section>

                {/* Features Grid */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6">What Makes CortexPlay Different</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {features.map((f, i) => (
                            <div key={i} className="glass-panel rounded-2xl p-6 flex items-start gap-4">
                                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                                <div>
                                    <h3 className="font-bold text-slate-100 mb-1">{f.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our Games */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Games</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        CortexPlay currently features six carefully crafted brain training games, each targeting different aspects of cognitive function:
                    </p>
                    <div className="space-y-4">
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="font-bold text-cyan-400 mb-1">Math Sprint</h3>
                            <p className="text-sm text-slate-400">A fast-paced mental arithmetic game with 10 progressively harder levels. Tests numerical fluency, mental calculation speed, and comparative reasoning under time pressure.</p>
                        </div>
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="font-bold text-cyan-400 mb-1">AstroPath</h3>
                            <p className="text-sm text-slate-400">A spatial reasoning puzzle where you rotate path tiles to build an unbroken route for a rocket. Trains visual-spatial processing, planning ability, and pattern recognition.</p>
                        </div>
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="font-bold text-cyan-400 mb-1">Invisible Maze</h3>
                            <p className="text-sm text-slate-400">Navigate a labyrinth where walls are completely hidden until you collide with them. Challenges spatial memory, mental mapping, and strategic exploration.</p>
                        </div>
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="font-bold text-cyan-400 mb-1">Dual N-Back</h3>
                            <p className="text-sm text-slate-400">The gold standard of working memory training. Track simultaneous visual positions and audio letters to expand fluid intelligence and attention span.</p>
                        </div>
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="font-bold text-cyan-400 mb-1">Sequence Memory</h3>
                            <p className="text-sm text-slate-400">Test short-term recall by memorizing and reproducing increasingly complex sequences of numbers, letters, and mixed characters.</p>
                        </div>
                        <div className="glass-panel rounded-xl p-5">
                            <h3 className="font-bold text-cyan-400 mb-1">2048</h3>
                            <p className="text-sm text-slate-400">A neon-enhanced version of the classic tile-merging puzzle with asteroid obstacles and multiple difficulty levels. Trains strategic thinking, planning, and pattern anticipation.</p>
                        </div>
                    </div>
                </section>

                {/* Creator */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">The Creator</h2>
                    <div className="glass-panel rounded-2xl p-8">
                        <p className="text-slate-300 leading-relaxed mb-4">
                            CortexPlay is built and maintained by <strong className="text-cyan-400">Murugan</strong>, a passionate developer 
                            who believes in the power of technology to improve everyday life. Combining expertise in modern web development 
                            with a fascination for cognitive science, Murugan created CortexPlay as an open-source-spirited project to make 
                            brain training accessible to everyone.
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <a 
                                href="https://github.com/MURUGAN008" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                GitHub
                            </a>
                            <a 
                                href="mailto:murs4002@gmail.com"
                                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                murs4002@gmail.com
                            </a>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Ready to Train Your Brain?</h2>
                    <p className="text-slate-400 mb-6">Jump into any of our six games and start sharpening your mind today.</p>
                    <Link 
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-panel glass-panel-hover font-bold text-lg text-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                    >
                        🎮 Play Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default About;

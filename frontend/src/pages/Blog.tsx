import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogArticles } from '../data/blogData';

const Blog = () => {
    const categoryColors: Record<string, string> = {
        'Neuroscience': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        'Cognitive Health': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        'Research': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        'Cognitive Science': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        'Digital Wellness': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    };

    return (
        <main className="min-h-screen flex justify-center px-6 py-20 bg-transparent">
            <SEO
                title="Brain Training Blog – Neuroscience, Memory & Cognitive Health | CortexPlay"
                description="Explore articles on neuroscience, memory improvement, cognitive training research, and brain health. Evidence-based insights from the CortexPlay team."
                url="https://cortexplay.games/blog"
                keywords="brain training blog, neuroscience articles, memory improvement tips, cognitive health, brain science"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "Blog",
                    "name": "CortexPlay Blog",
                    "url": "https://cortexplay.games/blog",
                    "description": "Evidence-based articles on neuroscience, memory improvement, and cognitive training.",
                    "publisher": {
                        "@type": "Organization",
                        "name": "CortexPlay",
                        "url": "https://cortexplay.games"
                    },
                    "blogPost": blogArticles.map(a => ({
                        "@type": "BlogPosting",
                        "headline": a.title,
                        "url": `https://cortexplay.games/blog/${a.slug}`,
                        "datePublished": a.date,
                        "description": a.description
                    }))
                }}
            />
            <div className="max-w-4xl w-full">
                {/* Header */}
                <header className="mb-14">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gradient-cyan neon-text-cyan drop-shadow-lg">
                        Brain Training Blog
                    </h1>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                        Evidence-based articles on neuroscience, memory improvement, and the science behind cognitive training.
                    </p>
                </header>

                {/* Article Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Blog Articles">
                    {blogArticles.map(article => (
                        <Link
                            key={article.slug}
                            to={`/blog/${article.slug}`}
                            className="group glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-300"
                        >
                            {/* Category & Read Time */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[article.category] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                                    {article.category}
                                </span>
                                <span className="text-xs text-slate-500">{article.readTime}</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors leading-snug">
                                {article.title}
                            </h2>

                            {/* Description */}
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                                {article.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                                <span className="text-xs text-slate-500">
                                    {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-cyan-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>

                {/* Bottom CTA */}
                <section className="mt-16 text-center glass-panel rounded-2xl p-10">
                    <h2 className="text-2xl font-bold text-slate-100 mb-3">Ready to Put Theory into Practice?</h2>
                    <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                        Now that you've read about the science, experience it firsthand. Play our free brain training games and start strengthening your cognitive abilities today.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105"
                    >
                        🎮 Play Free Games
                    </Link>
                </section>

                {/* Back link */}
                <div className="mt-10">
                    <a href="/" className="text-cyan-400 hover:underline font-medium text-sm">← Back to CortexPlay</a>
                </div>
            </div>
        </main>
    );
};

export default Blog;

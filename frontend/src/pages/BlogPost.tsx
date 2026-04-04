import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogArticles } from '../data/blogData';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const article = blogArticles.find(a => a.slug === slug);

    if (!article) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-transparent">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-100 mb-4">Article Not Found</h1>
                    <p className="text-slate-400 mb-8">The article you're looking for doesn't exist or has been moved.</p>
                    <Link to="/blog" className="text-cyan-400 hover:underline font-medium">← Back to Blog</Link>
                </div>
            </main>
        );
    }

    // Find related articles (same category, different slug)
    const relatedArticles = blogArticles
        .filter(a => a.category === article.category && a.slug !== article.slug)
        .slice(0, 2);

    // If not enough in same category, fill with recent articles
    if (relatedArticles.length < 2) {
        const needed = 2 - relatedArticles.length;
        const others = blogArticles
            .filter(a => a.slug !== article.slug && !relatedArticles.some(r => r.slug === a.slug))
            .slice(0, needed);
        relatedArticles.push(...others);
    }

    return (
        <main className="min-h-screen flex justify-center px-6 py-20 bg-transparent">
            <SEO
                title={`${article.title} | CortexPlay Blog`}
                description={article.description}
                url={`https://cortexplay.games/blog/${article.slug}`}
                keywords={article.keywords.join(', ')}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": article.title,
                    "url": `https://cortexplay.games/blog/${article.slug}`,
                    "datePublished": article.date,
                    "description": article.description,
                    "author": {
                        "@type": "Person",
                        "name": "Murugan",
                        "url": "https://github.com/MURUGAN008"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "CortexPlay",
                        "url": "https://cortexplay.games"
                    },
                    "keywords": article.keywords.join(', ')
                }}
            />
            <article className="max-w-3xl w-full">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-slate-500">
                        <li><Link to="/" className="hover:text-slate-300 transition-colors">Home</Link></li>
                        <li>/</li>
                        <li><Link to="/blog" className="hover:text-slate-300 transition-colors">Blog</Link></li>
                        <li>/</li>
                        <li className="text-slate-400 truncate max-w-[200px]">{article.title}</li>
                    </ol>
                </nav>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-cyan-500/15 text-cyan-400 border-cyan-500/30">
                            {article.category}
                        </span>
                        <span className="text-xs text-slate-500">{article.readTime}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <time className="text-xs text-slate-500" dateTime={article.date}>
                            {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </time>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight mb-4">
                        {article.title}
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        {article.description}
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-10">
                    {article.content.map((section, i) => (
                        <section key={i}>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-4 leading-snug">
                                {section.heading}
                            </h2>
                            <div className="space-y-4">
                                {section.paragraphs.map((paragraph, j) => (
                                    <p key={j} className="text-slate-300 leading-relaxed text-[15.5px]">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Keywords */}
                <div className="mt-12 flex flex-wrap gap-2">
                    {article.keywords.map((keyword, i) => (
                        <span
                            key={i}
                            className="text-xs font-medium text-slate-500 bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-1"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>

                {/* Author */}
                <div className="mt-10 glass-panel rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        M
                    </div>
                    <div>
                        <p className="font-bold text-slate-200 text-sm">Written by Murugan</p>
                        <p className="text-slate-500 text-xs">Creator of CortexPlay • Passionate about cognitive science and web development</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12" />

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold text-slate-100 mb-6">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {relatedArticles.map(related => (
                                <Link
                                    key={related.slug}
                                    to={`/blog/${related.slug}`}
                                    className="group glass-panel glass-panel-hover rounded-xl p-5 flex flex-col"
                                >
                                    <span className="text-xs text-slate-500 mb-2">{related.category} • {related.readTime}</span>
                                    <h4 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors text-sm leading-snug mb-2">
                                        {related.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                        {related.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <div className="mt-12 text-center glass-panel rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Experience Brain Training Firsthand</h3>
                    <p className="text-slate-400 text-sm mb-5">Put the science into practice with our free brain training games.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                        🎮 Play Free Games
                    </Link>
                </div>

                {/* Navigation */}
                <div className="mt-10 flex justify-between items-center">
                    <Link to="/blog" className="text-cyan-400 hover:underline font-medium text-sm">← All Articles</Link>
                    <Link to="/" className="text-slate-500 hover:text-slate-300 font-medium text-sm transition-colors">Home</Link>
                </div>
            </article>
        </main>
    );
};

export default BlogPost;

import { useState } from 'react';
import SEO from '../components/SEO';

const Contact = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('murs4002@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const faqs = [
        {
            q: 'Is CortexPlay really free?',
            a: 'Yes, 100%. All six brain training games on CortexPlay are completely free to play. There are no premium tiers, in-app purchases, or hidden costs. We support the platform through non-intrusive advertising.'
        },
        {
            q: 'Do I need to create an account?',
            a: 'No. CortexPlay requires no registration or login. You can start playing immediately. Your game scores and preferences are saved locally in your browser, so they persist between sessions on the same device.'
        },
        {
            q: 'How is my data handled?',
            a: 'CortexPlay stores game progress only in your browser\'s localStorage — this data never leaves your device. We use Vercel Analytics for anonymous usage statistics and Google AdSense for advertising. For full details, please read our Privacy Policy.'
        },
        {
            q: 'Can I play on my phone?',
            a: 'Absolutely. CortexPlay is built as a responsive web application that works on desktop computers, tablets, and mobile phones. Simply open cortexplay.games in your mobile browser and start playing.'
        },
        {
            q: 'Are these games scientifically proven?',
            a: 'Our games are inspired by established cognitive training paradigms from neuroscience research, such as the Dual N-Back task for working memory. While we do not make medical claims, the underlying principles are supported by peer-reviewed studies. Brain training should complement, not replace, a healthy lifestyle.'
        },
        {
            q: 'My scores disappeared. What happened?',
            a: 'Scores are saved in your browser\'s localStorage. Clearing your browser data, switching browsers, or using private/incognito mode will reset your scores. Unfortunately, since we don\'t use server-side storage, we cannot recover lost scores.'
        },
        {
            q: 'Can I suggest a new game?',
            a: 'We love hearing from our community! If you have ideas for new brain training games or features, please reach out via email. We\'re always looking to expand the CortexPlay library with games that target different cognitive abilities.'
        },
        {
            q: 'Is CortexPlay open source?',
            a: 'CortexPlay is developed by an independent creator. While the project is not fully open source at this time, you can follow the development journey on GitHub. We may open-source specific components in the future.'
        }
    ];

    return (
        <main className="min-h-screen flex justify-center px-6 py-20 bg-transparent">
            <SEO
                title="Contact Us | CortexPlay – Free Brain Training Games"
                description="Get in touch with the CortexPlay team. Questions, feedback, or suggestions about our free brain training games? We'd love to hear from you."
                url="https://cortexplay.games/contact"
                keywords="contact CortexPlay, brain games support, feedback, brain training help"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    "name": "Contact CortexPlay",
                    "url": "https://cortexplay.games/contact",
                    "description": "Get in touch with the CortexPlay team for questions, feedback, or suggestions."
                }}
            />
            <div className="max-w-3xl w-full">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gradient-cyan neon-text-cyan drop-shadow-lg">
                    Contact Us
                </h1>
                <p className="text-xl text-slate-300 mb-12 leading-relaxed font-medium">
                    Have a question, found a bug, or want to suggest a new game? We'd love to hear from you.
                </p>

                {/* Contact Methods */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6">Get in Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Email */}
                        <div className="glass-panel rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-100">Email</h3>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                                Best for questions, feedback, bug reports, and game suggestions. We typically respond within 48 hours.
                            </p>
                            <div className="flex items-center gap-2">
                                <a 
                                    href="mailto:murs4002@gmail.com" 
                                    className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
                                >
                                    murs4002@gmail.com
                                </a>
                                <button 
                                    onClick={handleCopy}
                                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded border border-slate-700 hover:border-slate-500"
                                >
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* GitHub */}
                        <div className="glass-panel rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-100">GitHub</h3>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                                Follow the development of CortexPlay, report technical issues, or explore our code.
                            </p>
                            <a 
                                href="https://github.com/MURUGAN008" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
                            >
                                github.com/MURUGAN008 →
                            </a>
                        </div>
                    </div>
                </section>

                {/* Response expectations */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">What to Include in Your Message</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        To help us respond as quickly and effectively as possible, please include the following in your email:
                    </p>
                    <ul className="space-y-3 text-slate-400">
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span><strong className="text-slate-300">Bug Reports:</strong> Which game you were playing, what you expected to happen, what actually happened, and your browser/device information.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span><strong className="text-slate-300">Game Suggestions:</strong> A brief description of the game concept and what cognitive skill it would target.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span><strong className="text-slate-300">General Feedback:</strong> Let us know which games you enjoy most and what we could improve.</span>
                        </li>
                    </ul>
                </section>

                {/* FAQ */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="glass-panel rounded-xl group">
                                <summary className="p-5 cursor-pointer font-bold text-slate-200 hover:text-cyan-400 transition-colors list-none flex items-center justify-between">
                                    {faq.q}
                                    <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </summary>
                                <div className="px-5 pb-5 text-slate-400 leading-relaxed text-[15px] border-t border-slate-800/50 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Back link */}
                <div className="pt-8 border-t border-slate-800/50">
                    <a href="/" className="text-cyan-400 hover:underline font-medium text-sm">← Back to CortexPlay</a>
                </div>
            </div>
        </main>
    );
};

export default Contact;

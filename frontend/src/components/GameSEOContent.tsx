import React from 'react';

interface GameSEOContentProps {
    title: string;
    sections: {
        heading: string;
        content: string;
    }[];
    keywords?: string[];
}

const GameSEOContent: React.FC<GameSEOContentProps> = ({ title, sections, keywords }) => {
    return (
        <article className="w-full max-w-2xl mx-auto mt-16 mb-8 px-4">
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-12" />

            <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-8 tracking-tight">
                About {title}
            </h2>

            <div className="space-y-8">
                {sections.map((section, index) => (
                    <section key={index}>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">{section.heading}</h3>
                        <p className="text-slate-400 leading-relaxed text-[15px]">{section.content}</p>
                    </section>
                ))}
            </div>

            {/* Keywords as subtle tag pills */}
            {keywords && keywords.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                    {keywords.map((keyword, i) => (
                        <span
                            key={i}
                            className="text-xs font-medium text-slate-500 bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-1"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            )}

            {/* Bottom divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-12" />
        </article>
    );
};

export default GameSEOContent;

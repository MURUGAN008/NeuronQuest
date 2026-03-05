import React from "react";
import type { QuestionData } from "./GameData";

interface BubbleProps {
    item: QuestionData;
    handleClick: (id: number) => void;
    selectedOrder: number[];
    roundState: 'START' | 'PLAYING' | 'RESULT' | 'GAME_OVER';
}

const Bubble = ({ item, handleClick, selectedOrder, roundState }: BubbleProps) => {
    // Find the position chosen by the user
    const orderIndex = selectedOrder.indexOf(item.id);
    const chosenIndex = orderIndex !== -1 ? orderIndex + 1 : null;

    // Check if the chosen index is correct
    const isChosenIndexCorrect = chosenIndex === item.sortedIndex;

    // Determine colors based on state
    let bgClass = "glass-panel text-slate-100 hover:border-cyan-500/50 glass-panel-hover"; // Default unselected

    if (roundState === 'PLAYING') {
        if (chosenIndex !== null) {
            bgClass = "bg-cyan-900/60 border-cyan-400 text-cyan-50 neon-glow-cyan scale-[0.98]"; // Selected
        }
    } else if (roundState === 'RESULT') {
        if (isChosenIndexCorrect) {
            bgClass = "bg-emerald-900/60 border-emerald-400 text-emerald-50 neon-glow-emerald"; // Correct!
        } else {
            bgClass = "bg-rose-900/60 border-rose-400 text-rose-50 neon-glow-rose"; // Wrong / Missed
        }
    }

    const handleOnClick = () => {
        handleClick(item.id);
    };

    return (
        <div
            className={`relative w-40 h-40 border transition-all duration-300 ${bgClass} flex flex-col justify-center items-center rounded-2xl cursor-pointer select-none`}
            onClick={handleOnClick}
        >
            <span className="text-3xl font-extrabold mb-1 tracking-tight drop-shadow-md">{item.expression}</span>
            <span className={`text-sm font-semibold mt-1 ${roundState === 'RESULT' ? 'opacity-100' : 'opacity-70'}`}>
                {roundState === 'RESULT' ? `= ${item.value}` : (chosenIndex === null ? 'Tap to order' : '')}
            </span>

            {/* Display Badge (Show if selected in PLAYING, always show sortedIndex in RESULT) */}
            {(chosenIndex !== null || roundState === 'RESULT') && (
                <div className={`absolute -top-4 -right-4 w-11 h-11 rounded-full flex justify-center items-center border font-black text-xl z-10 transition-transform duration-300 drop-shadow-lg ${roundState === 'RESULT' ? 'scale-110' : ''}
                    ${roundState === 'RESULT' && !isChosenIndexCorrect ? 'bg-rose-600 text-white border-rose-300 neon-glow-rose' :
                        roundState === 'RESULT' && isChosenIndexCorrect ? 'bg-emerald-500 text-white border-emerald-200 neon-glow-emerald' :
                            'bg-cyan-600 text-white border-cyan-300 neon-glow-cyan'}
                `}>
                    {roundState === 'RESULT' ? item.sortedIndex : chosenIndex}
                </div>
            )}
        </div>
    );
};

export default React.memo(Bubble);
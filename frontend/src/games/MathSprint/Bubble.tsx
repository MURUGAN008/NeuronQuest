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
    let bgClass = "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md"; // Default unselected

    if (roundState === 'PLAYING') {
        if (chosenIndex !== null) {
            bgClass = "bg-blue-50 border-blue-400 text-blue-900 shadow-sm scale-95"; // Selected
        }
    } else if (roundState === 'RESULT') {
        if (isChosenIndexCorrect) {
            bgClass = "bg-green-500 border-green-600 text-white shadow-md"; // Correct!
        } else {
            bgClass = "bg-red-500 border-red-600 text-white shadow-md"; // Wrong / Missed
        }
    }

    const handleOnClick = () => {
        handleClick(item.id);
    };

    return (
        <div
            className={`relative w-40 h-40 border-2 ${bgClass} flex flex-col justify-center items-center rounded-2xl cursor-pointer transition-all duration-300 select-none shadow-sm`}
            onClick={handleOnClick}
        >
            <span className="text-3xl font-extrabold mb-1 tracking-tight">{item.expression}</span>
            <span className="text-sm font-semibold opacity-90 mt-1">
                {roundState === 'RESULT' ? `= ${item.value}` : (chosenIndex === null ? 'Tap to order' : '')}
            </span>

            {/* Display Badge (Show if selected in PLAYING, always show sortedIndex in RESULT) */}
            {(chosenIndex !== null || roundState === 'RESULT') && (
                <div className={`absolute -top-4 -right-4 w-11 h-11 rounded-full flex justify-center items-center border-2 font-black text-xl z-10 transition-transform duration-300 ${roundState === 'RESULT' ? 'scale-110' : ''}
                    ${roundState === 'RESULT' && !isChosenIndexCorrect ? 'bg-white text-red-600 border-red-200 shadow-md' :
                        roundState === 'RESULT' && isChosenIndexCorrect ? 'bg-white text-green-600 border-green-200 shadow-md' :
                            'bg-blue-600 text-white border-blue-700 shadow'}
                `}>
                    {roundState === 'RESULT' ? item.sortedIndex : chosenIndex}
                </div>
            )}
        </div>
    );
};

export default React.memo(Bubble);
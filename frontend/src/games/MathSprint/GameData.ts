export type QuestionData = {
    id: number;
    expression: string;
    value: number;
    sortedIndex: number;
};

/**
 * Generates a set of random math problems.
 * @param count Number of bubbles/questions to generate.
 * @param level Current difficulty level (1-10) to scale the complexity and use shortcuts.
 * @returns Array of QuestionData objects
 */
export const generateQuestions = (level: number, count: number): QuestionData[] => {
    const questions: { id: number; expression: string; value: number }[] = [];

    // Higher levels use larger numbers or introduce multiplication shortcuts
    for (let i = 0; i < count; i++) {
        let expression = "";
        let value = 0;

        // Let's create some randomness based on level
        const type = Math.floor(Math.random() * 4); // 0: add, 1: sub, 2: mult, 3: shortcut

        if (level <= 3) {
            // Basic addition and subtraction (1 to 20)
            const a = Math.floor(Math.random() * (10 + level * 5)) + 1;
            const b = Math.floor(Math.random() * (10 + level * 5)) + 1;
            if (type % 2 === 0) {
                expression = `${a} + ${b}`;
                value = a + b;
            } else {
                expression = `${a + b} - ${b}`; // Guarantee positive results for early levels
                value = a;
            }
        }
        else if (level <= 6) {
            // Introduce shortcuts (close to 100, x11) and harder add/sub
            if (type === 0) {
                // Near 100 addition
                const a = 100 - Math.floor(Math.random() * 5);
                const b = Math.floor(Math.random() * 20) + 5;
                expression = `${a} + ${b}`;
                value = a + b;
            } else if (type === 1) {
                // Near 100 subtraction
                const a = 100 + Math.floor(Math.random() * 5);
                const b = Math.floor(Math.random() * 20) + 5;
                expression = `${a} - ${b}`;
                value = a - b;
            } else {
                // Multiply by 11 or 5
                const a = Math.floor(Math.random() * 10) + 12;
                const multiplier = Math.random() > 0.5 ? 11 : 5;
                expression = `${a} × ${multiplier}`;
                value = a * multiplier;
            }
        }
        else {
            // Advanced shortcuts (squares ending in 5, tricky multiplication)
            if (type === 0) {
                // Squares ending in 5
                const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
                const a = tens * 10 + 5;
                expression = `${a}²`;
                value = a * a;
            } else if (type === 1) {
                // Multiply by 25
                const a = Math.floor(Math.random() * 10) * 4 + 4; // multiples of 4
                expression = `${a} × 25`;
                value = a * 25;
            } else if (type === 2) {
                // Difference of squares (a^2 - b^2) simple
                const a = Math.floor(Math.random() * 10) + 10;
                const b = Math.floor(Math.random() * 5) + 1;
                expression = `${a}² - ${b}²`;
                value = (a - b) * (a + b);
            } else {
                // Tricky subtraction near 1000
                const a = 1000 - Math.floor(Math.random() * 5);
                const b = Math.floor(Math.random() * 50) + 15;
                expression = `${a} - ${b}`;
                value = a - b;
            }
        }

        // Avoid adding exact duplicate values if possible
        if (questions.some(q => q.value === value)) {
            i--; // try again
            continue;
        }

        questions.push({ id: i + 1, expression, value });
    }

    // Assign sortedIndex based on the evaluated values
    const sortedVals = [...questions].sort((a, b) => a.value - b.value);

    const finalData: QuestionData[] = questions.map(q => {
        const sortedIndex = sortedVals.findIndex(v => v.id === q.id) + 1;
        return {
            ...q,
            sortedIndex
        };
    });

    return finalData;
}

// 2048 Logic and Type Definitions

export type Grid = (number | null)[][];
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface LevelConfig {
    size: number;
    winScore: number;
    obstacles: number;
}

// Level scaling is extremely gradual
// Level 1: 5x5 Grid (Very Easy, lots of space)
// Level 2: 5x5 Grid with 1 Obstacle
// ...
// Level 5: 4x4 Grid (Standard 2048)
// Level 10: 4x4 Grid with 2 Obstacles
// Level 15+: 3x3 Grid (Very Hard)
export const getLevelConfig = (level: number): LevelConfig => {
    if (level < 3) return { size: 5, winScore: 512, obstacles: 0 };
    if (level < 5) return { size: 5, winScore: 1024, obstacles: 1 };

    if (level < 8) return { size: 4, winScore: 1024, obstacles: 0 };
    if (level < 10) return { size: 4, winScore: 2048, obstacles: 0 };
    if (level < 12) return { size: 4, winScore: 2048, obstacles: 1 };

    if (level < 15) return { size: 4, winScore: 4096, obstacles: 2 };

    // Endgame levels (Very hard)
    return { size: 3, winScore: 2048, obstacles: 0 };
};

export const createEmptyGrid = (size: number): Grid => {
    return Array.from({ length: size }, () => Array(size).fill(null));
};

// Values less than 0 represent obstacles
export const OBSTACLE = -1;

export const addObstacles = (grid: Grid, count: number): Grid => {
    const newGrid = [...grid.map(row => [...row])];
    let added = 0;
    const size = grid.length;
    let safeGuard = 0;

    while (added < count && safeGuard < 100) {
        safeGuard++;
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        // Don't place obstacles in the absolute corners if possible to avoid instant unplayable traps
        const isCorner = (r === 0 || r === size - 1) && (c === 0 || c === size - 1);

        if (newGrid[r][c] === null && !isCorner) {
            newGrid[r][c] = OBSTACLE;
            added++;
        }
    }
    return newGrid;
};

export const addRandomTile = (grid: Grid): Grid => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === null) {
                emptyCells.push({ r, c });
            }
        }
    }

    if (emptyCells.length === 0) return grid;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

    const newGrid = grid.map(row => [...row]);
    newGrid[randomCell.r][randomCell.c] = newValue;
    return newGrid;
};

// --- Movement Logic ---

const mergeLine = (line: (number | null)[]): { newLine: (number | null)[]; scoreAdded: number } => {
    // 1. Filter out nulls (obstacles should not be in 'line' passed to this function)
    const nonNulls: number[] = [];
    for (const val of line) {
        if (val !== null) nonNulls.push(val);
    }

    // 2. Merge identical adjacent numbers
    let scoreAdded = 0;
    const mergedLine: (number | null)[] = [];
    let skipNext = false;

    for (let i = 0; i < nonNulls.length; i++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        const current = nonNulls[i];
        const next = nonNulls[i + 1];

        if (current === next && current !== undefined) { // current !== undefined to satisfy TS, current is always a number here
            const mergedVal = current * 2;
            mergedLine.push(mergedVal);
            scoreAdded += mergedVal;
            skipNext = true;
        } else {
            mergedLine.push(current);
        }
    }

    // 3. Pad with nulls to original length of the segment
    const newLine = [...mergedLine];
    while (newLine.length < line.length) {
        newLine.push(null);
    }

    return { newLine, scoreAdded };
};

// Helper for immovable obstacles shifting
const shiftImmovable = (line: (number | null)[]): { newLine: (number | null)[]; scoreAdded: number } => {
    let scoreAdded = 0;
    const size = line.length;
    let newLine = new Array(size).fill(null);

    // Split the line by obstacles
    let segments: (number | null)[][] = [];
    let currentSegment: (number | null)[] = [];
    let obstaclePositions: number[] = [];

    line.forEach((val, i) => {
        if (val === OBSTACLE) {
            segments.push(currentSegment);
            currentSegment = [];
            obstaclePositions.push(i);
        } else {
            currentSegment.push(val);
        }
    });
    segments.push(currentSegment);

    // Merge each segment independently
    let newSegments = segments.map(seg => {
        const { newLine: merged, scoreAdded: sa } = mergeLine(seg);
        scoreAdded += sa;
        return merged;
    });

    // Reassemble
    let pointer = 0;
    let segmentIndex = 0;

    for (let i = 0; i < size; i++) {
        if (obstaclePositions.includes(i)) {
            newLine[i] = OBSTACLE;
            segmentIndex++;
            pointer = 0;
        } else {
            // we know newSegments[segmentIndex] has the exact same length as the space between obstacles
            newLine[i] = newSegments[segmentIndex][pointer];
            pointer++;
        }
    }

    return { newLine, scoreAdded };
};


export const moveGrid = (grid: Grid, direction: Direction): { newGrid: Grid; scoreAdded: number; moved: boolean } => {
    const size = grid.length;
    let newGrid = grid.map(row => [...row]);
    let totalScoreAdded = 0;
    let moved = false;

    // Helper to extract a line based on direction
    const extractLine = (index: number): (number | null)[] => {
        const line = [];
        for (let i = 0; i < size; i++) {
            if (direction === 'LEFT') line.push(grid[index][i]);
            if (direction === 'RIGHT') line.push(grid[index][size - 1 - i]);
            if (direction === 'UP') line.push(grid[i][index]);
            if (direction === 'DOWN') line.push(grid[size - 1 - i][index]);
        }
        return line;
    };

    // Helper to put the line back
    const insertLine = (index: number, line: (number | null)[]) => {
        for (let i = 0; i < size; i++) {
            if (direction === 'LEFT') newGrid[index][i] = line[i];
            if (direction === 'RIGHT') newGrid[index][size - 1 - i] = line[i];
            if (direction === 'UP') newGrid[i][index] = line[i];
            if (direction === 'DOWN') newGrid[size - 1 - i][index] = line[i];
        }
    };

    for (let i = 0; i < size; i++) {
        const originalLine = extractLine(i);
        const { newLine, scoreAdded } = shiftImmovable(originalLine);

        insertLine(i, newLine);
        totalScoreAdded += scoreAdded;

        // Check if anything actually moved
        for (let j = 0; j < size; j++) {
            if (originalLine[j] !== newLine[j]) {
                moved = true;
            }
        }
    }

    return { newGrid, scoreAdded: totalScoreAdded, moved };
};

export const checkGameOver = (grid: Grid): boolean => {
    const size = grid.length;

    // 1. Any empty spaces?
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === null) return false;
        }
    }

    // 2. Any adjacent merges possible?
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const current = grid[r][c];
            if (current === OBSTACLE) continue;

            // Check right
            if (c < size - 1 && grid[r][c + 1] === current) return false;
            // Check down
            if (r < size - 1 && grid[r + 1][c] === current) return false;
        }
    }

    return true; // No empty spaces and no adjacent matches
};

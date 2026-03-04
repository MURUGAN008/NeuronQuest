export type Point = { x: number, y: number };

export type MazeConfig = {
    width: number;
    height: number;
    // We store walls as sets of "x,y-direction" strings for fast lookup during gameplay.
    // e.g. "0,0-right" means there is a wall between (0,0) and (1,0).
    horizontalWalls: Set<string>; // Walls between (x,y) and (x,y+1)
    verticalWalls: Set<string>;   // Walls between (x,y) and (x+1,y)
    start: Point;
    key: Point;
    door: Point;
};

// Start is always bottom right per user diagram
const getStartPoint = (w: number, h: number): Point => ({ x: w - 1, y: h - 1 });

/**
 * Procedurally generates a solvable maze using a randomized Depth-First Search.
 */
export const generateMaze = (width: number, height: number): MazeConfig => {
    // 1. Start with a grid full of walls.
    const verticalWalls = new Set<string>();
    const horizontalWalls = new Set<string>();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x < width - 1) verticalWalls.add(`${x},${y}`);
            if (y < height - 1) horizontalWalls.add(`${x},${y}`);
        }
    }

    // 2. Perform Randomized DFS to carve a perfect maze (ensure solvability everywhere)
    const visited = Array.from({ length: height }, () => Array(width).fill(false));

    // Pick a random starting point for the generation algorithm itself
    const startX = Math.floor(Math.random() * width);
    const startY = Math.floor(Math.random() * height);

    const carve = (x: number, y: number) => {
        visited[y][x] = true;

        // Shuffle directions: 0=UP(0,-1), 1=RIGHT(1,0), 2=DOWN(0,1), 3=LEFT(-1,0)
        const dirs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

        for (const dir of dirs) {
            let nx = x, ny = y;
            if (dir === 0) ny -= 1;
            else if (dir === 1) nx += 1;
            else if (dir === 2) ny += 1;
            else if (dir === 3) nx -= 1;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
                // We are moving into an unvisited cell, knock down the wall between (x,y) and (nx,ny)
                if (dir === 0) horizontalWalls.delete(`${nx},${ny}`); // moving up, knock down horizontal below ny
                else if (dir === 1) verticalWalls.delete(`${x},${y}`); // moving right, knock down vertical right of x
                else if (dir === 2) horizontalWalls.delete(`${x},${y}`); // moving down, knock down horizontal below y
                else if (dir === 3) verticalWalls.delete(`${nx},${ny}`); // moving left, knock down vertical right of nx

                carve(nx, ny);
            }
        }
    }

    carve(startX, startY);

    // 3. Occasionally knock down some extra walls to create loops, making it harder to purely hand-on-wall solve
    const extraWallsToRemove = Math.floor((width * height) * 0.1);
    const vertArray = Array.from(verticalWalls);
    for (let i = 0; i < extraWallsToRemove && vertArray.length > 0; i++) {
        const idx = Math.floor(Math.random() * vertArray.length);
        verticalWalls.delete(vertArray[idx]);
        vertArray.splice(idx, 1);
    }
    const horizArray = Array.from(horizontalWalls);
    for (let i = 0; i < extraWallsToRemove && horizArray.length > 0; i++) {
        const idx = Math.floor(Math.random() * horizArray.length);
        horizontalWalls.delete(horizArray[idx]);
        horizArray.splice(idx, 1);
    }

    // 4. Place objectives
    const start = getStartPoint(width, height);

    // Pick a random grid coordinate not overlapping other objectives
    const getRandomDistinctPoint = (forbidden: Point[]): Point => {
        let p: Point;
        do {
            p = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
        } while (forbidden.some(f => f.x === p.x && f.y === p.y));
        return p;
    };

    // The key should be randomly placed
    const key = getRandomDistinctPoint([start]);

    // The door should ideally be somewhat far away from the start, we can just randomly place it for now
    const door = getRandomDistinctPoint([start, key]);

    return {
        width,
        height,
        verticalWalls,
        horizontalWalls,
        start,
        key,
        door
    };
};

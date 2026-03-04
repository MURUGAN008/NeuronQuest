export type TileType = 'straight' | 'turnRight' | 'turnLeft' | 'empty';

export type GridCell = {
    type: TileType;
    rotation: number; // 0 (UP), 1 (RIGHT), 2 (DOWN), 3 (LEFT)
    isPath?: boolean; // internal to verify it's part of the answer
};

export type LevelConfig = {
    grid: GridCell[][];
    width: number;
    height: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

const dx = [0, 1, 0, -1]; // UP, RIGHT, DOWN, LEFT
const dy = [-1, 0, 1, 0];

export const generateLevel = (width: number, height: number): LevelConfig => {

    // We want to force start at (0, 0) and end at (width-1, height-1)
    const tryGenerate = (): GridCell[][] | null => {
        const grid: GridCell[][] = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => ({ type: 'empty', rotation: 0 }))
        );
        const visited = Array.from({ length: height }, () => Array(width).fill(false));

        let foundPath = false;

        const dfs = (x: number, y: number, h: number) => {
            if (foundPath) return;
            if (x === width - 1 && y === height - 1) {
                // Reached the end. Must be able to exit RIGHT (1)
                if (h !== 3) { // Cannot exit right if coming from right (heading left)
                    if (h === 1) {
                        grid[y][x] = { type: 'straight', rotation: 1, isPath: true };
                    } else if (h === 0) {
                        grid[y][x] = { type: 'turnRight', rotation: 0, isPath: true };
                    } else if (h === 2) {
                        grid[y][x] = { type: 'turnLeft', rotation: 2, isPath: true };
                    }
                    foundPath = true;
                }
                return;
            }

            visited[y][x] = true;

            const actions = [
                { type: 'straight', new_h: h },
                { type: 'turnRight', new_h: (h + 1) % 4 },
                { type: 'turnLeft', new_h: (h + 3) % 4 }
            ];

            // Shuffle actions to create random winding paths
            actions.sort(() => Math.random() - 0.5);

            for (const action of actions) {
                if (foundPath) break;

                const nx = x + dx[action.new_h];
                const ny = y + dy[action.new_h];

                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
                    grid[y][x] = { type: action.type as TileType, rotation: h, isPath: true };
                    dfs(nx, ny, action.new_h);
                    if (!foundPath) {
                        grid[y][x] = { type: 'empty', rotation: 0 };
                    }
                }
            }

            visited[y][x] = false;
        };

        // Start at 0,0 going RIGHT (1)
        dfs(0, 0, 1);

        if (foundPath) return grid;
        return null;
    };

    let pathGrid: GridCell[][] | null = null;
    while (!pathGrid) {
        pathGrid = tryGenerate();
    }

    // Fill red herrings and scramble rotations
    // Instead of random noise, actively try to build connected branches off the main path
    const branchVisited = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => pathGrid![y][x].isPath || false));
    const tileTypes: TileType[] = ['straight', 'turnRight', 'turnLeft'];

    const buildBranch = (x: number, y: number, length: number) => {
        if (length === 0) return;

        let cx = x;
        let cy = y;

        for (let i = 0; i < length; i++) {
            // Pick a random unvisited neighbor
            const neighbors = [];
            for (let d = 0; d < 4; d++) {
                const nx = cx + dx[d];
                const ny = cy + dy[d];
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !branchVisited[ny][nx]) {
                    neighbors.push({ x: nx, y: ny });
                }
            }

            if (neighbors.length === 0) break; // Trapped

            // Pick a random neighbor and carve a path to it
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            branchVisited[next.y][next.x] = true;
            pathGrid![next.y][next.x].type = tileTypes[Math.floor(Math.random() * tileTypes.length)];

            cx = next.x;
            cy = next.y;
        }
    };

    // For every tile on the main path, occasionally build a confusing branch outwards
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (pathGrid[y][x].isPath && Math.random() < 0.3) {
                // Build a contiguous wrong turn off this tile
                buildBranch(x, y, Math.floor(Math.random() * 4) + 1);
            }
        }
    }

    // Fill the remaining empty spots with random noise and scramble everything
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (pathGrid[y][x].type === 'empty') {
                // 30% chance to leave it empty for aesthetic spacing, otherwise clutter it
                if (Math.random() > 0.3) {
                    pathGrid[y][x].type = tileTypes[Math.floor(Math.random() * tileTypes.length)];
                }
            }

            // Scramble rotation for ALL tiles EXCEPT empty, guaranteeing the puzzle isn't solved off the bat
            if (pathGrid[y][x].type !== 'empty') {
                pathGrid[y][x].rotation = Math.floor(Math.random() * 4);
            }
        }
    }

    return {
        grid: pathGrid as GridCell[][],
        width,
        height,
        startX: 0,
        startY: 0,
        endX: width - 1,
        endY: height - 1
    };
};

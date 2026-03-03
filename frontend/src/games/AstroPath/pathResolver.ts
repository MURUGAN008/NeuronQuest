import type { GridCell, LevelConfig } from "./PathGenerator";

const dx = [0, 1, 0, -1]; // UP, RIGHT, DOWN, LEFT
const dy = [-1, 0, 1, 0];

export interface PathNode {
    x: number;
    y: number;
    entry_h: number;
    exit_h: number;
}

export const checkWin = (grid: GridCell[][], config: LevelConfig): PathNode[] | null => {
    let x = config.startX;
    let y = config.startY;
    let h = 1; // Initially traveling RIGHT into startX, startY
    const path: PathNode[] = [];

    // To prevent infinite loops dynamically tracing, set max steps
    let steps = 0;
    while (steps < config.width * config.height * 2) {
        const cell = grid[y][x];
        if (cell.type === 'empty') return null;

        let exit_h = -1;
        const entry_h = h;

        // Determine exit heading based on cell type and rotation rules
        if (cell.type === 'straight') {
            if (h === cell.rotation) {
                exit_h = h;
            } else {
                return null; // Path breaks (e.g. hit the side of a straight tile)
            }
        } else if (cell.type === 'turnRight') {
            if (h === cell.rotation) {
                exit_h = (h + 1) % 4;
            } else {
                return null;
            }
        } else if (cell.type === 'turnLeft') {
            if (h === cell.rotation) {
                exit_h = (h + 3) % 4;
            } else {
                return null;
            }
        }

        if (exit_h === -1) return null;

        path.push({ x, y, entry_h, exit_h });

        // If we reached the end cell perfectly and exit_h === 1 (RIGHT into Planet)
        if (x === config.endX && y === config.endY && exit_h === 1) {
            return path;
        }

        // Move to next cell along new heading
        x += dx[exit_h];
        y += dy[exit_h];
        h = exit_h;

        // Avoid bounds failure
        if (x < 0 || x >= config.width || y < 0 || y >= config.height) {
            return null;
        }

        steps++;
    }

    return null;
}

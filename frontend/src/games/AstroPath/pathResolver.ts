import type { GridCell, LevelConfig } from "./PathGenerator";

const dx = [0, 1, 0, -1]; // UP, RIGHT, DOWN, LEFT
const dy = [-1, 0, 1, 0];

export const checkWin = (grid: GridCell[][], config: LevelConfig): boolean => {
    let x = config.startX;
    let y = config.startY;
    let h = 1; // Initially traveling RIGHT into startX, startY

    // To prevent infinite loops dynamically tracing, set max steps
    let steps = 0;
    while (steps < config.width * config.height * 2) {
        const cell = grid[y][x];
        if (cell.type === 'empty') return false;

        let exit_h = -1;

        // Determine exit heading based on cell type and rotation rules
        if (cell.type === 'straight') {
            if (h === cell.rotation) {
                exit_h = h;
            } else {
                return false; // Path breaks (e.g. hit the side of a straight tile)
            }
        } else if (cell.type === 'turnRight') {
            if (h === cell.rotation) {
                exit_h = (h + 1) % 4;
            } else {
                return false;
            }
        } else if (cell.type === 'turnLeft') {
            if (h === cell.rotation) {
                exit_h = (h + 3) % 4;
            } else {
                return false;
            }
        }

        if (exit_h === -1) return false;

        // If we reached the end cell perfectly and exit_h === 1 (RIGHT into Planet)
        if (x === config.endX && y === config.endY && exit_h === 1) {
            return true;
        }

        // Move to next cell along new heading
        x += dx[exit_h];
        y += dy[exit_h];
        h = exit_h;

        // Avoid bounds failure
        if (x < 0 || x >= config.width || y < 0 || y >= config.height) {
            return false;
        }

        steps++;
    }

    return false;
}

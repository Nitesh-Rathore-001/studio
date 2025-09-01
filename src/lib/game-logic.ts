import { type Player } from "./types";

export function checkWin(board: Player[][], player: Player, winCondition: number) {
  const size = board.length;

  // Check rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winCondition; c++) {
      let match = true;
      const cells: number[][] = [];
      for (let i = 0; i < winCondition; i++) {
        if (board[r][c + i] !== player) {
          match = false;
          break;
        }
        cells.push([r, c+i]);
      }
      if (match) return { winner: player, winningCells: cells };
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winCondition; r++) {
      let match = true;
      const cells: number[][] = [];
      for (let i = 0; i < winCondition; i++) {
        if (board[r + i][c] !== player) {
          match = false;
          break;
        }
        cells.push([r+i, c]);
      }
      if (match) return { winner: player, winningCells: cells };
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let r = 0; r <= size - winCondition; r++) {
    for (let c = 0; c <= size - winCondition; c++) {
      let match = true;
      const cells: number[][] = [];
      for (let i = 0; i < winCondition; i++) {
        if (board[r + i][c + i] !== player) {
          match = false;
          break;
        }
        cells.push([r+i, c+i]);
      }
      if (match) return { winner: player, winningCells: cells };
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let r = 0; r <= size - winCondition; r++) {
    for (let c = winCondition - 1; c < size; c++) {
      let match = true;
      const cells: number[][] = [];
      for (let i = 0; i < winCondition; i++) {
        if (board[r + i][c - i] !== player) {
          match = false;
          break;
        }
        cells.push([r+i, c-i]);
      }
      if (match) return { winner: player, winningCells: cells };
    }
  }

  return null;
}

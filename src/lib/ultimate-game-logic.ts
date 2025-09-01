import { type Player } from "./types";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkSmallWin(board: Player[]): Player {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function checkUltimateWin(mainBoard: Player[]): Player {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const valA = mainBoard[a];
        const valB = mainBoard[b];
        const valC = mainBoard[c];

        if (valA && valA !== 'D' && valA === valB && valA === valC) {
            return valA;
        }
    }
    return null;
}

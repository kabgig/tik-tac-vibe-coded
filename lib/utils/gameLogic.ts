import { Board, Player } from '../types/game';

// Check all possible winning combinations
export function checkWinner(board: Board): Player | null {
  const winPatterns = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }

  return null;
}

// Check if the board is full (draw condition)
export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

// Get all available cell indices
export function getAvailableMoves(board: Board): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}

// Generate a random 5-digit promo code
export function generatePromoCode(): string {
  const code = Math.floor(10000 + Math.random() * 90000);
  return code.toString();
}

'use client';

import { useEffect } from 'react';
import { Board } from '../types/game';
import { getAvailableMoves } from '../utils/gameLogic';

export function useComputerPlayer(
  board: Board,
  currentPlayer: string,
  gameStatus: string,
  makeMove: (index: number) => boolean
) {
  useEffect(() => {
    // Computer plays as 'O'
    if (currentPlayer === 'O' && gameStatus === 'playing') {
      // Delay for better UX
      const timer = setTimeout(() => {
        const availableMoves = getAvailableMoves(board);
        
        if (availableMoves.length > 0) {
          // Make it easy to win: just pick a random available move
          const randomIndex = Math.floor(Math.random() * availableMoves.length);
          const move = availableMoves[randomIndex];
          makeMove(move);
        }
      }, 500); // 500ms delay to feel more natural

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameStatus, makeMove]);
}

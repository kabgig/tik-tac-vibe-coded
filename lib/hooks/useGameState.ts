'use client';

import { useState, useCallback } from 'react';
import { GameState, Player, GameStatus } from '../types/game';
import { checkWinner, isBoardFull } from '../utils/gameLogic';

const initialBoard = Array(9).fill(null);

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard,
    currentPlayer: 'X',
    status: 'idle',
    winner: null,
  });

  const makeMove = useCallback((index: number): boolean => {
    // Validate move
    if (
      gameState.board[index] !== null ||
      gameState.status === 'won' ||
      gameState.status === 'lost' ||
      gameState.status === 'draw'
    ) {
      return false;
    }

    // Create new board with the move
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    // Check for winner
    const winner = checkWinner(newBoard);
    if (winner) {
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        status: winner === 'X' ? 'won' : 'lost',
        winner,
      });
      return true;
    }

    // Check for draw
    if (isBoardFull(newBoard)) {
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        status: 'draw',
        winner: null,
      });
      return true;
    }

    // Switch player
    const nextPlayer: Player = gameState.currentPlayer === 'X' ? 'O' : 'X';
    setGameState({
      board: newBoard,
      currentPlayer: nextPlayer,
      status: 'playing',
      winner: null,
    });

    return true;
  }, [gameState]);

  const startGame = useCallback(() => {
    setGameState({
      board: initialBoard,
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: initialBoard,
      currentPlayer: 'X',
      status: 'idle',
      winner: null,
    });
  }, []);

  return {
    gameState,
    makeMove,
    startGame,
    resetGame,
  };
}

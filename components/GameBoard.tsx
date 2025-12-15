'use client';

import { Box, SimpleGrid } from '@chakra-ui/react';
import { Board as BoardType } from '@/lib/types/game';
import { GameCell } from './GameCell';

interface GameBoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

export function GameBoard({ board, onCellClick, disabled = false }: GameBoardProps) {
  return (
    <Box>
      <SimpleGrid
        columns={3}
        spacing={4}
        maxW="400px"
        mx="auto"
        p={4}
      >
        {board.map((value, index) => (
          <GameCell
            key={index}
            value={value}
            onClick={() => onCellClick(index)}
            disabled={disabled || value !== null}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

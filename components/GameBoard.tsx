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
    <Box w="100%" maxW="400px" mx="auto">
      <SimpleGrid
        columns={3}
        spacing={{ base: 2, sm: 3, md: 4 }}
        w="100%"
        px={{ base: 2, sm: 4 }}
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

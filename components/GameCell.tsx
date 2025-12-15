'use client';

import { Button } from '@chakra-ui/react';
import { CellValue } from '@/lib/types/game';

interface GameCellProps {
  value: CellValue;
  onClick: () => void;
  disabled?: boolean;
}

export function GameCell({ value, onClick, disabled = false }: GameCellProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      h="120px"
      w="120px"
      fontSize="4xl"
      fontWeight="bold"
      bg={value ? 'white' : 'pink.50'}
      color={value === 'X' ? 'pink.500' : 'brand.500'}
      borderWidth="3px"
      borderColor="pink.200"
      _hover={{
        bg: value ? 'white' : 'pink.100',
        borderColor: 'pink.300',
        transform: 'scale(1.02)',
      }}
      _active={{
        transform: 'scale(0.98)',
      }}
      transition="all 0.2s"
      _disabled={{
        opacity: 0.7,
        cursor: 'not-allowed',
      }}
      shadow="md"
    >
      {value}
    </Button>
  );
}

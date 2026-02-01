'use client';

import { Button, Box } from '@chakra-ui/react';
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
      w="100%"
      h="0"
      pb="100%"
      position="relative"
      fontSize={{ base: '3xl', sm: '4xl' }}
      fontWeight="bold"
      bg={value ? 'white' : 'pink.50'}
      color={value === 'X' ? 'pink.500' : 'brand.500'}
      borderWidth="3px"
      borderColor="pink.200"
      display="flex"
      alignItems="center"
      justifyContent="center"
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
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        {value}
      </Box>
    </Button>
  );
}

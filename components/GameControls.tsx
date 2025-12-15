'use client';

import { Button, HStack, Text, Icon } from '@chakra-ui/react';
import { FaRedo } from 'react-icons/fa';

interface GameControlsProps {
  onReset: () => void;
  currentPlayer: string;
  gameStatus: string;
}

export function GameControls({
  onReset,
  currentPlayer,
  gameStatus,
}: GameControlsProps) {
  const getStatusText = () => {
    if (gameStatus === 'idle') return 'Готовы начать?';
    if (gameStatus === 'playing') {
      return currentPlayer === 'X' ? 'Ваш ход (X)' : 'Ход компьютера (O)...';
    }
    if (gameStatus === 'won') return 'Вы победили! 🎉';
    if (gameStatus === 'lost') return 'Победил компьютер';
    if (gameStatus === 'draw') return 'Ничья!';
    return '';
  };

  const getStatusColor = () => {
    if (gameStatus === 'won') return 'pink.500';
    if (gameStatus === 'lost') return 'lavender.500';
    if (gameStatus === 'playing') {
      return currentPlayer === 'X' ? 'pink.500' : 'brand.500';
    }
    return 'gray.600';
  };

  return (
    <HStack spacing={4} justify="center" w="full">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={getStatusColor()}
        textAlign="center"
      >
        {getStatusText()}
      </Text>

      {gameStatus !== 'idle' && (
        <Button
          onClick={onReset}
          leftIcon={<Icon as={FaRedo} />}
          size="sm"
          variant="outline"
          colorScheme="pink"
        >
          Новая игра
        </Button>
      )}
    </HStack>
  );
}

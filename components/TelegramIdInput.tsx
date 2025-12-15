'use client';

import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FaTelegram } from 'react-icons/fa';

interface TelegramIdInputProps {
  onSubmit: (telegramId: string) => void;
}

export function TelegramIdInput({ onSubmit }: TelegramIdInputProps) {
  const [telegramId, setTelegramId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!telegramId.trim()) {
      setError('Пожалуйста, введите ваш Telegram ID');
      return;
    }

    if (telegramId.trim().length < 5) {
      setError('Telegram ID должен содержать минимум 5 символов');
      return;
    }

    setError('');
    onSubmit(telegramId.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      p={8}
      bg="white"
      borderRadius="2xl"
      shadow="xl"
      borderWidth="2px"
      borderColor="pink.100"
    >
      <VStack spacing={6}>
        <Icon as={FaTelegram} boxSize={16} color="brand.500" />
        
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="brand.600"
          textAlign="center"
        >
          Добро пожаловать в игру!
        </Text>

        <Text fontSize="md" color="gray.600" textAlign="center">
          Выиграйте и получите промокод на скидку прямо в Telegram
        </Text>

        <FormControl>
          <FormLabel color="brand.600" fontWeight="semibold">
            Ваш Telegram ID
          </FormLabel>
          <Input
            placeholder="Например: @username или 123456789"
            value={telegramId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegramId(e.target.value)}
            onKeyPress={handleKeyPress}
            size="lg"
            variant="outline"
          />
          <FormHelperText color={error ? 'red.500' : 'gray.500'}>
            {error || 'Введите ваш Telegram username или числовой ID'}
          </FormHelperText>
        </FormControl>

        <Button
          onClick={handleSubmit}
          size="lg"
          w="full"
          colorScheme="pink"
          leftIcon={<Icon as={FaTelegram} />}
        >
          Начать игру
        </Button>
      </VStack>
    </Box>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Container, VStack, Heading, Text, Box } from '@chakra-ui/react';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { PromoCodeDisplay } from '@/components/PromoCodeDisplay';
import { GameOverModal } from '@/components/GameOverModal';
import { useGameState } from '@/lib/hooks/useGameState';
import { useComputerPlayer } from '@/lib/hooks/useComputerPlayer';
import { useTelegramWebApp } from '@/lib/hooks/useTelegramWebApp';
import { generatePromoCode } from '@/lib/utils/gameLogic';

export default function Home() {
  const [promoCode, setPromoCode] = useState<string>('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [userTracked, setUserTracked] = useState(false);

  const { user, webApp, isLoading } = useTelegramWebApp();
  const { gameState, makeMove, startGame, resetGame } = useGameState();

  // Computer player hook
  useComputerPlayer(
    gameState.board,
    gameState.currentPlayer,
    gameState.status,
    makeMove
  );

  // Track user in database when loaded
  useEffect(() => {
    const trackUser = async () => {
      if (user && !userTracked) {
        try {
          const response = await fetch('/api/users/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              userName: user.username,
              firstName: user.first_name,
              lastName: user.last_name,
            }),
          });
          
          const data = await response.json();
          if (data.success) {
            console.log('User tracked:', data.exists ? 'existing' : 'new');
            setUserTracked(true);
          }
        } catch (error) {
          console.error('Failed to track user:', error);
        }
      }
    };

    trackUser();
  }, [user, userTracked]);

  // Auto-start game when user is loaded
  useEffect(() => {
    if (user && gameState.status === 'idle') {
      startGame();
    }
  }, [user, gameState.status, startGame]);

  // Handle game over states
  useEffect(() => {
    const handleGameEnd = async () => {
      if (gameState.status === 'won' && user) {
        // Generate promo code
        const code = generatePromoCode();
        setPromoCode(code);

        // Trigger haptic feedback if available
        webApp?.HapticFeedback.notificationOccurred('success');

        // Send telegram message
        try {
          await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId: user.id.toString(),
              message: 'Победа! Промокод выдан:',
              promoCode: code,
            }),
          });
        } catch (error) {
          console.error('Failed to send Telegram message:', error);
        }

        // Show promo modal
        setShowPromoModal(true);
      } else if (gameState.status === 'lost' && user) {
        // Trigger haptic feedback if available
        webApp?.HapticFeedback.notificationOccurred('error');

        // Send telegram message
        try {
          await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId: user.id.toString(),
              message: 'Проигрыш',
            }),
          });
        } catch (error) {
          console.error('Failed to send Telegram message:', error);
        }

        // Show loss modal
        setShowLossModal(true);
      }
    };

    handleGameEnd();
  }, [gameState.status, user, webApp]);

  const handleCellClick = (index: number) => {
    // Only allow moves when it's player's turn (X)
    if (gameState.currentPlayer === 'X' && gameState.status === 'playing') {
      // Trigger haptic feedback on cell click
      webApp?.HapticFeedback.impactOccurred('light');
      makeMove(index);
    }
  };

  const handlePlayAgain = () => {
    setPromoCode('');
    setShowPromoModal(false);
    setShowLossModal(false);
    startGame();
  };

  const handleReset = () => {
    setPromoCode('');
    setShowPromoModal(false);
    setShowLossModal(false);
    resetGame();
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container maxW="container.md" py={8} minH="100vh">
        <VStack spacing={8} justify="center" minH="50vh">
          <Text fontSize="lg" color="gray.600">
            Загрузка...
          </Text>
        </VStack>
      </Container>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <Container maxW="container.md" py={8} minH="100vh">
        <VStack spacing={8} justify="center" minH="50vh">
          <Text fontSize="lg" color="red.500" textAlign="center">
            ⚠️ Пожалуйста, откройте игру из Telegram бота
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8} minH="100vh">
      <VStack spacing={8}>
        {/* Header */}
        <Box textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, pink.500, brand.500)"
            bgClip="text"
            mb={2}
          >
            Крестики-Нолики
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Привет, {user.first_name}! Выиграй и получи промокод! 🎁
          </Text>
        </Box>

        {/* Game */}
        <VStack spacing={6} w="full">
          {/* Game Controls */}
          <GameControls
            onReset={handleReset}
            currentPlayer={gameState.currentPlayer}
            gameStatus={gameState.status}
          />

          {/* Game Board */}
          <GameBoard
            board={gameState.board}
            onCellClick={handleCellClick}
            disabled={
              gameState.currentPlayer === 'O' ||
              gameState.status === 'won' ||
              gameState.status === 'lost' ||
              gameState.status === 'draw'
            }
          />

          {/* Draw message */}
          {gameState.status === 'draw' && (
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Ничья! Попробуйте ещё раз 🤝
            </Text>
          )}
        </VStack>

        {/* Promo Code Modal (on win) */}
        <PromoCodeDisplay
          isOpen={showPromoModal}
          promoCode={promoCode}
          onClose={() => setShowPromoModal(false)}
          onPlayAgain={handlePlayAgain}
        />

        {/* Game Over Modal (on loss) */}
        <GameOverModal
          isOpen={showLossModal}
          onClose={() => setShowLossModal(false)}
          onPlayAgain={handlePlayAgain}
        />
      </VStack>
    </Container>
  );
}

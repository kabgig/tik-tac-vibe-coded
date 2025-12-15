'use client';

import { useState, useEffect } from 'react';
import { Container, VStack, Heading, Text, Box } from '@chakra-ui/react';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { TelegramIdInput } from '@/components/TelegramIdInput';
import { PromoCodeDisplay } from '@/components/PromoCodeDisplay';
import { GameOverModal } from '@/components/GameOverModal';
import { useGameState } from '@/lib/hooks/useGameState';
import { useComputerPlayer } from '@/lib/hooks/useComputerPlayer';
import { generatePromoCode } from '@/lib/utils/gameLogic';

export default function Home() {
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);

  const { gameState, makeMove, startGame, resetGame } = useGameState();

  // Computer player hook
  useComputerPlayer(
    gameState.board,
    gameState.currentPlayer,
    gameState.status,
    makeMove
  );

  // Handle game over states
  useEffect(() => {
    const handleGameEnd = async () => {
      if (gameState.status === 'won' && telegramId) {
        // Generate promo code
        const code = generatePromoCode();
        setPromoCode(code);

        // Send telegram message
        try {
          await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId,
              message: 'Победа! Промокод выдан:',
              promoCode: code,
            }),
          });
        } catch (error) {
          console.error('Failed to send Telegram message:', error);
        }

        // Show promo modal
        setShowPromoModal(true);
      } else if (gameState.status === 'lost' && telegramId) {
        // Send telegram message
        try {
          await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId,
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
  }, [gameState.status, telegramId]);

  const handleTelegramSubmit = (id: string) => {
    setTelegramId(id);
    startGame();
  };

  const handleCellClick = (index: number) => {
    // Only allow moves when it's player's turn (X)
    if (gameState.currentPlayer === 'X' && gameState.status === 'playing') {
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
    setTelegramId(null);
    setPromoCode('');
    setShowPromoModal(false);
    setShowLossModal(false);
    resetGame();
  };

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
            Выиграй и получи промокод! 🎁
          </Text>
        </Box>

        {/* Show Telegram Input or Game */}
        {!telegramId ? (
          <TelegramIdInput onSubmit={handleTelegramSubmit} />
        ) : (
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
        )}

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

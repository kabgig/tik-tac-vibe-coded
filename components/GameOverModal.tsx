'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FaSadTear } from 'react-icons/fa';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
}

export function GameOverModal({
  isOpen,
  onClose,
  onPlayAgain,
}: GameOverModalProps) {
  const handlePlayAgain = () => {
    onClose();
    onPlayAgain();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg="white"
        borderRadius="2xl"
        borderWidth="3px"
        borderColor="lavender.300"
        mx={4}
      >
        <ModalHeader
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          color="lavender.600"
          pt={8}
        >
          <VStack spacing={3}>
            <Icon as={FaSadTear} boxSize={14} color="lavender.500" />
            <Text>Не повезло в этот раз</Text>
          </VStack>
        </ModalHeader>

        <ModalBody textAlign="center" pb={6}>
          <Text fontSize="md" color="gray.600">
            Не расстраивайтесь! Попробуйте ещё раз и выиграйте промокод 💝
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center" pb={8}>
          <VStack spacing={3} w="full">
            <Button
              onClick={handlePlayAgain}
              size="lg"
              w="full"
              colorScheme="lavender"
            >
              Попробовать снова
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm">
              Закрыть
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

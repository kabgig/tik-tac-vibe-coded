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
  Box,
  Icon,
  useClipboard,
} from '@chakra-ui/react';
import { FaGift, FaCopy, FaCheck } from 'react-icons/fa';

interface PromoCodeDisplayProps {
  isOpen: boolean;
  promoCode: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

export function PromoCodeDisplay({
  isOpen,
  promoCode,
  onClose,
  onPlayAgain,
}: PromoCodeDisplayProps) {
  const { hasCopied, onCopy } = useClipboard(promoCode);

  const handlePlayAgain = () => {
    onClose();
    onPlayAgain();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg="white"
        borderRadius="2xl"
        borderWidth="3px"
        borderColor="pink.300"
        mx={4}
      >
        <ModalHeader
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
          color="pink.500"
          pt={8}
        >
          <VStack spacing={3}>
            <Icon as={FaGift} boxSize={16} color="brand.500" />
            <Text>Поздравляем!</Text>
          </VStack>
        </ModalHeader>

        <ModalBody textAlign="center" pb={6}>
          <VStack spacing={6}>
            <Text fontSize="lg" color="gray.600">
              Вы выиграли! 🎉 Ваш промокод на скидку:
            </Text>

            <Box
              bg="gradient"
              bgGradient="linear(to-r, pink.100, brand.100)"
              p={6}
              borderRadius="xl"
              borderWidth="2px"
              borderColor="pink.200"
              w="full"
            >
              <Text
                fontSize="4xl"
                fontWeight="bold"
                color="brand.600"
                letterSpacing="wider"
              >
                {promoCode}
              </Text>
            </Box>

            <Button
              onClick={onCopy}
              leftIcon={<Icon as={hasCopied ? FaCheck : FaCopy} />}
              variant="outline"
              colorScheme="pink"
              size="sm"
            >
              {hasCopied ? 'Скопировано!' : 'Скопировать код'}
            </Button>

            <Text fontSize="sm" color="gray.500">
              Промокод также отправлен в ваш Telegram
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center" pb={8}>
          <VStack spacing={3} w="full">
            <Button
              onClick={handlePlayAgain}
              size="lg"
              w="full"
              colorScheme="pink"
            >
              Сыграть ещё раз
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

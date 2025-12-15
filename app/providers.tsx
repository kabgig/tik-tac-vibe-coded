'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Feminine color palette for women 25-40
const theme = extendTheme({
  colors: {
    brand: {
      50: '#fef5ff',
      100: '#fce7ff',
      200: '#f9d4ff',
      300: '#f5b5ff',
      400: '#ee87ff',
      500: '#e054ff',
      600: '#c734e8',
      700: '#a51fc4',
      800: '#881ba0',
      900: '#6f1a82',
    },
    pink: {
      50: '#fff5f7',
      100: '#ffe3e9',
      200: '#ffc6d4',
      300: '#ffa3b9',
      400: '#ff7096',
      500: '#ff4081',
      600: '#e6246e',
      700: '#c01558',
      800: '#9d1048',
      900: '#7f0e3c',
    },
    lavender: {
      50: '#f7f5ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'lavender.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'pink',
      },
      baseStyle: {
        borderRadius: 'xl',
        fontWeight: '600',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'pink.400',
      },
      variants: {
        outline: {
          field: {
            borderRadius: 'lg',
            borderColor: 'pink.200',
            _hover: {
              borderColor: 'pink.300',
            },
          },
        },
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

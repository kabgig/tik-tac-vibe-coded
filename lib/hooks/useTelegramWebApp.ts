'use client';

import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegramWebApp() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const tg = window.Telegram?.WebApp;

    if (tg) {
      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();

      // Get user data
      const telegramUser = tg.initDataUnsafe?.user;
      
      if (telegramUser) {
        setUser(telegramUser);
        setWebApp(tg);
      }

      setIsLoading(false);
    } else {
      // Development fallback - mock user for testing outside Telegram
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Running outside Telegram. Using mock user data.');
        setUser({
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
        });
      }
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    webApp,
    isLoading,
    isInTelegram: typeof window !== 'undefined' && !!window.Telegram?.WebApp,
  };
}

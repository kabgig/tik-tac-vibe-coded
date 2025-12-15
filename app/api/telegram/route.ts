import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, message, promoCode } = await request.json();

    // Validate input
    if (!telegramId || !message) {
      return NextResponse.json(
        { error: 'telegramId and message are required' },
        { status: 400 }
      );
    }

    // Get bot token from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not configured');
      // Don't fail silently in production - return success to not break game flow
      return NextResponse.json({
        success: false,
        error: 'Bot token not configured',
      });
    }

    // Initialize bot
    const bot = new TelegramBot(botToken);

    // Format message based on type
    let fullMessage = message;
    if (promoCode) {
      fullMessage = `${message} ${promoCode}`;
    }

    // Send message to user
    // Handle both username (@username) and numeric chat ID
    const chatId = telegramId.startsWith('@') ? telegramId : telegramId;

    await bot.sendMessage(chatId, fullMessage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram API error:', error);
    
    // Return success to not break game flow, but log the error
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

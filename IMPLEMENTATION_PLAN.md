 # Implementation Plan: Convert to Telegram Mini App

## Overview

Convert the Next.js Tic-Tac-Toe game into a Telegram Mini App. Users will launch the game directly from a Telegram bot, play inside Telegram's built-in browser, and receive promo codes via bot messages after winning. No manual Telegram ID input required - user data is automatically provided by Telegram.

## User Flow

1. User opens bot in Telegram
2. User clicks button → Mini App opens inside Telegram
3. Game automatically gets user data from `Telegram.WebApp`
4. User plays Tic-Tac-Toe
5. On win: Game sends API request → Bot receives notification → Bot sends promo code message to user
6. On loss: Bot sends encouragement message

## Implementation Steps

### 1. Add Telegram WebApp SDK to Layout

**Modify [app/layout.tsx](app/layout.tsx)**
- Add Telegram WebApp SDK script in `<head>` section
- Use Next.js `Script` component with `strategy="beforeInteractive"`
- Script URL: `https://telegram.org/js/telegram-web-app.js`

**Result**: `window.Telegram.WebApp` will be available globally

---

### 2. Create Telegram Hook

**Create `lib/hooks/useTelegramWebApp.ts`**
- Initialize `window.Telegram.WebApp` on component mount
- Call `WebApp.ready()` and `WebApp.expand()` for full-screen mode
- Extract user data from `WebApp.initDataUnsafe.user`
- Return user object with: `id`, `first_name`, `username`
- Handle case when not running in Telegram (development)

**TypeScript interface**:
```typescript
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}
```

---

### 3. Update Main Game Page

**Modify [app/page.tsx](app/page.tsx)**

**Changes:**
- Remove `TelegramIdInput` component import and usage
- Remove `telegramId` state and `setTelegramId` useState
- Replace with `useTelegramWebApp()` hook
- Use `user.id` from Telegram instead of manual input
- Auto-start game when user data is available
- Remove the conditional render `{!telegramId ? ... : ...}`
- Show game board immediately

**Lines to modify**: Remove lines 15-16, 79-81, 127-129 (TelegramIdInput section)

---

### 4. Update Game Result Flow

**Modify [app/page.tsx](app/page.tsx) lines 31-67**

**Current**: Sends to `/api/telegram` with `telegramId` string
**New**: Send to `/api/telegram` with numeric `userId` from Telegram WebApp

**Changes**:
- Replace `telegramId` with `user.id` from `useTelegramWebApp()`
- Keep the existing API endpoint `/api/telegram`
- Update request body to use `userId: user.id` instead of `telegramId`

**Note**: The existing `/api/telegram/route.ts` already handles sending messages via bot API - no changes needed there.

---

### 5. Register Telegram Mini App with BotFather

**Steps in Telegram app:**

1. Open `@BotFather` in Telegram
2. Send `/newbot` (if you don't have a bot yet)
   - Choose bot name: e.g., "TicTacToe Promo Bot"
   - Choose username: e.g., `@tictacpromo_bot`
   - Save the bot token for `TELEGRAM_BOT_TOKEN` env variable
3. Send `/newapp` to create Mini App
4. Select your bot from the list
5. Fill in details:
   - **Title**: "Крестики-Нолики"
   - **Description**: "Выиграй в крестики-нолики и получи промокод!"
   - **Web App URL**: Your deployed Next.js URL (e.g., `https://tik-tac-vibe-coded.vercel.app`)
   - **Short name**: `tictactoe` (used in links)
   - **Photo**: Upload 640x360 PNG icon
   - **GIF** (optional): Upload animated preview
6. Done! BotFather will create the Mini App

**Result**: Your bot will have a button that launches your game inside Telegram.

---

### 6. Configure Environment Variables

**Add to `.env.local`**:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
```

**Update in Vercel/deployment platform**:
- Add the same `TELEGRAM_BOT_TOKEN` variable
- Redeploy after adding

**Note**: The existing [app/api/telegram/route.ts](app/api/telegram/route.ts) already uses this variable.

---

## Technical Details

### How Telegram Mini Apps Work

- **Launch**: Bot sends inline keyboard button with `web_app` type
- **Container**: Game opens in Telegram's WebView (not external browser)
- **Authentication**: `Telegram.WebApp.initDataUnsafe.user` provides authenticated user data
- **Communication**: Game calls your API → API uses bot token → Bot sends messages back to user

### Required Bot Button Configuration

You'll need to set up your bot to send this button when user types `/start`:

```javascript
// Bot code (Node.js example)
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Нажми кнопку чтобы начать игру 🎮', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🎮 Начать Игру',
          web_app: { url: 'https://tik-tac-vibe-coded.vercel.app' }
        }
      ]]
    }
  });
});
```

Alternatively, you can set a **Menu Button** in BotFather:
- Send `/setmenubutton` to BotFather
- Select your bot
- Set button text: "🎮 Играть"
- Set Web App URL: your deployment URL

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| [app/layout.tsx](app/layout.tsx) | **Edit** | Add Telegram WebApp SDK script |
| `lib/hooks/useTelegramWebApp.ts` | **Create** | Hook to get Telegram user data |
| [app/page.tsx](app/page.tsx) | **Edit** | Remove manual input, use Telegram user |
| [components/TelegramIdInput.tsx](components/TelegramIdInput.tsx) | **Delete** | No longer needed |
| `.env.local` | **Edit** | Add/verify `TELEGRAM_BOT_TOKEN` |

**Total**: 2 new files, 2 modified files, 1 deleted file

---

## Development & Testing

### Local Development
- Use ngrok or similar to create HTTPS tunnel: `ngrok http 3000`
- Update Mini App URL in BotFather to ngrok URL
- Test in Telegram mobile/desktop app

### Mock Mode for Browser Testing
In `useTelegramWebApp.ts`, add fallback for non-Telegram environment:
```typescript
if (!window.Telegram?.WebApp) {
  // Development mock
  return {
    user: { id: 123456, first_name: 'Test User', username: 'testuser' }
  };
}
```

### Production Deployment
- Deploy to Vercel/Netlify (HTTPS by default)
- Update Mini App URL in BotFather to production URL
- Add `TELEGRAM_BOT_TOKEN` to deployment environment variables
- Test end-to-end in Telegram

---

## Success Criteria

- ✅ User opens bot → clicks button → game launches inside Telegram
- ✅ No manual Telegram ID input required
- ✅ User name displayed automatically in UI
- ✅ Game plays normally
- ✅ On win: User receives promo code message in Telegram chat
- ✅ On loss: User receives encouragement message
- ✅ App works in Telegram on iOS, Android, Desktop, and Web

---

## Considerations

### 1. Theme Integration
Telegram provides theme colors via `WebApp.themeParams`:
- Consider styling game to match Telegram's theme
- Access colors: `WebApp.themeParams.bg_color`, `WebApp.themeParams.text_color`
- Optional enhancement for Phase 2

### 2. Close Button
Add "Закрыть" button that calls:
```typescript
window.Telegram.WebApp.close()
```
This returns user to Telegram chat.

### 3. Haptic Feedback
Enhance UX with Telegram's haptic feedback:
```typescript
window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
```
Trigger on cell clicks, wins, losses.

### 4. Back Button
Enable Telegram's back button:
```typescript
window.Telegram.WebApp.BackButton.show()
window.Telegram.WebApp.BackButton.onClick(() => { /* handle back */ })
```

**Recommendation**: Implement #2 (Close button) in Phase 1, others in Phase 2.

---

## Implementation Timeline

### Phase 1: Core Integration (2-3 hours)
1. Add SDK script to layout
2. Create `useTelegramWebApp` hook
3. Update `page.tsx` to use Telegram data
4. Remove `TelegramIdInput` component
5. Test locally with mock data

### Phase 2: Bot Registration (30 minutes)
1. Register Mini App with BotFather
2. Configure bot button/menu
3. Add environment variables

### Phase 3: Testing & Deployment (1-2 hours)
1. Deploy to production
2. Update BotFather with production URL
3. Test end-to-end in Telegram
4. Verify promo code delivery
5. Test on multiple devices

**Total estimated time**: 4-6 hours

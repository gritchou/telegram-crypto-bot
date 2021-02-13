# Telegram Sticker Bot

When the bot detects a specific word it will send the chosen sticker.

## Setup

in `api/webhook.js` set your variables:

- `matchingWord` is a regexp representing the word(s) you want to match.
- `BOT_TOKEN` (set is as an environment variable): the Token given by BotFather you when you create your bot on Telegram.
- `STICKER_ID` (set is as an environment variable): the id of the sticker you want to send.

To find the `STICKER_ID` you can use this little code and send the corresponding sticker to your bot. The bot will then respond with the id.

```javascript
bot.on('message', (msg) => {
	bot.sendMessage(msg.chat.id, msg.sticker.file_id);
});
```

## Vercel

I use vercel to host my bot.
Follow [this](https://www.marclittlemore.com/serverless-telegram-chatbot-vercel/) really cool tutorial from [@marclittlemore](https://twitter.com/marclittlemore).
As he suggests, I used ngrok to test vercel's serveless function locally.

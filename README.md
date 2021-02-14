# Telegram Binance Bot

A bot that can retrieve coins prices.

usage: `/`${`COIN`}${`CURRENCY`}

[link to the bot on telegram](http://t.me/CoingekoNoKyojinBot)

## Envrionment variable

`BOT_TOKEN`: the Token given by BotFather you when you create your bot on Telegram.

## Vercel devmode

I use vercel to host my bot.
Follow [this](https://www.marclittlemore.com/serverless-telegram-chatbot-vercel/) really cool tutorial from [@marclittlemore](https://twitter.com/marclittlemore).
As he suggests, I used ngrok to test vercel's serveless function locally.

Vercel will automatically use the `BOT_TOKEN` from your project on vercel.com

You need to set NTBA_FIX_319 to fix an error with Promise cancellation [Github issue](https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294)

To test in devmode:
```sh
NTBA_FIX_319=test vercel dev
```

## Bot commands

- /help - lists bot commands
- /usage - get examples
- /btc - shorthand for BTCUSD
- /eth - shorthand for ETHUSD
- /coins - get the number of supported coins
- /currencies - get the list of the supported currencies
- /api - get the API used by this bot
- /author me

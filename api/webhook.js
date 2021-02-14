const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const BOT_PREFIX = '@';

const CRYPTO_MAP = new Map();
const CURRENCY_MAP = new Map();
const SUPPORTED_CURRENCIES = [];

const COMMANDS = `/commands - lists bot commands\n/usage - get examples\n/btc - shorthand for BTCUSD\n/eth - shorthand for ETHUSD\n/coins - get the number of supported coins\n/currencies - get the list of the supported currencies\n/api - get the API used by this bot\n/author - me`;
const EXAMPLE = `Example usage: /\${COIN}\${CURRENCY} case insensitive\n/BTCUSD\n/etheur\n/dogeBTC\n/VETusd`;

module.exports = async (request, response) => {
	try {
		/*eslint-env node*/
		const bot = new TelegramBot(process.env.BOT_TOKEN);
		const { message } = request.body;

		await fetch('https://api.coingecko.com/api/v3/coins/list')
			.then((response) => response.json())
			.then((coins) => coins.forEach((coin) => CRYPTO_MAP.set(coin.symbol, { id: coin.id, name: coin.name })))
			;

		await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
			.then((response) => response.json())
			.then((currencies) => currencies.forEach((currency) => SUPPORTED_CURRENCIES.push(currency)))
			;

		await fetch('https://www.localeplanet.com/api/auto/currencymap.json')
			.then((response) => response.json())
			.then((currencies) => SUPPORTED_CURRENCIES.forEach((currency) => CURRENCY_MAP.set(currency, currencies[currency.toUpperCase()] && currencies[currency.toUpperCase()].symbol || currency.toUpperCase())))
			;

		if (message && message.text) {
			const isGroupCommand = () => message.text.indexOf(BOT_PREFIX) > 0;
			// This is to handle messages such as btc@YourBotName in groups
			const text = isGroupCommand() ? message.text.slice(0, message.text.indexOf(BOT_PREFIX)) : message.text;
			if (text === '/commands') {
				await bot.sendMessage(message.chat.id, COMMANDS);
			} else if (text === '/usage') {
				await bot.sendMessage(message.chat.id, EXAMPLE);
			} else if (text === '/coins') {
				await bot.sendMessage(message.chat.id, CRYPTO_MAP.size + ' coins supported.');
			} else if (text === '/currencies') {
				await bot.sendMessage(message.chat.id, 'Supported currencies: ' + SUPPORTED_CURRENCIES.join(', ') + ".");
			} else if (text === '/btc') {
				await fetch('https://api.coingecko.com/api/v3/coins/bitcoin')
					.then((response) => response.json())
					.then((coin) => bot.sendMessage(message.chat.id, coin.market_data.current_price.usd + ' $'))
					;
			} else if (text === '/eth') {
				await fetch('https://api.coingecko.com/api/v3/coins/ethereum')
					.then((response) => response.json())
					.then((coin) => bot.sendMessage(message.chat.id, coin.market_data.current_price.usd + ' $'))
					;
			} else if (text === '/api') {
				await bot.sendMessage(message.chat.id, 'This bot uses CoinGecko API and localeplanet currencymap.');
			} else if (text === '/author') {
				await bot.sendMessage(message.chat.id, 'twitter.com/gritchou');
			} else if (text.startsWith('/')) {
				const query = text.slice(1).toLowerCase();
				let currency = query.slice(-4);
				if (!SUPPORTED_CURRENCIES.includes(currency)) {
					currency = query.slice(-3);
				}
				if (!SUPPORTED_CURRENCIES.includes(currency)) {
					await bot.sendMessage(message.chat.id, 'Invalid token pair: ' + text.slice(1));
				}
				let coin = query.slice(0, query.length - currency.length);
				if (!CRYPTO_MAP.has(coin)) {
					await bot.sendMessage(message.chat.id, 'Invalid token pair: ' + text.slice(1));
				}
				await fetch('https://api.coingecko.com/api/v3/coins/' + CRYPTO_MAP.get(coin).id)
					.then((response) => response.json())
					.then((coin) => bot.sendMessage(message.chat.id, coin.market_data.current_price[currency] + ' ' + CURRENCY_MAP.get(currency)))
					;
			}
		}
	}
	catch (error) {
		console.error('Error sending message');
		console.log(error.toString());
	}
	response.send('OK');
};

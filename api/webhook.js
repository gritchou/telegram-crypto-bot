const Binance = require('node-binance-api');
const binance = new Binance().options({
	API_KEY: process.env.API_KEY,
	API_SECRET: process.env.API_SECRET
});
const TelegramBot = require('node-telegram-bot-api');

/*eslint-env node*/
// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
// process.env.NTBA_FIX_319 = 'test';

const matchingWord = /(!btc|!eth)/ig;

module.exports = async (request, response) => {
	try {
		const bot = new TelegramBot(process.env.BOT_TOKEN);
		const { message } = request.body;

		let ticker = await binance.prices();

		if (message && message.text && matchingWord.test(message.text)) {
			await bot.sendMessage(message.chat.id, `1 ${message.text.slice(1).toUpperCase()} = ${parseInt(ticker[message.text.slice(1).toUpperCase() + 'USDT']).toFixed(2)}$ = ${parseInt(ticker[message.text.slice(1).toUpperCase() + 'EUR']).toFixed(2)}€`);
		}
	}
	catch (error) {
		console.error('Error sending message');
		console.log(error.toString());
	}
	response.send('OK');
};

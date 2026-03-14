const BOT_API_KEY = process.env.BOT_API_KEY;

/**
 * Middleware that authenticates requests from the Discord bot.
 * The bot sends X-Bot-Api-Key header with the shared secret.
 */
export const botAuth = (req, res, next) => {
	if (!BOT_API_KEY) {
		return res.status(500).json({
			success: false,
			message: "BOT_API_KEY is not configured on the server.",
		});
	}

	const providedKey = req.headers["x-bot-api-key"];
	if (!providedKey || providedKey !== BOT_API_KEY) {
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized: invalid bot API key." });
	}

	next();
};

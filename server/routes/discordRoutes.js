import express from "express";
import { botAuth } from "../middlewares/botAuthMiddleware.js";
import {
	registerGuild,
	getGuild,
	updateGuild,
	listGuilds,
	discordAuth,
	getGuildUsers,
} from "../controllers/discordController.js";

const router = express.Router();

// All discord routes require bot authentication
router.use(botAuth);

// Guild management
router.post("/guilds", registerGuild);
router.get("/guilds", listGuilds);
router.get("/guilds/:guildId", getGuild);
router.patch("/guilds/:guildId", updateGuild);
router.get("/guilds/:guildId/users", getGuildUsers);

// Auth bridge — Discord user → Gamify JWT
router.post("/auth", discordAuth);

export default router;

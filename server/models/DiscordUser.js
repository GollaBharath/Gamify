import mongoose from "mongoose";

const discordUserSchema = new mongoose.Schema(
	{
		discordId: {
			type: String,
			required: true,
			unique: true,
		},
		discordUsername: {
			type: String,
			required: true,
		},
		gamifyUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// All guild IDs this Discord user has interacted with
		guilds: [{ type: String }],
		linkedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

discordUserSchema.index({ gamifyUserId: 1 });

const DiscordUser = mongoose.model("DiscordUser", discordUserSchema);

export default DiscordUser;

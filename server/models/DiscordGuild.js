import mongoose from "mongoose";

const discordGuildSchema = new mongoose.Schema(
	{
		guildId: {
			type: String,
			required: true,
			unique: true,
		},
		guildName: {
			type: String,
			required: true,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organization",
			required: true,
		},
		roleMapping: {
			// Arrays of Discord role IDs that map to each Gamify role
			admin: [{ type: String }],
			moderator: [{ type: String }],
			eventStaff: [{ type: String }],
			// Everyone else is treated as Member
		},
		settings: {
			announcementChannelId: {
				type: String,
				default: null,
			},
			autoRegister: {
				type: Boolean,
				default: true,
			},
			welcomeMessage: {
				type: String,
				default:
					"Welcome to Gamify! Use `/profile` to see your profile and `/help` to explore all commands.",
				maxlength: 500,
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

discordGuildSchema.index({ organizationId: 1 });

const DiscordGuild = mongoose.model("DiscordGuild", discordGuildSchema);

export default DiscordGuild;

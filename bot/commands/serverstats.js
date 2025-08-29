const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Get detailed server statistics')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        const guild = interaction.guild;
        const members = await guild.members.fetch();
        
        // Basic statistics
        const totalMembers = guild.memberCount;
        const bots = members.filter(m => m.user.bot).size;
        const humans = totalMembers - bots;
        
        // Online status counts
        const online = members.filter(m => m.presence?.status === 'online').size;
        const idle = members.filter(m => m.presence?.status === 'idle').size;
        const dnd = members.filter(m => m.presence?.status === 'dnd').size;
        const offline = members.filter(m => !m.presence || m.presence.status === 'offline').size;
        
        // Channel counts
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categories = guild.channels.cache.filter(c => c.type === 4).size;
        
        // Role counts
        const totalRoles = guild.roles.cache.size;
        
        // Member join dates (last 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentJoins = members.filter(m => m.joinedTimestamp > thirtyDaysAgo).size;
        
        // Create embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`📊 ${guild.name} Statistics`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: '👥 Members',
                    value: `**Total:** ${totalMembers}\n**Humans:** ${humans}\n**Bots:** ${bots}\n**Recent (30d):** ${recentJoins}`,
                    inline: true
                },
                {
                    name: '🟢 Online Status',
                    value: `**Online:** ${online}\n**Idle:** ${idle}\n**DND:** ${dnd}\n**Offline:** ${offline}`,
                    inline: true
                },
                {
                    name: '📁 Channels & Roles',
                    value: `**Text Channels:** ${textChannels}\n**Voice Channels:** ${voiceChannels}\n**Categories:** ${categories}\n**Roles:** ${totalRoles}`,
                    inline: true
                },
                {
                    name: '📅 Server Created',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '👑 Owner',
                    value: `<@${guild.ownerId}>`,
                    inline: true
                },
                {
                    name: '🚀 Boost Level',
                    value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`,
                    inline: true
                }
            )
            .setFooter({ text: `Server ID: ${guild.id} • Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
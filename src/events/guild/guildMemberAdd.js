const { EmbedBuilder } = require('discord.js');

const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

function stringFixer(message, member) {
    // Replace all variables in the message
    message.replace('$SERVER_NAME$', member.guild.name);
    message.replace('$USER_NAME$', member.user.username);
    message.replace('$USER_ID$', member.user.id);
    message.replace('$SERVER_MEMBER_COUNT$', member.guild.memberCount);
    message.replace('$SERVER_ID$', member.guild.id);

    // Return the fixed message
    return message;
}

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        /* Check for the database configuration of the welcome system */
        let guildProfile = await Guild.findOne({ guildId: member.guild.id });
        if (!guildProfile) return;

        /* Check if the welcome system is enabled */
        if (!guildProfile.welcome.enabled) return;

        /* Fetch welcome channel */
        const welcomeChannel = member.guild.channels.cache.get(guildProfile.welcome.channel);
        if (!welcomeChannel) return;

        /* Guild member add embeds */
        const welcomeEmbed = new EmbedBuilder()
        .setTitle(stringFixer(guildProfile.welcome.message.title, member) || 'Welcome')
        .setColor(guildProfile.welcome.message.color || 'RANDOM')
        .setDescription(stringFixer(guildProfile.welcome.message.description, member) || `Welcome to ${member.guild.name}, ${member.user.username}!`)
        .setFooter(stringFixer(guildProfile.welcome.message.footer, member) || `You are the ${member.guild.memberCount}th member to join this server.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

        /* Send welcome embed */
        welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
}
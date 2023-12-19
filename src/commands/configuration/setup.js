const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

/* Import MongoDB schemas */
const User = require('../../schemas/user');
const Guild = require('../../schemas/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the bot for your server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true });
        
        /* Check if the bot is already setup */
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (guildProfile) return interaction.editReply({ content: `This server is already setup! Setup done on: \`${guildProfile.setupDate}\``, ephemeral: true });

        /* Create a new guild profile */
        guildProfile = new Guild({
            _id: new mongoose.Types.ObjectId,
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            userVerification: {
                enabled: false,
                role: null
            },
            welcome: {
                enabled: false,
                channel: null,
                message: {
                    title: null,
                    description: null,
                    color: null,
                    footer: null
                }
            },
            leave: {
                enabled: false,
                channel: null,
                message: {
                    title: null,
                    description: null,
                    color: null,
                    footer: null
                }
            }
        });

        await interaction.editReply({ content: 'Saving server profile in database...', fetchReply: true, ephemeral: true });

        /* Save the guild profile in the database */
        await guildProfile.save().catch(error => {
            console.error(`Error while saving guild profile in database: `, error);
            return interaction.editReply({ content: `An error occurred while saving the server profile in the database.\nPlease send this error message to the bot developer: ${error}`, ephemeral: true });
        });

        /* Send setup embed */
        const setupEmbed = new EmbedBuilder()
            .setTitle('Setup done!')
            .setColor('Green')
            .setDescription(`The bot has been successfully setup for this server!
            \nSetup done on: ${guildProfile.setupDate}`)
            .addFields(
                {
                    name: 'User Verification',
                    value: `Enabled: ${guildProfile.userVerification.enabled}\nRole: ${guildProfile.userVerification.role || 'Not set'}`,
                    inline: true
                },
                {
                    name: 'Welcome System',
                    value: `Enabled: ${guildProfile.welcome.enabled}\nChannel: ${guildProfile.welcome.channel || 'Not set'}`,
                    inline: true
                },
                {
                    name: 'Leave System',
                    value: `Enabled: ${guildProfile.leave.enabled}\nChannel: ${guildProfile.leave.channel || 'Not set'}`,
                    inline: true
                },
                {
                    name: 'Setup Date',
                    value: `${guildProfile.setupDate}`,
                    inline: true
                },
            )
            .setTimestamp();

        /* Send setup embed */
        interaction.editReply({ content: 'Saved successfully!', embeds: [setupEmbed], ephemeral: true });
    }
}
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../schemas/guild');

module.exports = {
    data: {
        name: 'verify',
        description: 'Verify your account',
        type: 1,
    },
    async execute(interaction, client) {
        /* Check for the database configuration of the user verification system */
        let guildProfile = await Guild.findOne({ guildID: interaction.guild.id });
        /* Check if the server is set up */
        if (!guildProfile) await interaction.reply({ content: 'This server is not set up yet. Please contact the server owner.', ephemeral: true });

        /* Check if the user verification system is enabled */
        if (!guildProfile.userVerification.enabled) await interaction.reply({ content: 'This server does not have user verification enabled.', ephemeral: true });
        /* Check if the user is already verified */
        if (interaction.member.roles.cache.has(guildProfile.userVerification.role)) await interaction.reply({ content: 'You are already verified.', ephemeral: true });

        /* Retrieve the user role */
        let role = await interaction.guild.roles.cache.get(guildProfile.userVerification.role);
        /* Check if the role exists */
        if (!role) return interaction.reply({ content: 'The user role is not correctly setup. Please contact the server owner.', ephemeral: true });

        /* Add the role to the user */
        await interaction.deferReply({ fetchReply: true, ephemeral: true });
        try {
            await interaction.member.roles.add(role);
            /* Send the success message */
            await interaction.editReply({ content: 'You have been verified!', ephemeral: true });
        } catch (error) {
            interaction.editReply({ content: 'An error occured while verifying you. Please contact the server owner.', ephemeral: true});
        }
    }
}
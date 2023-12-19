const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

/* Import MongoDB schemas */
const User = require('../../schemas/user');
const Guild = require('../../schemas/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Change the bot settings for your server')
        .addSubcommand(subcommand => subcommand
            .setName('current')
            .setDescription('View the current settings for your server'))
        .addSubcommand(subcommand => subcommand
            .setName('user-verification')
            .setDescription('Change the user verification settings for your server')
            .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable user verification').setRequired(false))
            .addRoleOption(option => option.setName('role').setDescription('The role that will be given to verified users').setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('welcome')
            .setDescription('Change the welcome settings for your server')
            .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable welcome messages').setRequired(false))
            .addChannelOption(option => option.setName('channel').setDescription('The channel where welcome messages will be sent').setRequired(false))
            .addStringOption(option => option.setName('title').setDescription('The title of the welcome message').setRequired(false))
            .addStringOption(option => option.setName('description').setDescription('The description of the welcome message').setRequired(false))
            .addStringOption(option => option.setName('color').setDescription('The color of the welcome message').setRequired(false))
            .addStringOption(option => option.setName('footer').setDescription('The footer of the welcome message').setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('leave')
            .setDescription('Change the leave settings for your server')
            .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable leave messages').setRequired(false))
            .addChannelOption(option => option.setName('channel').setDescription('The channel where leave messages will be sent').setRequired(false))
            .addStringOption(option => option.setName('title').setDescription('The title of the leave message').setRequired(false))
            .addStringOption(option => option.setName('description').setDescription('The description of the leave message').setRequired(false))
            .addStringOption(option => option.setName('color').setDescription('The color of the leave message').setRequired(false))
            .addStringOption(option => option.setName('footer').setDescription('The footer of the leave message').setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('reset')
            .setDescription('Reset the settings for your server'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true });

        /* Check if the bot is already setup */
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) return interaction.editReply({ content: `This server is not setup yet! Run \`/setup\` to setup the bot.`, ephemeral: true });

        /* Branch the code depending on the subcommand */
        switch (interaction.options.getSubcommand()) {
            case 'current':
                return await viewSettings(interaction, guildProfile);
            case 'user-verification':
                return await userVerification(interaction, guildProfile);
            case 'welcome':
                return await welcomeSystem(interaction, guildProfile);
            case 'leave':
                return await leaveSystem(interaction, guildProfile);
            case 'reset':
                return await resetSettings(interaction, guildProfile);
            default:
                return await viewSettings(interaction, guildProfile);
        }
    }
};

/* View the current settings for the server */
async function viewSettings(interaction, guildProfile) {
    /* Send settings embed */
    const settingsEmbed = new EmbedBuilder()
        .setTitle('Settings')
        .setDescription('Change the bot settings for your server')
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

    /* User verification */
    settingsEmbed.addFields({
        name: 'User verification system',
        value: guildProfile.userVerification.enabled ? 'Enabled' : 'Disabled',
        inline: true
    });

    /* Welcome */
    settingsEmbed.addFields({
        name: 'Welcome system',
        value: guildProfile.welcome.enabled ? 'Enabled' : 'Disabled',
        inline: true
    });

    /* Leave */
    settingsEmbed.addFields({
        name: 'Leave system',
        value: guildProfile.leave.enabled ? 'Enabled' : 'Disabled',
        inline: true
    });

    /* Send the embed */
    await interaction.editReply({ embeds: [settingsEmbed], ephemeral: true });
}

/* Change the user verification settings for the server */
async function userVerification(interaction, guildProfile) {
    const verificationSettingsEmbed = new EmbedBuilder()
        .setTitle('User verification system')
        .setDescription('Change the user verification system settings for your server')
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

    if (interaction.options.getBoolean('enabled') !== null) {
        /* Update the user verification enabled setting */
        guildProfile.userVerification.enabled = interaction.options.getBoolean('enabled');
    }

    if (interaction.options.getRole('role') !== null) {
        /* Update the user verification role */
        guildProfile.userVerification.role = interaction.options.getRole('role').id;
    }

    /* Save the guild profile in the database */
    await guildProfile.save().catch(error => {
        console.error(`Error while saving guild profile in database: `, error);
        return interaction.editReply({ content: `An error occurred while saving the server profile in the database.\nPlease send this error message to the bot developer: ${error}`, ephemeral: true });
    });

    /* Check if the user verification system is enabled */
    verificationSettingsEmbed.addFields({
        name: 'Enabled',
        value: guildProfile.userVerification.enabled ? 'Yes' : 'No',
        inline: true
    });

    /* Check if the user verification role is set */
    verificationSettingsEmbed.addFields({
        name: 'Role',
        value: guildProfile.userVerification.role ? `<@&${guildProfile.userVerification.role}>` : 'Not set',
        inline: true
    });

    /* Send the embed */
    await interaction.editReply({ embeds: [verificationSettingsEmbed], ephemeral: true });
}

/* Change the welcome system settings for the server */
async function welcomeSystem(interaction, guildProfile) {
    const welcomeSettingsEmbed = new EmbedBuilder()
        .setTitle('Welcome system')
        .setDescription('Change the welcome system settings for your server')
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

    if (interaction.options.getBoolean('enabled') !== null) {
        /* Update the welcome enabled setting */
        guildProfile.welcome.enabled = interaction.options.getBoolean('enabled');
    }

    if (interaction.options.getChannel('channel') !== null) {
        /* Update the welcome channel */
        guildProfile.welcome.channel = interaction.options.getChannel('channel').id;
    }

    if (interaction.options.getString('title') !== null) {
        /* Update the welcome title */
        guildProfile.welcome.message.title = interaction.options.getString('title');
    }

    if (interaction.options.getString('description') !== null) {
        /* Update the welcome description */
        guildProfile.welcome.message.description = interaction.options.getString('description');
    }

    if (interaction.options.getString('color') !== null) {
        /* Check if the color is valid */
        if (!interaction.options.getString('color').match(/^#([0-9a-f]{3}){1,2}$/i)) {
            return await interaction.editReply({ content: 'The color must be a valid hex color!', ephemeral: true });
        }

        /* Update the welcome color */
        guildProfile.welcome.message.color = interaction.options.getString('color');
    }

    if (interaction.options.getString('footer') !== null) {
        /* Update the welcome footer */
        guildProfile.welcome.message.footer = interaction.options.getString('footer');
    }

    /* Save the guild profile in the database */
    await guildProfile.save().catch(error => {
        console.error(`Error while saving guild profile in database: `, error);
        return interaction.editReply({ content: `An error occurred while saving the server profile in the database.\nPlease send this error message to the bot developer: ${error}`, ephemeral: true });
    });

    /* Check if the welcome system is enabled */
    welcomeSettingsEmbed.addFields({
        name: 'Enabled',
        value: guildProfile.welcome.enabled ? 'Yes' : 'No',
        inline: true
    });

    /* Check if the welcome channel is set */
    welcomeSettingsEmbed.addFields({
        name: 'Channel',
        value: guildProfile.welcome.channel ? `<#${guildProfile.welcome.channel}>` : 'Not set',
        inline: true
    });

    /* Check if the welcome title is set */
    welcomeSettingsEmbed.addFields({
        name: 'Title',
        value: guildProfile.welcome.message.title ? guildProfile.welcome.message.title : 'Not set',
        inline: true
    });

    /* Check if the welcome description is set */
    welcomeSettingsEmbed.addFields({
        name: 'Description',
        value: guildProfile.welcome.message.description ? guildProfile.welcome.message.description : 'Not set',
        inline: true
    });

    /* Check if the welcome color is set */
    welcomeSettingsEmbed.addFields({
        name: 'Color',
        value: guildProfile.welcome.message.color ? guildProfile.welcome.message.color : 'Not set',
        inline: true
    });

    /* Check if the welcome footer is set */
    welcomeSettingsEmbed.addFields({
        name: 'Footer',
        value: guildProfile.welcome.message.footer ? guildProfile.welcome.message.footer : 'Not set',
        inline: true
    });

    /* Send the embed */
    await interaction.editReply({ embeds: [welcomeSettingsEmbed], ephemeral: true });
}

/* Change the leave system settings for the server */
async function leaveSystem(interaction, guildProfile) {
    const leaveSettingsEmbed = new EmbedBuilder()
        .setTitle('Leave system')
        .setDescription('Change the leave system settings for your server')
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });


    if (interaction.options.getBoolean('enabled') !== null) {
        /* Update the leave enabled setting */
        guildProfile.leave.enabled = interaction.options.getBoolean('enabled');
    }

    if (interaction.options.getChannel('channel') !== null) {
        /* Update the leave channel */
        guildProfile.leave.channel = interaction.options.getChannel('channel').id;
    }

    if (interaction.options.getString('title') !== null) {
        /* Update the leave title */
        guildProfile.leave.message.title = interaction.options.getString('title');
    }

    if (interaction.options.getString('description') !== null) {
        /* Update the leave description */
        guildProfile.leave.message.description = interaction.options.getString('description');
    }

    if (interaction.options.getString('color') !== null) {
        /* Check if the color is valid */
        if (!interaction.options.getString('color').match(/^#([0-9a-f]{3}){1,2}$/i)) {
            return await interaction.editReply({ content: 'The color must be a valid hex color!', ephemeral: true });
        }

        /* Update the leave color */
        guildProfile.leave.message.color = interaction.options.getString('color');
    }

    if (interaction.options.getString('footer') !== null) {
        /* Update the leave footer */
        guildProfile.leave.message.footer = interaction.options.getString('footer');
    }

    /* Save the guild profile in the database */
    await guildProfile.save().catch(error => {
        console.error(`Error while saving guild profile in database: `, error);
        return interaction.editReply({ content: `An error occurred while saving the server profile in the database.\nPlease send this error message to the bot developer: ${error}`, ephemeral: true });
    });

    /* Check if the leave system is enabled */
    leaveSettingsEmbed.addFields({
        name: 'Enabled',
        value: guildProfile.leave.enabled ? 'Yes' : 'No',
        inline: true
    });

    /* Check if the leave channel is set */
    leaveSettingsEmbed.addFields({
        name: 'Channel',
        value: guildProfile.leave.channel ? `<#${guildProfile.leave.channel}>` : 'Not set',
        inline: true
    });

    /* Check if the leave title is set */
    leaveSettingsEmbed.addFields({
        name: 'Title',
        value: guildProfile.leave.message.title ? guildProfile.leave.message.title : 'Not set',
        inline: true
    });

    /* Check if the leave description is set */
    leaveSettingsEmbed.addFields({
        name: 'Description',
        value: guildProfile.leave.message.description ? guildProfile.leave.message.description : 'Not set',
        inline: true
    });

    /* Check if the leave color is set */
    leaveSettingsEmbed.addFields({
        name: 'Color',
        value: guildProfile.leave.message.color ? guildProfile.leave.message.color : 'Not set',
        inline: true
    });

    /* Check if the leave footer is set */
    leaveSettingsEmbed.addFields({
        name: 'Footer',
        value: guildProfile.leave.message.footer ? guildProfile.leave.message.footer : 'Not set',
        inline: true
    });

    /* Send the embed */
    await interaction.editReply({ embeds: [leaveSettingsEmbed], ephemeral: true });
}

/* Reset the settings for the server */
async function resetSettings(interaction, guildProfile) {
    /* Reset the guild profile */
    guildProfile.userVerification = {
        enabled: false,
        role: null
    };
    guildProfile.welcome = {
        enabled: false,
        channel: null,
        message: {
            title: null,
            description: null,
            color: null,
            footer: null
        }
    };
    guildProfile.leave = {
        enabled: false,
        channel: null,
        message: {
            title: null,
            description: null,
            color: null,
            footer: null
        }
    };

    /* Save the guild profile in the database */
    await guildProfile.save().catch(error => {
        console.error(`Error while saving guild profile in database: `, error);
        return interaction.editReply({ content: `An error occurred while saving the server profile in the database.\nPlease send this error message to the bot developer: ${error}`, ephemeral: true });
    });

    /* Send setup embed */
    const resetEmbed = new EmbedBuilder()
        .setTitle('Settings reset!')
        .setColor('Green')
        .setDescription(`The bot settings have been successfully reset for this server!`)
        .setTimestamp();

    /* Send setup embed */
    await interaction.editReply({ embeds: [resetEmbed], ephemeral: true });
}
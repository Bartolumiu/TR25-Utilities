const { InteractionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        /* Interaction error embeds */
        const errorEmbed = new EmbedBuilder()
            .setTitle('Execution Error')
            .setColor('Red')
            .setDescription('An error occurred while executing this command.')
            .setFooter({ text: 'Please contact the developer of this bot if this error persists.', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        /* Interaction type checks */
        if (interaction.isChatInputCommand()) {
            await this.executeChatInputCommand(interaction, client, errorEmbed);
        } else if (interaction.isButton()) {
            await this.executeButton(interaction, client, errorEmbed);
        } else if (interaction.isSelectMenu()) {
            await this.executeSelectMenu(interaction, client, errorEmbed);
        } else if (interaction.isContextMenuCommand()) {
            await this.executeContextMenuCommand(interaction, client, errorEmbed);
        } else if (interaction.type == InteractionType.ModalSubmit) {
            await this.executeModalSubmit(interaction, client, errorEmbed);
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            await this.executeAutocomplete(interaction, client, errorEmbed);
        }
    },

    /* Interaction type functions */
    /* Chat input command */
    async executeChatInputCommand(interaction, client, errorEmbed) {
        const { commands } = client;
        const { commandName } = interaction;
        const command = commands.get(commandName);
        if (!command) return new Error('Command not found.');

        /* Execute command */
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            errorEmbed.addFields({ name: 'Error', value: `\`\`\`${error}\`\`\`` });
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    /* Button */
    async executeButton(interaction, client, errorEmbed) {
        const { buttons } = client;
        const { customId } = interaction;
        const button = buttons.get(customId);
        if (!button) return new Error('Button not found.');

        /* Execute button */
        try {
            await button.execute(interaction, client);
        } catch (error) {
            console.error(error);
            errorEmbed.addFields({ name: 'Error', value: `\`\`\`${error}\`\`\`` });
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    /* Select menu */
    async executeSelectMenu(interaction, client, errorEmbed) {
        const { selectMenus } = client;
        const { customId } = interaction;
        const selectMenu = selectMenus.get(customId);
        if (!selectMenu) return new Error('Select menu not found.');

        /* Execute select menu */
        try {
            await selectMenu.execute(interaction, client);
        } catch (error) {
            console.error(error);
            errorEmbed.addFields({ name: 'Error', value: `\`\`\`${error}\`\`\`` });
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    /* Context menu command */
    async executeContextMenuCommand(interaction, client, errorEmbed) {
        const { contextMenus } = client;
        const { commandName } = interaction;
        const contextMenu = contextMenus.get(commandName);
        if (!contextMenu) return new Error('Context menu not found.');

        /* Execute context menu */
        try {
            await contextMenu.execute(interaction, client);
        } catch (error) {
            console.error(error);
            errorEmbed.addFields({ name: 'Error', value: `\`\`\`${error}\`\`\`` });
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    /* Modal submit */
    async executeModalSubmit(interaction, client, errorEmbed) {
        const { modals } = client;
        const { customId } = interaction;
        const modal = modals.get(customId);
        if (!modal) return new Error('Modal not found.');

        /* Execute modal */
        try {
            await modal.execute(interaction, client);
        } catch (error) {
            console.error(error);
            errorEmbed.addFields({ name: 'Error', value: `\`\`\`${error}\`\`\`` });
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },

    /* Autocomplete */
    async executeAutocomplete(interaction, client, errorEmbed) {
        const { commands } = client;
        const { commandName } = interaction;
        const command = commands.get(commandName);
        if (!command) return new Error('Could not autocomplete the command.');

        /* Execute autocomplete */
        try {
            await command.autocomplete(interaction, client);
        } catch (error) {
            console.error(error);
            errorEmbed.addFields({ name: 'Error', value: `\`\`\`${error}\`\`\`` });
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s ping')
        .setDescriptionLocalizations({
            "es-ES": "Comprueba la latencia del bot",
            "it": "Controllare la latenza del bot",
            "fr": "Vérifier la latence du bot",
            "pt-BR": "Verificar la latência do bot",
            "de": "Bot-Latenz prüfen",
            "no": "Sjekk bot-forsinkelse"
        }),
    async execute(interaction, client) {
        const message = await interaction.deferReply({ fetchReply: true });

        console.log(getAPILatency(client));

        const newEmbed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            .setTitle('Pong!')
            .setColor('Blurple')
            .addFields([
                {
                    name: 'Bot Latency',
                    value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
                    inline: true
                },
                {
                    name: 'API Latency',
                    value: `${await getAPILatency(client)}ms`,
                    inline: true
                }
            ])
            .setFooter({ text: `Ping | Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })});

        await interaction.editReply({ content: interaction.user.mention, embeds: [newEmbed] });
    }
}

function getAPILatency(client) {
    return new Promise((resolve) => {
        const checkPing = () => {
            if (client.ws.ping !== -1) {
                resolve(client.ws.ping);
            } else {
                setTimeout(checkPing, 1000); // Check again after 1s
            }
        };
        checkPing();
    });
}
module.exports = {
    name: 'guildCreate',
    async execute(guild, client) {
        await guild.fetch();

        console.log("Guild Schema: \n", guild);

        /* Check if the guild is unavailable */
        if (!guild.available) return;

        /* Check if the guild is a partial */
        if (guild.partial) return;

        /* Fetch the guild owner */
        const owner = await guild.members.fetch(guild.ownerId);

        console.log("Guild Owner: \n", owner);

        /* Send a message to the guild owner */
        await owner.send('Thanks for adding me to your server! Use `/help` to get started.');
        await owner.send('Commands of the bot: ');
        await owner.send(`<:${client.commands.map(command => command.name)}:${client.commands.map(command => command.id)}>`);
    }
}
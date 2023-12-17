module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        setInterval(client.pickPresence, 10 * 1000);
        console.log(`Ready as ${client.user.tag}!`);
    }
}
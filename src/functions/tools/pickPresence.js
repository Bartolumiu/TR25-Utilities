const { ActivityType } = require('discord.js');

module.exports = (client) => {
    client.pickPresence = async (options) => {
        const ActivityOptions = [
            {
                type: ActivityType.Listening,
                text: 'interactions | /help',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                text: 'the server | /help',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                text: 'the Audit Logs | /help',
                status: 'online'
            }
        ];
        const selectedOption = Math.floor(Math.random() * ActivityOptions.length);

        client.user.setPresence({
            activities: [
                {
                    name: ActivityOptions[selectedOption].text,
                    type: ActivityOptions[selectedOption].type
                },
            ],
            status: ActivityOptions[selectedOption].status,
        });
    };
};
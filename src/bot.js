require('dotenv').config();
const { token, databaseToken } = process.env;
const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

/* Load all functions */
const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) {
        try {
            require(`./functions/${folder}/${file}`)(client);
        } catch (error) {
            console.error(`Error loading function ${file} in folder ${folder}: `, error);   
        }
    }
}

/* Launch handlers */
client.handleEvents();
client.handleCommands();
client.handleComponents();

/* Launch client */
client.login(token);

/* Fetch all guilds the client is in */
client.guilds.fetch();

/* Connect to MongoDB */
(async () => {
    await connect(databaseToken).catch(console.error);
})();

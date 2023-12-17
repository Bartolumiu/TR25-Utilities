const { Schema, model } = require('mongoose');
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    userVerification: {
        enabled: Boolean,
        role: String,
    },
    welcome: {
        enabled: Boolean,
        channel: String,
        message: {
            title: { type: String, default: 'Welcome' },
            color: { type: String, default: 'RANDOM' },
            description: { type: String, default: `Welcome to {server}, {user}!` },
            footer: String,
        }
    },
    leave: {
        enabled: Boolean,
        channel: String,
        message: {
            title: { type: String, default: 'Goodbye' },
            color: { type: String, default: 'RANDOM' },
            description: { type: String, default: `{user} has left the server.` },
            footer: String,
        }
    },
    setupDate: { type: Date, default: Date.now },
}, {
    versionKey: false
});

module.exports = model('Guild', guildSchema, 'guilds');
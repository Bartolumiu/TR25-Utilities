const { Schema, model } = require('mongoose');
const botSchema = new Schema({
    _id: Schema.Types.ObjectId,
    botId: String,
    botName: String,
    botAvatar: { type: String, required: false },
}, {
    versionKey: false
});

module.exports = model('Bot', botSchema, 'bot_settings');
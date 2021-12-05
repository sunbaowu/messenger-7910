const Sequelize = require("sequelize");
const db = require("../db");

const ConversationUser = db.define("conversation_user", {
    lastRead: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
});
module.exports = ConversationUser;
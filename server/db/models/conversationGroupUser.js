const Sequelize = require("sequelize");
const db = require("../db");

const ConversationGroupUser = db.define("conversation_group_user", {
    lastRead: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
});
module.exports = ConversationGroupUser;
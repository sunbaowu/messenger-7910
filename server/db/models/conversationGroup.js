const { Sequelize } = require("sequelize");
const db = require("../db");

const ConversationGroup = db.define("conversation_group", {
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
});


module.exports = ConversationGroup;

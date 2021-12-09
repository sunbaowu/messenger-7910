const Sequelize = require("sequelize");
const db = require("../db");

const GroupMessage = db.define("group_message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = GroupMessage;

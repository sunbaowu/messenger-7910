const { Op, Sequelize } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ""
  },
});

// find conversation given two user Ids

// Conversation.findConversation = async function (user1Id, user2Id) {
//   const conversation = await Conversation.findOne({
//     where: {
//       user1Id: {
//         [Op.or]: [user1Id, user2Id]
//       },
//       user2Id: {
//         [Op.or]: [user1Id, user2Id]
//       }
//     }
//   });

//   // return conversation or null if it doesn't exist
//   return conversation;
// };

module.exports = Conversation;

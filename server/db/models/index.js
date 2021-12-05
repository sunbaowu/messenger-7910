const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationUser = require("./conversationUser");

// associations

User.hasMany(ConversationUser);
ConversationUser.belongsTo(User, { as: "user" });

Conversation.hasMany(ConversationUser);
ConversationUser.belongsTo(Conversation, { as: "conversation" });

Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  ConversationUser,
  Message
};

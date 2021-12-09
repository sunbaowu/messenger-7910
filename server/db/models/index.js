const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationUser = require("./conversationGroupUser");
const ConversationGroup = require("./conversationGroup");
const ConversationGroupUser = require("./conversationGroupUser");
const GroupMessage = require("./groupMessage");

// associations
User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

User.belongsToMany(ConversationGroup , {through: ConversationGroupUser});
ConversationGroup.belongsToMany(User , {through: ConversationGroupUser});

GroupMessage.belongsTo(ConversationGroup);
ConversationGroup.hasMany(GroupMessage);

module.exports = {
  User,
  Conversation,
  ConversationUser,
  Message,
  ConversationGroup, 
  ConversationGroupUser, 
  GroupMessage
};

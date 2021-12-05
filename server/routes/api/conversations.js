const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "user1LastRead", "user2LastRead"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        convoJSON.otherUserLastRead = convoJSON.user1LastRead;
        convoJSON.lastRead = convoJSON.user2LastRead;
        delete convoJSON.user1;
        delete convoJSON.user1LastRead;
        delete convoJSON.user2LastRead;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        convoJSON.otherUserLastRead = convoJSON.user2LastRead;
        convoJSON.lastRead = convoJSON.user1LastRead;
        delete convoJSON.user2;
        delete convoJSON.user1LastRead;
        delete convoJSON.user2LastRead;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// update all the unread messages not sent by current user in the conversation to read
router.patch("/:conversationId/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversationId = parseInt(req.params.conversationId);
    const { lastRead } = req.body;

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      }
    });

    if (
      conversation &&
      (conversation.user1Id === userId || conversation.user2Id === userId)
    ) {
      await Conversation.update({
        [conversation.user1Id === userId ? "user1LastRead" : "user2LastRead"]: lastRead,
      }, {
        where: {
          id: conversationId
        },
      });
      res.json({ lastRead });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const countUnreadMessages = (convo, userId) => {
  let count = 0;

  for (let i = convo.messages.length - 1; i >= 0; i--) {
    const message = convo.messages[i];
    if (message.id > convo.lastRead) {
      if (message.senderId !== userId) {
        count++;
      }
    } else {
      break;
    }
  }

  return count;
};

export const addMessageToStore = (state, payload, userId) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;

    newConvo.unreadCount = countUnreadMessages(newConvo, userId);
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };

      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadCount = countUnreadMessages(convoCopy, userId);

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const setConvosToStore = (conversations, userId) => {
  conversations.forEach(conversation => {
    conversation.messages = conversation.messages.reverse();
    conversation.unreadCount = countUnreadMessages(conversation, userId);
  });
  return conversations;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };

      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadCount = 0;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const readMessagesInStore = (state, conversationId, lastRead) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.lastRead = lastRead;
      convoCopy.unreadCount = countUnreadMessages(convoCopy, convoCopy.lastRead);

      return convoCopy;
    } else {
      return convo;
    }
  });
};


export const otherUserReadMessagesInStore = (state, conversationId, lastRead) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.otherUserLastRead = lastRead;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

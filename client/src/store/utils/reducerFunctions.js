const countUnreadMessages = (convo, userId) => {
  let count = 0;

  convo.messages.forEach((message) => {
    if (message.senderId !== userId && message.read === false) {
      count++;
    }
  });

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
      // making sure it is a pure function
      const newConvo = {
        ...convo,
        messages: [...convo.messages, message],
        latestMessageText: message.text
      };
      newConvo.unreadCount = countUnreadMessages(newConvo, userId);
      return newConvo;
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
      //making sure it is a pure function
      const newConvo = {
        ...convo,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
        unreadCount: 0,
      };

      return newConvo;
    } else {
      return convo;
    }
  });
};

export const readMessagesInStore = (state, conversationId, userId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = {
        ...convo,
        unreadCount: 0
      };

      newConvo.messages.forEach((message) => {
        if (message.senderId !== userId && message.read === false) {
          message.read = true;
        }
      });

      return newConvo;
    } else {
      return convo;
    }
  });
};


export const readByReceiverMessagesInStore = (state, conversationId, userId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = {
        ...convo
      };

      newConvo.messages.forEach((message) => {
        if (message.senderId === userId && message.read === false) {
          message.read = true;
        }
      });

      return newConvo;
    } else {
      return convo;
    }
  });
};

import {
  setConvosToStore,
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  readMessagesInStore,
  readByReceiverMessagesInStore,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const READ_MESSAGES = "READ_MESSAGES"
const READ_BY_RECEIVER_MESSAGES = "READ_BY_RECEIVER_MESSAGES";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";

// ACTION CREATORS

export const gotConversations = (conversations, userId) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
    userId
  };
};

export const setNewMessage = (message, sender, userId) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
    userId
  };
};

export const setReadMessages = (conversationId, userId) => {
  return {
    type: READ_MESSAGES,
    conversationId,
    userId
  };
};

export const setReadByReceiverMessages = (conversationId, userId) => {
  return {
    type: READ_BY_RECEIVER_MESSAGES,
    conversationId,
    userId
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return setConvosToStore(action.conversations, action.userId);
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload, action.userId);
    case READ_MESSAGES:
      return readMessagesInStore(state, action.conversationId, action.userId);
    case READ_BY_RECEIVER_MESSAGES:
      return readByReceiverMessagesInStore(state, action.conversationId, action.userId);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    default:
      return state;
  }
};

export default reducer;

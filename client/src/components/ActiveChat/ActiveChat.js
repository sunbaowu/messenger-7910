import React, { useEffect, useRef, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { readMessages } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, readMessages } = props;
  const conversation = useMemo(() => (props.conversation || {}), [props.conversation]);
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (conversation.unreadCount && user.id) {
      timer.current = setTimeout(() => {
        readMessages(conversation, user.id);
      }, 2000);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    }
  }, [conversation, user, readMessages]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    readMessages: (conversation, userId) => {
      if (conversation.unreadCount > 0) {
        dispatch(readMessages(conversation.id, userId));
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);

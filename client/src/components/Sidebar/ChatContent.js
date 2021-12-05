import React from "react";
import { Chip, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: (props) => ({
    fontSize: 12,
    letterSpacing: -0.17,
    color: props.conversation.unreadCount > 0 ? "#000000" : "#9CADC8",
    fontWeight: props.conversation.unreadCount > 0 ? "bold" : "normal"
  }),
  unreadCount: {
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    color: "white",
    fontWeight: "bold",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles(props);

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadCount } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unreadCount > 0 && (<Chip className={classes.unreadCount} label={unreadCount || 0} />)}
    </Box>
  );
};

export default ChatContent;

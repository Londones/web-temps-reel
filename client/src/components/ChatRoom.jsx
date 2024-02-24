import { useState, useEffect, forwardRef } from "react";
import useAuth from "../hooks/useAuth";
import {
  Button,
  Card,
  Chip,
  TextField,
  MuiAlert,
  Snackbar,
  AlertTitle,
} from "@mui/material";
import { SocketProvider } from "../api/SocketProvider";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ChatRoom = ({ sessionId }) => {
  const { socket } = SocketProvider;
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [cheatAlert, setCheatAlert] = useState(false);
  const [cheatMessage, setCheatMessage] = useState("");

  useEffect(() => {
    SocketProvider.joinChat(sessionId, auth.username);

    SocketProvider.registerRoomUsers(handleRoomUsers);
    SocketProvider.registerChatReceived(handleChatReceived);
    SocketProvider.registerChatHistory(handleChatHistory);
    SocketProvider.listenToQuizQuestions(quizIdHandler);
    SocketProvider.listenToCheatingAttempt(cheatDetection);

    return () => {
      socket.disconnect();
    };
  }, [socket, sessionId, auth.username]);

  const handleChatReceived = (data) => {
    setMessages((messages) => [...messages, data]);
  };

  const handleChatHistory = (data) => {
    setMessages(data);
  };

  const handleRoomUsers = (users) => {
    setRoomUsers(users);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    SocketProvider.sendMessage(message, sessionId, auth.username, quizId);
    setMessage("");
  };

  const handleChatMessage = (e) => {
    setMessage(e.target.value);
  };

  const quizIdHandler = (data) => {
    setQuizId(data.quizId);
  };

  const cheatDetection = (data) => {
    setCheatMessage(data.username + " " + data.message);
    setCheatAlert(true);
  };

  const handleClose = () => {
    setCheatAlert(false);
    setCheatMessage("");
  };

  const UsersList = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "1rem",
        }}
      >
        <p
          style={{
            marginTop: "0",
            fontWeight: "bold",
          }}
        >
          Users in the room
        </p>
        <div>
          {roomUsers.map((user, index) => (
            <div key={index}>{user}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Card
        style={{
          width: "25rem",
          padding: "1rem",
        }}
      >
        <Snackbar
          open={cheatAlert}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={"warning"}
            sx={{ width: "100%" }}
          >
            <AlertTitle>Cheating detected!!</AlertTitle>
            {cheatMessage}
          </Alert>
        </Snackbar>
        <h2>Chat Room {sessionId}</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div>
            <div
              style={{
                overflowY: "scroll",
                height: "20rem",
              }}
            >
              {messages.map((message, index) => (
                <div
                  style={{
                    margin: "0.2rem",
                    display: "flex",
                    justifyContent:
                      message.username === auth.username
                        ? "flex-end"
                        : "flex-start",
                  }}
                  key={index}
                >
                  <Chip
                    sx={{
                      height: "2rem",
                      "& .MuiChip-label": {
                        display: "block",
                        whiteSpace: "normal",
                      },
                    }}
                    label={message.username + ": " + message.message}
                    variant="outlined"
                    color={
                      message.username === auth.username
                        ? "primary"
                        : "secondary"
                    }
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <TextField
                name="message"
                label="Message"
                variant="outlined"
                value={message}
                onChange={handleChatMessage}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
          {roomUsers && <UsersList />}
        </div>
      </Card>
    </div>
  );
};

export default ChatRoom;

import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Avatar, Button, Chip, TextField } from "@mui/material";

const ChatRoom = ({ socket, sessionId }) => {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    socket.emit("join-room", { sessionId, username: auth.username });
    socket.on("message", (data) => {
      setMessages((messages) => [...messages, data]);
    });
    socket.on("room-users", (users) => {
      setRoomUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", { message, sessionId, username: auth.username });
    setMessage("");
  };

  const handleChatMessage = (e) => {
    setMessage(e.target.value);
  };

  const UsersList = () => {
    return (
      <div>
        <h3>Users in the room</h3>
        <ul>
          {roomUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div>
        <h2>Room Chat</h2>
        <p>Session ID: {sessionId}</p>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {`${message.username}:`}
              <Chip
                sx={{
                  height: "auto",
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                  },
                }}
                label={message.message}
                variant="outlined"
                color={
                  message.username === auth.username ? "primary" : "secondary"
                }
                avatar={<Avatar>{message.username[0]}</Avatar>}
              />
            </li>
          ))}
        </ul>
        <TextField
          name="message"
          label="Message"
          variant="outlined"
          value={message}
          onChange={handleChatMessage}
          fullWidth
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
      <UsersList />
    </>
  );
};

export default ChatRoom;

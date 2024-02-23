import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Avatar, Button, Chip, TextField } from "@mui/material";

const ChatRoom = ({ socket, sessionId }) => {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    socket.emit("join-chat", { sessionId, username: auth.username });

    const handleChatReceived = (data) => {
      console.log("Message received", data);
      setMessages((messages) => [...messages, data]);
    };

    const handleRoomUsers = (users) => {
      console.log("Room users", users);
      setRoomUsers(users);
    };

    socket.on("chat-received", handleChatReceived);
    socket.on("room-users", handleRoomUsers);

    return () => {
      socket.disconnect();
    };
  }, [socket, sessionId, auth.username]);

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
        <h2>Chat Room {sessionId}</h2>
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
        />
        <Button onClick={handleSendMessage}>Send</Button>
        {roomUsers && <UsersList />}
      </div>
    </>
  );
};

export default ChatRoom;

import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Avatar, Button, Chip, TextField } from "@mui/material";
import { SocketProvider } from "../api/SocketProvider";

const ChatRoom = ({ sessionId }) => {
  const { socket } = SocketProvider;
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    const handleChatReceived = (data) => {
      console.log("Message received", data);
      setMessages((messages) => [...messages, data]);
    };

    const handleRoomUsers = (users) => {
      console.log("Room users", users);
      setRoomUsers(users);
    };

    SocketProvider.joinChat(
      sessionId,
      auth.username,
      handleChatReceived,
      handleRoomUsers
    );

    return () => {
      socket.disconnect();
    };
  }, [socket, sessionId, auth.username]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("Sending message", message);
    SocketProvider.sendMessage(message, sessionId, auth.username);
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

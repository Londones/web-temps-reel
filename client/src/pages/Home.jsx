import Typography from "@mui/material/Typography";
import JoinQuizComponent from "../components/JoinQuiz";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatRoom from "../components/ChatRoom";

const Home = () => {
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:3000");
  const [chatJoined, setChatJoined] = useState(false);

  useEffect(() => {
    const handleCreateSession = () => {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      setSessionId(newSessionId);
      socket.emit("session-created", newSessionId);
    };
    handleCreateSession();
  }, []);

  socket.on("response-join", (data) => {
    setMessage(data);
  });

  return (
    <div>
      <Typography variant="h4" component="h2">
        Home
      </Typography>
      {sessionId && (
        <JoinQuizComponent
          socket={socket}
          sessionId={sessionId}
          handleJoin={setChatJoined}
        />
      )}
      {sessionId && <p>Session ID: {sessionId}</p>}
      {message && <p>{message}</p>}
      {chatJoined && <ChatRoom socket={socket} sessionId={sessionId} />}
    </div>
  );
};

export default Home;

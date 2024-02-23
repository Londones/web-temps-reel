import { Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { SocketProvider } from "../api/SocketProvider";

const Home = () => {
  const [sessionId, setSessionId] = useState(null);

  const handleCreateSession = () => {
    let newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
    SocketProvider.createRoomSession(newSessionId, (data) => {
      console.log("session created", data);
      if (data.sessionId === newSessionId && Array.isArray(data.quizzes)) {
        setSessionId(newSessionId);
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <div>
      <Typography variant="h4" component="h2">
        Home
      </Typography>
      <Button
        color="secondary"
        variant="outlined"
        size="small"
        onClick={handleCreateSession}
      >
        Create new session
      </Button>
      {sessionId && <p>Session ID: {sessionId}</p>}
      {sessionId && (
        <Button color="secondary" variant="outlined" size="small">
          Create quiz for session
        </Button>
      )}
    </div>
  );
};

export default Home;

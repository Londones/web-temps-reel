import { useState } from "react";
import Button from "@mui/material/Button";
import ChatRoom from "./ChatRoom";
import useAuth from "../hooks/useAuth";

const JoinQuizComponent = ({ socket, sessionId, handleJoin }) => {
  const [message, setMessage] = useState("");
  const { auth } = useAuth();

  const joinQuiz = () => {
    if (sessionId) {
      socket.emit("join-room", sessionId);
      handleJoin(true);
    } else {
      setMessage("No session ID to join");
    }
  };
  return (
    <>
      <Button variant="outlined" onClick={joinQuiz}>
        Join Room
      </Button>
      {message && <p>{message}</p>}
    </>
  );
};

export default JoinQuizComponent;

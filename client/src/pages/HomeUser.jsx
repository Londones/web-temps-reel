import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { SocketProvider } from "../api/SocketProvider";
import useAuth from "../hooks/useAuth";
import ChatRoom from "../components/ChatRoom";

const Home = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const { sessionQuiz, setSessionQuiz, auth } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleJoinSession = () => {
    SocketProvider.joinRoom(sessionQuiz, (data) => {
      console.log("joinRoom ok", data, sessionQuiz);
      setSessionQuiz(data.sessionId);
      setQuizzes(data.quizzes);
      setSessionId(sessionQuiz);
    });
  };

  const handleTextChange = (newValue) => {
    console.log("handleTextChange", newValue);
    setSessionQuiz(newValue);
  };

  const handleOpenChat = () => {
    setShowChat(!showChat);
  };

  SocketProvider.registerQuizSessionStarted((data) => {
    console.log("quiz-session-started", data, sessionQuiz, sessionId);
    if (data.sessionId === sessionQuiz && data.quizId) {
      navigate(`/displayQuiz/${data.quizId}`);
    }
  });

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        class="home"
        style={{ color: "white", marginTop: "4%", fontSize: "2.5em" }}
      >
        Hi <i>{auth?.username}</i> ! Welcome here !
      </Typography>
      {sessionId && (
        <Typography variant="h2" component="h1" class="home">
          Wait for the quiz to start
        </Typography>
      )}
      {!sessionId && (
        <div class="join-session-card">
          <Typography
            variant="h4"
            component="h2"
            class="home"
            style={{ color: "black" }}
          >
            Join a session
          </Typography>
          <TextField
            id="outlined-basic"
            label="Session ID"
            variant="outlined"
            onChange={(e) => handleTextChange(e.target.value)}
          />
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={handleJoinSession}
            style={{ marginTop: "1rem" }}
          >
            Join session
          </Button>
        </div>
      )}
      {sessionId && (
        <>
          <a
            onClick={handleOpenChat}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "3%",
              bottom: "4%",
            }}
          >
            <img
              src="/src/assets/speech-bubble.png"
              style={{ width: "5rem" }}
            />
          </a>
          <ChatRoom show={showChat} sessionId={sessionId} />
        </>
      )}
    </div>
  );
};

export default Home;

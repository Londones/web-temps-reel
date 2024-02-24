import { Typography, Button, TextField } from "@mui/material";
import QuizListComponent from "../components/QuizList";
import { useState } from "react";
import { SocketProvider } from "../api/SocketProvider";
import useAuth from "../hooks/useAuth";
import ChatRoom from "../components/ChatRoom";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { sessionQuiz, setSessionQuiz, auth } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleJoinSession = () => {
    SocketProvider.joinRoom(sessionQuiz, (data) => {
      setSessionQuiz(sessionQuiz);
      setQuizzes(data.quizzes);
      setSessionId(sessionQuiz);
    });
  };

  const handleOpenChat = () => {
    setShowChat(!showChat); 
  };

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        class="home"
        style={{ color: "white", marginTop: "4em", fontSize: "2.5em" }}
      >
        Hi <i>{auth?.username}</i> ! Welcome here !
      </Typography>
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
            onChange={(e) => setSessionQuiz(e.target.value)}
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
      {sessionQuiz && <QuizListComponent quizzes={quizzes} isAdmin={false} />}
      {sessionId && (
        <>
          <a onClick={handleOpenChat} style={{ cursor: "pointer", position: 'absolute', right: '3%', bottom: '4%' }}>
            <img
              src="/src/assets/speech-bubble.png"
              style={{ width: "5rem" }}
            />
          </a>
          {showChat && <ChatRoom sessionId={sessionId} />}
        </>
      )}
    </div>
  );
};

export default Home;

import { Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { SocketProvider } from "../api/SocketProvider";
import QuizListComponent from "../components/QuizList";

const Home = () => {
  const [sessionId, setSessionId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const userName = localStorage.getItem("userName") || "";

  const handleCreateSession = () => {
    let newSessionId = Math.random().toString(36).substring(2, 15);
    SocketProvider.createRoomSession(newSessionId, (data) => {
      console.log("session created", data);
      if (data.sessionId === newSessionId) {
        setSessionId(newSessionId);
      }
      if (data.quizzes && Array.isArray(data.quizzes)) {
        setQuizzes(data.quizzes);
      }
    });
  };

  const handleCreateQuiz = () => {
    setShowCreateQuiz(true);
  };

  const handleAddQuiz = (quiz) => {
    console.log("handleAddQuiz", quiz);
    SocketProvider.addQuizToSession(sessionId, quiz, (data) => {
      console.log("addQuiz ok", data);
    });
  };

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        className="home"
        style={{ color: "white", marginTop: "4em", fontSize: "2.5em" }}
      >
        Hi <i>{userName}</i> ! Welcome here !
      </Typography>
      <div className="create-session-card">
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
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={handleCreateQuiz}
          >
            Select quiz for session
          </Button>
        )}
      </div>
      <div>
        <Typography
          variant="h4"
          component="h2"
          className="home"
          style={{ color: "white", "font-size": "1.5em" }}
        >
          Pick the Session's Quiz
        </Typography>
        {showCreateQuiz && (
          <QuizListComponent
            quizzes={quizzes}
            isAdmin={true}
            addQuiz={handleAddQuiz}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

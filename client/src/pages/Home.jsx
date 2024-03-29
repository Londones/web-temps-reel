import { Typography, Button, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { SocketProvider } from "../api/SocketProvider";
import QuizListComponent from "../components/QuizList";
import useAuth from "../hooks/useAuth";
import ListNotifs from "../components/ListNotif";

const Home = () => {
  const [sessionId, setSessionId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const { auth } = useAuth();

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
    SocketProvider.addQuizToSession(sessionId, quiz, auth?.username, (data) => {
      console.log("addQuiz ok", data);
    });
  };

  return (
    <div>
      <ListNotifs type={"success"} />
      <Typography
        variant='h4'
        component='h2'
        class='home'
        style={{ color: "white", marginTop: "1em", fontSize: "2.5em" }}
      >
        Hi <i>{auth.firstName}</i> ! Welcome here !
      </Typography>
      <div class='create-session-card'>
        <Button color='secondary' variant='outlined' size='small' onClick={handleCreateSession}>
          Create new session
        </Button>
        {sessionId && <p>Session ID: {sessionId}</p>}
        <Alert severity='warning' style={{ margin: "1rem" }}>
          This session ID will show only once. Make sure to copy and save it.
        </Alert>
        {sessionId && (
          <Button color='secondary' variant='outlined' size='small' onClick={handleCreateQuiz}>
            Select quiz for session
          </Button>
        )}
      </div>
      <div>
        {showCreateQuiz && (
          <>
            <Typography
              variant='h4'
              component='h2'
              class='home'
              style={{ color: "white", fontSize: "1.5em", marginTop: "auto" }}
            >
              Pick the Session's Quiz
            </Typography>
            <Alert severity='warning' style={{ margin: "auto", width: "fit-content" }}>
              Make sur to share the session's code before starting the Quiz.
            </Alert>
            <QuizListComponent quizzes={quizzes} isAdmin={true} addQuiz={handleAddQuiz} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

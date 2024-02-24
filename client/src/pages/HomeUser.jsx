import { Typography, Button, TextField } from "@mui/material";
import QuizListComponent from "../components/QuizList";
import { useState } from 'react';
import { SocketProvider } from "../api/SocketProvider";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { sessionQuiz, setSessionQuiz } = useAuth();
  const userName = localStorage.getItem('userName') || '';
  
  const handleJoinSession = () => {
    SocketProvider.joinRoom(sessionQuiz, (data) => {
      setSessionQuiz(sessionQuiz);
      setQuizzes(data.quizzes);
    });
  };

  return (
    <div>
      <Typography variant="h4" component="h2" class="home" style={{ "color": "white", 'marginTop' : '4em', 'font-size' : "2.5em" }}>Hi <i>{userName}</i> ! Welcome here !</Typography>
      <div class="join-session-card">
        <Typography variant="h4" component="h2" class="home" style={{ "color": "black" }}>Join a session</Typography>
        <TextField id="outlined-basic" label="Session ID" variant="outlined" onChange={(e) => setSessionQuiz(e.target.value)} />
        <Button color="secondary" variant="outlined" size="small" onClick={handleJoinSession} style={{ "marginTop": "1rem" }}>Join session</Button>
      </div>
      {sessionQuiz && <QuizListComponent quizzes={quizzes} isAdmin={false} />}
    </div>
  );
}

export default Home;

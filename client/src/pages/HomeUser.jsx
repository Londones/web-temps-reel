import { Typography, Button, TextField } from "@mui/material";
import QuizListComponent from "../components/QuizList";
import { useState } from 'react';
import { SocketProvider } from "../api/SocketProvider";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const { sessionQuiz, setSessionQuiz } = useAuth();

    const handleJoinSession = () => {
        console.log("join session", sessionQuiz);
        SocketProvider.joinRoom(sessionQuiz, (data) => {
            console.log("join session", data);
            setSessionQuiz(sessionQuiz);
            setQuizzes(data.quizzes);
        });
    };

    return (
        <div>
            <Typography variant="h4" component="h2">Home</Typography>
            <TextField id="outlined-basic" label="Session ID" variant="outlined" onChange={(e) => setSessionQuiz(e.target.value)} />
            <Button color="secondary" variant="outlined" size="small" onClick={handleJoinSession}>Join session</Button>
            {sessionQuiz && <QuizListComponent quizzes={quizzes} isAdmin={false} />}
        </div>
    );
}

export default Home;

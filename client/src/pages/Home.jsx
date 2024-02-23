import { Typography, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { SocketProvider } from "../api/SocketProvider";
import QuizListComponent from "../components/QuizList";


const Home = () => {
    const [sessionId, setSessionId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);

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
        setShowCreateQuiz(true)
    };

    const handleAddQuiz = (quiz) => {
        console.log('handleAddQuiz', quiz);
        SocketProvider.addQuizToSession(sessionId, quiz, (data) => {
            console.log('addQuiz ok', data);
        });
    };

    return (
        <div>
            <Typography variant="h4" component="h2">Home</Typography>
            <Button color="secondary" variant="outlined" size="small" onClick={handleCreateSession}>Create new session</Button>
            {sessionId && <p>Session ID: {sessionId}</p>}
            {sessionId &&  
                <Button color="secondary" variant="outlined" size="small" onClick={handleCreateQuiz}>Select quiz for session</Button>
            }
            {showCreateQuiz && <QuizListComponent quizzes={quizzes} isAdmin={true} addQuiz={handleAddQuiz} />}  
        </div>
    );
}

export default Home;

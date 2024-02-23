import Typography from "@mui/material/Typography";
import QuizListComponent from "../components/QuizList";
import { useState, useEffect } from 'react';
import { SocketProvider } from "../api/SocketProvider";


const Home = () => {
    const [sessionId, setSessionId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const handleCreateSession = () => {
            let newSessionId = Math.random().toString(36).substring(2, 15);
            SocketProvider.createRoomSession(newSessionId, (data) => {
                console.log("session created", data);
                if (data.sessionId === newSessionId && Array.isArray(data.quizzes)) {
                    setQuizzes(data.quizzes);
                    setSessionId(newSessionId);
                }
            });
        };
        if(!sessionId) handleCreateSession();
    }, []);

    return (
        <div>
            <Typography variant="h4" component="h2" class="home">Home</Typography>
            {sessionId && <p>Session ID: {sessionId}</p>}
            {setSessionId && <QuizListComponent quizzes={quizzes} />}
        </div>
    );
}

export default Home;

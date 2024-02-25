import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Typography } from '@mui/material';
import { SocketProvider } from '../api/SocketProvider';
import DisplayQuestion from '../components/DisplayQuestion';
import useAuth from "../hooks/useAuth";
import ListNotifs from "../components/ListNotif";

const Quiz = () => {
    const [message, setMessage] = useState("Bienvenu au Quiz!");
    const [question, setQuestion] = useState(null);
    const { sessionQuiz } = useAuth();
    const { id } = useParams();
    const effectRan = useRef(false);
    const usedQuestions = [];
    const [hasCorrect, setHasCorrect] = useState(null);

    const handleAnswer = (answers) => {
        console.log('handleAnswer', answers);
        SocketProvider.anwserQuestion(sessionQuiz, id, question.id, answers);
    }

    const listQuestion = () => {
        console.log('listQuestion', id, usedQuestions);
        SocketProvider.listQuestion(sessionQuiz, id, usedQuestions);

    }

    useEffect(() => {
        const joinRoom = async () => {
            listQuestion();
            SocketProvider.registerQuizQuestion((data) => {
                console.log('quiz-question', data.question);
                setQuestion(data.question);
                if (data.quizId !== id) return;
                else if (!data.question) return setMessage('No more questions!');
                else {
                    usedQuestions.push(data.question.id);
                }
            });
            SocketProvider.registerQuizQuestionResponse((data) => {
                if (data.quizId !== id) return;
                if (data.hasCorrect !== undefined) {
                    setHasCorrect(data.hasCorrect);
                }
                listQuestion();
            });
        }

        if (!effectRan.current) joinRoom();

        return () => effectRan.current = true;
    }, []);

    return (
        <>
            <ListNotifs type={"success"} />
            <div>
                <Typography variant="h4" component="h2" class="home" style={{ marginTop: '2%' }}>{message}</Typography>
                {question &&
                    <DisplayQuestion question={question} hasCorrect={hasCorrect} sendAnswer={handleAnswer} />
                }
            </div>
        </>
    )
}

export default Quiz;
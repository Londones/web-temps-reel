import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Typography } from '@mui/material';
import { SocketProvider } from '../api/SocketProvider';
import DisplayQuestion from '../components/DisplayQuestion';

const Quiz = () => {
    const [message, setMessage] = useState("Loading...");
    const [question, setQuestion] = useState(null);

    const { id } = useParams();
    const effectRan = useRef(false);
    const usedQuestions = [];

    const handleAnswer = (answers) => {
        console.log('handleAnswer', answers);
        SocketProvider.anwserQuestion(id, question.id, answers);
    }

    const listQuestion = () => {
        console.log('listQuestion', id, usedQuestions);
        SocketProvider.listQuestion(id, usedQuestions);
    }

    useEffect(() => {    
        const joinRoom = async () => {
            SocketProvider.joinRoom(id, (response) => {
                console.log('ok quiz', response);   
                setMessage(response.message); 
                listQuestion();
            });
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
                console.log('quiz-question-response', data);
                if (data.quizId !== id) return;
                // if (data.hasCorrect) setMessage('Correct!');
                // else setMessage('Incorrect!');
                listQuestion();
            });
        }

        if (!effectRan.current) joinRoom();

        return () => effectRan.current = true;
     }, []);

    return (
        <>
            <div>
                <Typography variant="h4" component="h2">{message}</Typography>
                { question &&
                    <DisplayQuestion question={question} sendAnswer={handleAnswer} />
                }
            </div>
        </>
    )
}

export default Quiz;
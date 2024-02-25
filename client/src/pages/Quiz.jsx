import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Typography } from '@mui/material';
import { SocketProvider } from '../api/SocketProvider';
import DisplayQuestion from '../components/DisplayQuestion';
import useAuth from "../hooks/useAuth";
import ListNotifs from "../components/ListNotif";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Quiz = () => {
    const [message, setMessage] = useState("Bienvenu au Quiz!");
    const [choiceMessage, setChoiceMessage] = useState("");
    const [question, setQuestion] = useState(null);
    const [userChoices, setUserChoices] = useState([]);
    const { auth, sessionQuiz } = useAuth();
    const { id } = useParams();
    const effectRan = useRef(false);
    const usedQuestions = [];
    const [hasCorrect, setHasCorrect] = useState(null);
    const [open, setOpen] = useState(false);

    const userId = auth?.userId;
    console.log('userId',userId);

    const handleAlert = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }
        setOpen(false);
    };

    const handleAnswer = (answers) => {
        console.log('handleAnswer', answers, userId);
        setUserChoices(answers);
        SocketProvider.anwserQuestion(userId, sessionQuiz, id, question.id, answers, (data) => {
            console.log('anwserQuestion', data);
        });
    }

    const listQuestion = () => {
        console.log('listQuestion', id, userId, usedQuestions);
        SocketProvider.listQuestion(userId, sessionQuiz, id, usedQuestions);

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
    SocketProvider.registerRefUserChoices((data) => {
        if (!question || !data) return;
        if (data.quizId !== id) return;
        if (question.id !== data.questionId) return;
        const keyAnswer = userChoices.join('-');
        console.log('refUserChoices', data.userChoices, keyAnswer);
        if (data.userChoices[keyAnswer]) {
            setChoiceMessage(`${data.userChoices[keyAnswer]} user(s) chose anwser ${keyAnswer}`);
            handleAlert();
        }
    });

    const joinRoom = async () => {
        listQuestion();
        SocketProvider.registerQuizQuestion((data) => {
            console.log('quiz-question', data);
            if (data.userId !== userId) return;
            setQuestion(data.question);
            if (data.quizId !== id) return;
            else if (!data.question) return setMessage('No more questions!');
            else {
                usedQuestions.push(data.question.id);
            }
        });
        SocketProvider.registerQuizQuestionResponse((data) => {
            console.log('quiz-question-response', data);
            if (data.quizId !== id || data.userId !== userId) return;
            if (data.hasCorrect !== undefined) {
                setHasCorrect(data.hasCorrect);
            }
            listQuestion();
        });
    }

    useEffect(() => {
        if (!effectRan.current) joinRoom();

        return () => effectRan.current = true;
    }, []);

    return (
        <>
            <ListNotifs type={"success"} />
            <div>
                <Typography variant="h4" component="h2" class="home" style={{marginTop : '2%'}}>{message}</Typography>
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                    >
                    {choiceMessage}
                    </Alert>
                </Snackbar>
                { question &&
                    <DisplayQuestion question={question} hasCorrect={hasCorrect} sendAnswer={handleAnswer} />
                }
            </div>
        </>
    )
}

export default Quiz;
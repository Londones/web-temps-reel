import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Typography, Backdrop } from "@mui/material";
import { SocketProvider } from "../api/SocketProvider";
import DisplayQuestion from "../components/DisplayQuestion";
import useAuth from "../hooks/useAuth";
import ListNotifs from "../components/ListNotif";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axiosPrivate from "../api/axios";

const Quiz = () => {
  const [message, setMessage] = useState("Bienvenue au Quiz!");
  const [choiceMessage, setChoiceMessage] = useState("");
  const [question, setQuestion] = useState(null);
  const [userChoices, setUserChoices] = useState([]);
  const { auth, sessionQuiz } = useAuth();
  const { id } = useParams();
  const effectRan = useRef(false);
  const usedQuestions = [];
  const [hasCorrect, setHasCorrect] = useState(null);
  const [open, setOpen] = useState(false);
  const [displayLeaderboard, setDisplayLeaderboard] = useState(false);
  const [rank, setRank] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const userId = auth?.userId;

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
    console.log("handleAnswer", answers, userId);
    setUserChoices(answers);
    SocketProvider.anwserQuestion(
      userId,
      sessionQuiz,
      id,
      question.id,
      answers,
      auth?.username,
      (data) => {
        console.log("anwserQuestion", data);
      }
    );
  };

  const listQuestion = () => {
    console.log("listQuestion", id, userId, usedQuestions);
    SocketProvider.listQuestion(userId, sessionQuiz, id, usedQuestions);
  };

  const saveFinalScore = (quizId) => {
    SocketProvider.registerPersonalRanking((data) => {
      axiosPrivate.post("/score", {
        quizId: quizId,
        userId,
        score: data.score,
        rank: data.rank,
      });
      setRank(data.rank);
      setFinalScore(data.score);
    });
    setDisplayLeaderboard(true);
  };

  SocketProvider.registerRefUserChoices((data) => {
    if (!question || !data) return;
    if (data.quizId !== id) return;
    if (question.id !== data.questionId) return;
    const keyAnswer = userChoices.join("-");
    console.log("refUserChoices", data.userChoices, keyAnswer);
    if (data.userChoices[keyAnswer]) {
      setChoiceMessage(`${data.userChoices[keyAnswer]} user(s) chose anwser ${keyAnswer}`);
      handleAlert();
    }
  });

  const joinRoom = () => {
    listQuestion();
    SocketProvider.registerQuizQuestion((data) => {
      console.log("quiz-question", data);
      if (data.userId !== userId) return;
      setQuestion(data.question);
      if (data.quizId !== id) return;
      else if (!data.question) {
        SocketProvider.declareLastQuestion();
        saveFinalScore(id);
        return setMessage("No more questions!");
      } else {
        usedQuestions.push(data.question.id);
      }
    });
    SocketProvider.registerQuizQuestionResponse((data) => {
      console.log("quiz-question-response", data);
      if (data.quizId !== id || data.userId !== userId) return;
      if (data.hasCorrect !== undefined) {
        setHasCorrect(data.hasCorrect);
      }
      listQuestion();
    });
  };

  useEffect(() => {
    if (!effectRan.current) joinRoom();
    return () => (effectRan.current = true);
  }, []);

  const handleDisplayLeaderboard = () => {
    setDisplayLeaderboard(!displayLeaderboard);
  };

  if (displayLeaderboard) {
    return (
      <Backdrop
        open={displayLeaderboard}
        style={{ zIndex: 1000 }}
        onClick={handleDisplayLeaderboard}
      >
        <Typography variant='h4' component='h2' class='home' style={{ marginTop: "2%" }}>
          Your rank: {rank} Your score: {finalScore}
        </Typography>
      </Backdrop>
    );
  }

  return (
    <>
      <ListNotifs type={"success"} />
      <div>
        <Typography variant='h4' component='h2' class='home' style={{ marginTop: "2%" }}>
          {message}
        </Typography>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='success' variant='filled' sx={{ width: "100%" }}>
            {choiceMessage}
          </Alert>
        </Snackbar>
        {question && (
          <DisplayQuestion question={question} hasCorrect={hasCorrect} sendAnswer={handleAnswer} />
        )}
      </div>
    </>
  );
};

export default Quiz;

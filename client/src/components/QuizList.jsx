import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinQuizCard from "./JoinQuizCard";
import io from "socket.io-client";

const QuizListComponent = ({ quizzes, addQuiz, isAdmin }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:3000");
  const [timer, setTimer] = useState(0);

 const handleJoinQuiz = (quiz) => {
  if (quiz && quiz.id) {
    navigate(`/displayQuiz/${quiz.id}`);
  } else {
    setMessage("No available quiz to join!");
  }
 }
 const handleAddQuiz = (quiz) => {
  addQuiz(quiz);
 }

 useEffect(() => {
  if (socket) {
    socket.on("question-timeout", () => {
      console.log("question-timeout");
      setMessage("Le temps pour répondre à la question est écoulé !");
    });

    socket.on("timer-dec", (data) => {
      setTimer(data);
      console.log(timer);
    });
  }
  return () => {
    if (socket) {
      socket.off("question-timeout");
    }
  };
}, [socket]);

return (
  <>
    {timer > 0 && <p>Temps restant: {timer} secondes</p>}
    {message && <p>{message}</p>}
    <div class="quizzes">
      {quizzes.map((quiz, i) => (
        <JoinQuizCard
          class="quiz-card"
          key={i}
          quiz={quiz}
          isAdmin={isAdmin}
          joinQuiz={handleJoinQuiz}
          addQuiz={handleAddQuiz}
        />
      ))}
    </div>
  </>
);

}



export default QuizListComponent;

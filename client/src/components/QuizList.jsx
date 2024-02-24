import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinQuizCard from "./JoinQuizCard";
import { SocketProvider } from "../api/SocketProvider";

const QuizListComponent = ({ quizzes, addQuiz, isAdmin }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const { socket } = SocketProvider;

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
  // console.log(SocketProvider.startTimer());
  // return () => {
  //   if (socket) {
  //     socket.off("question-timeout");
  //   }
  // };
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

import React, { useEffect, useState } from "react";
import JoinQuizCard from "./JoinQuizCard";
import { SocketProvider } from "../api/SocketProvider";

const QuizListComponent = ({ quizzes, addQuiz, isAdmin }) => {
  const [message, setMessage] = useState("");
  const { socket } = SocketProvider;

 const handleAddQuiz = (quiz) => {
  addQuiz(quiz);
 }


return (
  <>
    {message && <p>{message}</p>}
    <div class="quizzes">
      {quizzes.map((quiz, i) => (
        <JoinQuizCard
          class="quiz-card"
          key={i}
          quiz={quiz}
          isAdmin={isAdmin}
          addQuiz={handleAddQuiz}
        />
      ))}
    </div>
  </>
);

}



export default QuizListComponent;

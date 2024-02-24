import React from 'react';
import { useNavigate } from 'react-router-dom';
import JoinQuizCard from './JoinQuizCard';

const QuizListComponent = ({ quizzes, addQuiz, isAdmin }) => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");

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
 return (
  <>
    <div className="quizzes">
    {quizzes.map((quiz, i) => (
      <JoinQuizCard className="quiz-card" key={i} quiz={quiz} isAdmin={isAdmin} joinQuiz={handleJoinQuiz} addQuiz={handleAddQuiz}/>
    ))}
    </div>
  </>
 );
}

export default QuizListComponent;
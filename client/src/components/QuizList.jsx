import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import JoinQuizCard from './JoinQuizCard';
import { SocketProvider } from '../api/SocketProvider';

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
    {quizzes.map((quiz, i) => (
      <JoinQuizCard key={i} quiz={quiz} isAdmin={isAdmin} joinQuiz={handleJoinQuiz} addQuiz={handleAddQuiz}/>
    ))}
  </>
 );
}

export default QuizListComponent;
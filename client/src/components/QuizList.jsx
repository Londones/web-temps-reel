import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import JoinQuizCard from './JoinQuizCard';
import { SocketProvider } from '../api/SocketProvider';

const QuizListComponent = ({ quizzes }) => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");

 const handleJoinQuiz = (quiz) => {
  if (quiz && quiz.id) {
    navigate(`/displayQuiz/${quiz.id}`);
  } else {
    setMessage("No available quiz to join!");
  }
 }
 return (
  <>
    {quizzes.map((quiz, i) => (
      <JoinQuizCard key={i} quiz={quiz} joinQuiz={handleJoinQuiz} />
    ))}
  </>
 );
}

export default QuizListComponent;
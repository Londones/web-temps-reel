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
    <div class="quizzes">
    {quizzes.map((quiz, i) => (
      <JoinQuizCard class="quiz-card" key={i} quiz={quiz} joinQuiz={handleJoinQuiz} />
    ))}
    </div>
  </>
 );
}

export default QuizListComponent;
import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';

const JoinQuizComponent = ({ socket, sessionId }) => {
 const [message, setMessage] = useState("");

 const joinQuiz = () => {
  if (sessionId) {
   socket.emit("join-room", sessionId);
  } else {
   setMessage("No session ID to join");
  }
 }
 return (
  <>
   <Button variant="outlined" onClick={joinQuiz}>Join Room</Button>
   {message && <p>{message}</p>}
  </>
 );
}

export default JoinQuizComponent;
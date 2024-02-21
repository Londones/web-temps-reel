import React from 'react';
import { useState } from 'react';

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
   <button onClick={joinQuiz}>
    Join Room
   </button>
   {message && <p>{message}. Créer une session</p>}
  </>
 );
}

export default JoinQuizComponent;
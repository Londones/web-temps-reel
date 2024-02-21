import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import JoinQuizComponent from "./components/JoinQuiz";
import io from "socket.io-client";
import "./App.css";

function App() {
  const { auth } = useAuth();
  const socket = io("http://localhost:3000");
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCreateSession = () => {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      setSessionId(newSessionId);
      socket.emit("session-created", newSessionId);
    };

    handleCreateSession();
  }, []);

  //*message reponse à la connexion à la session
  socket.on("message", (data) => {
    setMessage(data);
  });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
      {sessionId && <JoinQuizComponent socket={socket} sessionId={sessionId} />}
      {sessionId && <p>Session ID: {sessionId}</p>}
      {message && <p>{message}</p>}
    </>
  );
}

export default App;

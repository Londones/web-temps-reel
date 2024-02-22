import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import JoinQuizComponent from "./components/JoinQuiz";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import io from "socket.io-client";
import Quiz from "./pages/Quiz";

function App() {
  const { auth } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

    const handleCreateSession = () => {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      setSessionId(newSessionId);
      socket.emit("session-created", newSessionId);
    };

    handleCreateSession();

    socket.on("message", (data) => {
      setMessage(data);
    });

    return () => {
      socket.off("message"); 
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/quiz/:id" element={<Quiz />} />
        </Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>

      {/* {sessionId && <JoinQuizComponent socket={socket} sessionId={sessionId} />}
      {sessionId && <p>Session ID: {sessionId}</p>}
      {message && <p>{message}</p>} */}
    </Router>
  );
}

export default App;

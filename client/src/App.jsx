import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import io from "socket.io-client";

function App() {
  const { auth } = useAuth();
  useEffect(() => {
    const socket = io("http://localhost:3000");  //remplace par env variable

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Envoi d'un message du client au serveur
    socket.emit("message", "Ceci est un message envoyé depuis le client");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;

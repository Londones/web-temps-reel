import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

function App() {
  const { auth } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/signIn" element={<SignInForm />} />
        <Route path="/signUp" element={<SignUpForm />} />
      </Routes>
    </Router>
  );
}

export default App;

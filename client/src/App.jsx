import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";
import Quiz from "./pages/Quiz";
import PersistLogin from "./auth/PersistLogin";
import RequireAuth from "./components/RequireAuth";

function App() {
  const { auth } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route index element={<Home />} />
            <Route
              path="/admin/*"
              element={<RequireAuth allowedRoles={"admin"} />}
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="quiz" element={<Quiz />} />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;

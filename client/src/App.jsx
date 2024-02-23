import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import AdminDashboard from "./pages/AdminDashboard";
import PersistLogin from "./auth/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import FormCreateQuestion from "./components/FormCreateQuestion";
import HomeUser from "./pages/HomeUser";

function App() {
  const { auth } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route path="/displayQuiz/:id" element={<Quiz />} />
            <Route path="/admin/*" element={<RequireAuth allowedRoles={"admin"} />}>
              <Route index element={<Home />} />  
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="quiz/:id/questions" element={<FormCreateQuestion />} />
            </Route>
            <Route path = "/user/*" element={<RequireAuth allowedRoles={"user"} />}>
              <Route index element={<HomeUser />} />  
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

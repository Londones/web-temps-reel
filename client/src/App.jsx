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
          <Route element={<PersistLogin />}>
            <Route index element={<Home />} />
            <Route
              path="/admin/*"
              element={<RequireAuth allowedRoles={"admin"} />}
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="quiz/:id" element={<Quiz />} />
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

import axios from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate(); 
  const { setAuth } = useAuth();
  const logout = async () => {
    setAuth({});
    try {
      await axios.get("/auth/logout", {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return logout;
};

export default useLogout;
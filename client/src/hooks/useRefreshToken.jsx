import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.post("/refresh-token", {
      refresh_token: auth?.refreshToken,
    });
    setAuth((prev) => {
      const updatedAuth = {
        ...prev,
        accessToken: response.data.token,
        refreshToken: response.data.refresh_token,
      };
      localStorage.setItem("auth", JSON.stringify(updatedAuth));
      return updatedAuth;
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

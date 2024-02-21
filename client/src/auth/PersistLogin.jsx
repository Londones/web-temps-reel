import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import { CircularProgress } from "@mui/material";

const PersistLogin = () => {
  const [isLoading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  return !persist ? <Outlet /> : isLoading ? <CircularProgress /> : <Outlet />;
};

export default PersistLogin;

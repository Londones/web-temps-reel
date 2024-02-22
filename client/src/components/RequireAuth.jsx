import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.role && allowedRoles.includes(auth.role) ? (
    <Outlet />
  ) : auth ? (
    <Navigate to="/" state={{ from: location.pathname }} />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
};

export default RequireAuth;

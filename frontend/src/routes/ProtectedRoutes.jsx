import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { postList } from "../context/Post_List-store";
import { authentication } from "../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { auth, loadingAuth } = useContext(authentication);
  const isLoggedIn = auth.isAuthenticated;
  const location = useLocation();

  if (loadingAuth) {
    return <div>Checking authentication...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

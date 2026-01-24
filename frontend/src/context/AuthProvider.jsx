import { createContext } from "react";
import { useState } from "react";
import { useReducer, useEffect } from "react";
export const authentication = createContext({});
const AuthProvider = ({ children }) => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authUser, setAuthUser] = useState(" ");
  const initialState = {
    userId: null,
    isAuthenticated: false,
  };
  const authReducer = (currState, action) => {
    if (action.type === "login_success") {
      return {
        ...currState,
        userId: action.payload.userId,
        isAuthenticated: true,
      };
    } else if (action.type === "logout") {
      return initialState;
    }
    return currState;
  };
  const [auth, dispatchAuth] = useReducer(authReducer, initialState);

  useEffect(() => {
    fetch("http://localhost:3000/api/checkAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          dispatchAuth({
            type: "login_success",
            payload: { userId: data.userId },
          });
          console.log("User is authenticated");
        } else {
          dispatchAuth({
            type: "logout",
          });
          console.log("User is not authenticated");
        }
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  return (
    <>
      <authentication.Provider
        value={{
          auth,
          dispatchAuth,
          setLoadingAuth,
          loadingAuth,
          authUser: authUser,
          setAuthUser: setAuthUser,
        }}
      >
        {children}
      </authentication.Provider>
    </>
  );
};
export default AuthProvider;

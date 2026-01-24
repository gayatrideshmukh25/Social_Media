import { useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { authentication } from "../context/AuthProvider";

function Login() {
  const navigate = useNavigate();
  const { dispatchAuth, setLoadingAuth } = useContext(authentication);
  console.log(dispatchAuth);
  const location = useLocation();

  let userName = useRef("");
  let password = useRef("");
  const [msg, setMsg] = useState(" ");
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    setMsg("");
    const userNameUser = userName.current.value;
    const passwordUser = password.current.value;

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userName: userNameUser,
          password: passwordUser,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setMsg(data.message);
        setLoadingAuth(false);
      } else {
        dispatchAuth({
          type: "login_success",
          payload: { userId: data.user._id },
        });
        toast.success("Login successful!");
        setLoadingAuth(false);
        navigate("/postify");
      }
    } catch (error) {
      console.error(error);
      setMsg("Something went wrong. Please try again!");
      setLoadingAuth(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="card shadow-sm border-0"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <button
              onClick={() => navigate("/")}
              className="btn btn-sm btn-outline-secondary me-3"
              style={{ border: "none", background: "none" }}
              type="button"
            >
              <FaArrowLeft />
            </button>
            <h2 className="card-title mb-0 fw-bold">Login to Postify</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="inputUserName" className="form-label">
                Username
              </label>
              <input
                ref={userName}
                type="text"
                className="form-control"
                id="inputUserName"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword4" className="form-label">
                Password
              </label>
              <input
                ref={password}
                type="password"
                className="form-control"
                id="inputPassword4"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                Login
              </button>
            </div>

            <div className="invalid-feedback" style={{ display: "block" }}>
              {msg}
            </div>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">
              Don't have an account?{" "}
              <a href="/signup" className="text-decoration-none">
                Sign up
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;

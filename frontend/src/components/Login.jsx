import { useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postList } from "../context/Post_List-store";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  // const contextObj = useContext(postList);

  let userName = useRef("");
  let password = useRef("");
  const [msg, setMsg] = useState(" ");
  const handleLogin = (e) => {
    e.preventDefault();
    const userNameUser = userName.current.value;
    const passwordUser = password.current.value;

    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userName: userNameUser,
        password: passwordUser,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.success) {
          setMsg(data.message);
        } else {
          navigate("/postify");
          toast.success(userNameUser, "Login SuccesFully");
        }
      });
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

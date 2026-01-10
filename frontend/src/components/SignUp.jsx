import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { postList } from "../context/Post_List-store";
import { FaArrowLeft } from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();
  const contextObj = useContext(postList);
  const addUser = contextObj.addUser;
  let email = useRef("");
  let password = useRef("");
  let fullName = useRef("");
  let userName = useRef("");
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("handle sign up called");
    const emailUser = email.current.value;
    const passwordUser = password.current.value;
    const fullNameUser = fullName.current.value;
    const userNameUser = userName.current.value;

    console.log(emailUser, passwordUser, fullNameUser, userNameUser);
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailUser,
        password: passwordUser,
        fullName: fullNameUser,
        userName: userNameUser,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        addUser(data.user);
        navigate("/login");
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
        style={{ maxWidth: "450px", width: "100%", borderRadius: "15px" }}
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
            <h2 className="card-title mb-0 fw-bold">Join Postify</h2>
          </div>
          <form onSubmit={handleSignUp}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="inputFullName" className="form-label">
                  Full Name
                </label>
                <input
                  ref={fullName}
                  type="text"
                  className="form-control"
                  id="inputFullName"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputUserName" className="form-label">
                  Username
                </label>
                <input
                  ref={userName}
                  type="text"
                  className="form-control"
                  id="inputUserName"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                ref={email}
                type="email"
                className="form-control"
                id="inputEmail4"
                placeholder="Enter your email"
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
                placeholder="Create a password"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                Sign Up
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none">
                Login
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUp;

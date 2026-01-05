import { FaPen } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Postify() {
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
      <div className="text-center text-dark">
        <FaPen size={64} className="mb-4" />
        <h1 className="display-3 fw-bold mb-3">Postify</h1>
        <p
          className="lead mb-4"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          Share your thoughts with the world. Connect, create, and express
          yourself freely.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <NavLink to="/login" className="btn btn-primary btn-lg">
            Login
          </NavLink>
          {/* <button className="btn btn-primary btn-lg">Login</button> */}
          <NavLink to="/signup" className="btn btn-primary btn-lg">
            Sign Up
          </NavLink>
          {/* <button className="btn btn-outline-primary btn-lg">Sign Up</button> */}
        </div>
      </div>
    </div>
  );
}

export default Postify;

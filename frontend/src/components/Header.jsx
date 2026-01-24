import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authentication } from "../context/AuthProvider";
import { toast } from "react-toastify";
function Header() {
  const navigate = useNavigate();
  const { auth, dispatchAuth } = useContext(authentication);
  const handleLogout = () => {
    console.log("Logging out...");
    fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatchAuth({
            type: "logout",
          });
          console.log("Logout successful");
          navigate("/login");
          toast.success("Logout SuccessFully");
        }
      });
  };
  return (
    <header
      className="text-bg-dark p-3"
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
    >
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          {/* Brand on the left */}
          <div className="d-flex align-items-center">
            <a
              href="/postify"
              className="d-flex align-items-center text-white text-decoration-none"
            >
              <h4 className="mb-0 fw-bold">Postify ⭐</h4>
            </a>
          </div>

          {/* Search in the center */}
          <div className="d-flex justify-content-center flex-grow-1">
            <form style={{ width: "500px" }}>
              <input
                type="search"
                className="form-control"
                placeholder="Search posts..."
                style={{
                  borderRadius: "25px",
                  border: "none",
                  padding: "8px 16px",
                }}
              />
            </form>
          </div>

          {/* User Actions on the right */}
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                style={{ borderRadius: "25px" }}
              >
                Profile
              </button>
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/postify/myprofile" className="dropdown-item">
                    My Profile
                  </NavLink>
                  {/* <a className="dropdown-item" href="/postify/myprofile">
                    My Profile
                  </a> */}
                </li>
                <li>
                  <a className="dropdown-item" href="/postify/settings">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;

import { postList } from "../context/Post_List-store";
import { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { SiApostrophe } from "react-icons/si";
import { FaPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX } from "react-icons/fi";

import { IoIosNotifications } from "react-icons/io";
import { toast } from "react-toastify";
import { authentication } from "../context/AuthProvider";

function SideBar() {
  const { auth } = useContext(authentication);

  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // const handleLogout = () => {
  //   console.log("Logging out...");
  //   fetch("http://localhost:3000/api/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Logout successful");
  //       navigate("/login");
  //       toast.success("Logout SuccessFully");
  //     });
  // };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {auth.isAuthenticated && (
        <div
          className={`d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar ${
            isCollapsed ? "collapsed" : ""
          }`}
          style={{
            width: isCollapsed ? "100px" : "280px",
            height: "100vh",
            transition: "width 0.3s ease",
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            <button
              onClick={toggleSidebar}
              className="btn btn-outline-light btn-sm"
              style={{ marginLeft: isCollapsed ? "0" : "7px" }}
            >
              {isCollapsed ? <FiMenu /> : <FiX />}
            </button>
          </div>
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <NavLink
                to="/postify"
                end
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
              >
                <AiFillHome className="me-2" />
                {!isCollapsed && <span>Home</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/postify/createpost"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
              >
                <FaPlus className="me-2" />
                {!isCollapsed && <span>Create Post</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                // onClick={() => setSelectedTab("myposts")}
                to="/postify/myposts"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
              >
                <SiApostrophe className="me-2" />
                {!isCollapsed && <span>My Posts</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/postify/notifications"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
              >
                <IoIosNotifications className="me-2" />
                {!isCollapsed && <span>Notifications</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/postify/myprofile"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
              >
                <CgProfile className="me-2" />
                {!isCollapsed && <span>Profile</span>}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default SideBar;

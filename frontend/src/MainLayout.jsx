import SideBar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AllUsers from "./components/AllUsers";
import { useContext } from "react";
import Login from "./components/Login";
import { postList } from "./context/Post_List-store";

function MainLayout() {
  const { auth } = useContext(postList);
  return (
    <>
      {auth.isAuthenticated ? (
        <>
          <div className="header">
            <Header />
          </div>
          <div className="layout">
            <div className="main-content">
              <div className="sidebar">
                <SideBar></SideBar>
              </div>
              <div className="content">
                <Outlet />
              </div>
              <div className="users">
                <AllUsers />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
export default MainLayout;

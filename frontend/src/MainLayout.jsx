import SideBar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import AllUsers from "./components/AllUsers";

function MainLayout({ darkMode, setDarkMode }) {
  return (
    <>
      <div className="header">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <div className="layout">
        <div className="main-content">
          <div className="sidebar">
            <SideBar />
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
  );
}

export default MainLayout;

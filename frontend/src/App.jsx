import "./App.css";
import SideBar from "./components/Sidebar";
import Header from "./components/Header";
import PostListProvider, { postList } from "./context/Post_List-store";
import PostifyProfile from "./components/PostifyProfile";
import { Outlet, useLoaderData } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllUsers from "./components/AllUsers";
import MainLayout from "./MainLayout";
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
      />
      <PostListProvider>
        <MainLayout />
        {/* <div className="header">
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
        </div> */}
      </PostListProvider>
    </>
  );
}
export default App;

import "./App.css";
import SideBar from "./components/Sidebar";
import PostListProvider, { postList } from "./context/Post_List-store";
import PostifyProfile from "./components/PostifyProfile";
import { Outlet, useLoaderData } from "react-router-dom";

function App() {
  return (
    <PostListProvider>
      <div className="layout">
        <div className="sidebar">
          <SideBar></SideBar>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </PostListProvider>
  );
}
export default App;

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CreatePost from "./components/CreatePost.jsx";
import PostList from "./components/PostList.jsx";
import PostListProvider from "./store/Post_List-store.jsx";
import { ProfileProvider } from "./store/Profile_Store.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import MyPost from "./components/MyPosts.jsx";
import PostifyProfile from "./components/PostifyProfile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import Postify from "./components/Postify.jsx";
import MyProfile from "./components/MyProfile.jsx";
import UserProfile from "./components/UserProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Postify></Postify>,
  },
  {
    path: "/postify",
    element: <App></App>,
    children: [
      {
        path: "/postify/createpost",
        element: <CreatePost></CreatePost>,
      },
      {
        path: "/postify",
        element: <PostList></PostList>,
      },
      {
        path: "/postify/myposts",
        element: <PostList></PostList>,
      },
      {
        path: "/postify/myprofile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "/postify/userprofile/:userId",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/postify/edit/profile",
        element: <EditProfile></EditProfile>,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp></SignUp>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostListProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </PostListProvider>
    {/* <App /> */}
  </StrictMode>
);

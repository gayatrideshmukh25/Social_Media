import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { postList } from "../store/Post_List-store";
import { useLocation } from "react-router-dom";

function PostList() {
  const contextObj = useContext(postList);
  const postlist = contextObj.postlist;
  const deletePosts = contextObj.deletePosts;
  const addInitialPosts = contextObj.addInitialPosts;
  const selectedTab = contextObj.selectedTab;
  const auth = contextObj.auth;

  useEffect(() => {
    fetch("http://localhost:3000/api/getPosts")
      .then((res) => res.json())
      .then((data) => {
        addInitialPosts(data.posts);
      });
  }, []);
  const location = useLocation();
  const isMyPost = location.pathname === "/postify/myposts";
  const filterPostByUser = isMyPost
    ? postlist.filter((post) => post.user._id === auth.userId)
    : postlist;

  return (
    <>
      {auth.isAuthenticated && (
        <div className="posts">
          {/* <p>{auth.userId}</p> */}
          {filterPostByUser.map((post) => (
            <Post key={post._id} deletePosts={deletePosts} post={post}></Post>
          ))}
        </div>
      )}
    </>
  );
}

// export const PostLoader = () => {
//   return fetch("http://localhost:3000/api/getPosts")
//     .then((res) => res.json())
//     .then((data) => {
//       return data.posts;
//     });
// };

export default PostList;

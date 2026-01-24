import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { postList } from "../context/Post_List-store";
import { useLocation } from "react-router-dom";
import Welcomemsg from "./Welcomemsg";
import { authentication } from "../context/AuthProvider";

function PostList() {
  const { postlist, deletePosts, addInitialPosts } = useContext(postList);
  const { auth } = useContext(authentication);

  useEffect(() => {
    fetch("http://localhost:3000/api/getPosts")
      .then((res) => res.json())
      .then((data) => {
        addInitialPosts(data.posts);
        console.log(data.posts, "posta");
      });
  }, []);
  const location = useLocation();
  const isMyPost = location.pathname === "/postify/myposts";
  const filterPostByUser = isMyPost
    ? postlist.filter((post) => post.user._id === auth.userId)
    : postlist;

  return (
    <>
      {!filterPostByUser && <Welcomemsg />}
      {auth.isAuthenticated && (
        <div className="posts">
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

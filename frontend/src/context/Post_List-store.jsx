import { createContext, useReducer, useState, useEffect } from "react";

export const postList = createContext({});

const PostListProvider = ({ children }) => {
  const [editing, setEditing] = useState(false);
  const [editPost, setEditPost] = useState("");

  // const initialState = {
  //   userId: null,
  //   isAuthenticated: false,
  // };
  // const authReducer = (currState, action) => {
  //   if (action.type === "login_success") {
  //     return {
  //       ...currState,
  //       userId: action.payload.userId,
  //       isAuthenticated: true,
  //     };
  //   } else if (action.type === "logout") {
  //     return initialState;
  //   }
  //   return currState;
  // };
  // const [auth, dispatchAuth] = useReducer(authReducer, initialState);

  const postReducer = (currState, action) => {
    let newPosts = currState;
    if (action.type === "add_post") {
      newPosts = [...newPosts, action.payload.post];
    } else if (action.type === "add_initial_post") {
      newPosts = Array.isArray(action.payload.initialPosts)
        ? [...action.payload.initialPosts]
        : [];
    } else if (action.type === "add_dislike") {
      const postId = action.payload.postId;
      const userId = action.payload.userId;
      newPosts = currState.map((post) => {
        if (post._id !== postId) return post;
        let dislikes = [...post.dislikes];
        if (!dislikes.includes(userId)) {
          dislikes.push(userId);
        } else {
          dislikes = dislikes.filter((id) => id !== userId);
        }
        return { ...post, dislikes };
      });
    } else if (action.type === "add_like") {
      const postId = action.payload.postId;
      const userId = action.payload.userId;
      newPosts = currState.map((post) => {
        if (post._id !== postId) return post;
        let likes = [...post.likes];

        if (!likes.includes(userId)) {
          likes.push(userId);
        } else {
          likes = likes.filter((id) => id !== userId);
        }

        return { ...post, likes };
      });
    } else if (action.type === "delete_post") {
      newPosts = newPosts.filter((post) => post._id !== action.payload.id);
    } else if (action.type === "edit_post") {
      const updatedPost = action.payload.updatedPost;
      newPosts = currState.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      );
    } else if (action.type === "add_comment") {
      const { postId, newComment } = action.payload;
      newPosts = currState.map((post) => {
        if (post._id.toString() === postId.toString()) {
          return { ...post, comments: [...(post.comments || []), newComment] };
        }
        return post;
      });
    } else if (action.type === "delete_comment") {
      const { postId, commentId } = action.payload;
      newPosts = currState.map((post) => {
        if (post._id !== postId) return post;
        return {
          ...post,
          comments: post.comments.filter(
            (comment) => comment._id !== commentId,
          ),
        };
      });
    }
    return newPosts;
  };
  const [postlist, dispatchPosts] = useReducer(postReducer, []);
  // const [loadingAuth, setLoadingAuth] = useState(true);

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/checkAuth", {
  //     method: "GET",
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.authenticated) {
  //         dispatchAuth({
  //           type: "login_success",
  //           payload: { userId: data.userId },
  //         });
  //         console.log("User is authenticated");
  //       } else {
  //         dispatchAuth({
  //           type: "logout",
  //         });
  //         console.log("User is not authenticated");
  //       }
  //     })
  //     .finally(() => setLoadingAuth(false));
  // }, []);

  const addPosts = (post) => {
    const addPost = {
      type: "add_post",
      payload: { post },
    };
    dispatchPosts(addPost);
  };
  const editPosts = (updatedPost) => {
    const editPost = {
      type: "edit_post",
      payload: { updatedPost },
    };
    dispatchPosts(editPost);
  };
  const addInitialPosts = (initialPosts) => {
    const addPosts = {
      type: "add_initial_post",
      payload: {
        initialPosts,
      },
    };
    dispatchPosts(addPosts);
  };

  const deletePosts = (id) => {
    const deletePost = {
      type: "delete_post",
      payload: {
        id,
      },
    };
    dispatchPosts(deletePost);
  };

  const addLikes = (postId, userId) => {
    const addLike = {
      type: "add_like",
      payload: {
        postId,
        userId,
      },
    };
    dispatchPosts(addLike);
  };

  const addDisLikes = (postId, userId) => {
    const addDisLike = {
      type: "add_dislike",
      payload: {
        postId,
        userId,
      },
    };
    dispatchPosts(addDisLike);
  };

  const addComment = (postId, newComment) => {
    const addCommentAction = {
      type: "add_comment",
      payload: {
        postId,
        newComment,
      },
    };
    dispatchPosts(addCommentAction);
  };
  const deleteComment = (postId, commentId) => {
    const deleteCommentAction = {
      type: "delete_comment",
      payload: {
        postId,
        commentId,
      },
    };
    dispatchPosts(deleteCommentAction);
  };
  const [users, setUsers] = useState([]);
  return (
    <postList.Provider
      value={{
        postlist: postlist,

        addPosts: addPosts,
        addInitialPosts: addInitialPosts,
        deletePosts: deletePosts,
        addLikes: addLikes,
        addDisLikes: addDisLikes,
        addComment: addComment,
        editing: editing,
        setEditing: setEditing,
        editPost: editPost,
        setEditPost: setEditPost,
        editPosts: editPosts,
        deleteComment: deleteComment,
        users,
        setUsers,
      }}
    >
      {children}
    </postList.Provider>
  );
};

export default PostListProvider;

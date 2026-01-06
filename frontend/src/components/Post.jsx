import { useContext, useState } from "react";
import { postList } from "../store/Post_List-store";
import { useNavigate } from "react-router-dom";
import style from "./Post.module.css";
import { CgProfile } from "react-icons/cg";
import { FaEdit, FaHeart, FaThumbsDown } from "react-icons/fa";
import { profileabout } from "../store/Profile_Store";
import { MdDelete } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { useLocation } from "react-router-dom";
function Post({ post }) {
  const contextObj = useContext(postList);
  const deletePosts = contextObj.deletePosts;
  const addLikes = contextObj.addLikes;
  const addDisLikes = contextObj.addDisLikes;
  const setEditing = contextObj.setEditing;
  const addComment = contextObj.addComment;

  const auth = contextObj.auth;
  const setSelectedTab = contextObj.setSelectedTab;
  const selectedTab = contextObj.selectedTab;
  const profileObj = useContext(profileabout);
  const profile = profileObj.profile;
  const setProfile = profileObj.setProfile;
  const navigate = useNavigate();

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleDeletePosts = () => {
    fetch(`http://localhost:3000/api/deletePost/${post._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: post._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        deletePosts(post._id);
        navigate("/postify/myposts");
      });
  };
  const handleLikes = () => {
    fetch(`http://localhost:3000/api/addLikes/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        _id: post._id,
        userId: auth.userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        addLikes(data.postId, data.userId);
      });
  };
  const handledisLikes = () => {
    fetch(`http://localhost:3000/api/addDisLikes/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        _id: post._id,
        userId: auth.userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        addDisLikes(data.updatedPost);
      });
  };
  const editHandler = (e) => {
    e.preventDefault();

    console.log("edit handler");
    setEditing(true);
    setEditPost(post);
    setSelectedTab("createpost");
    navigate("/postify/createpost");
  };
  const showProfileHandler = (e) => {
    navigate(`/postify/userprofile/${post.userId}`);
    // console.log("inside profile handler");
    // fetch(`http://localhost:3000/api/profile/${post.userId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data.user);
    //     if (data.success) {
    //       setProfile(data.user);
    //       navigate("/postify/myprofile");
    //     }
    //   });
  };
  const location = useLocation();
  const isMyPost = location.pathname === "/postify/myposts";

  const handleCommentClick = () => {
    setShowComments(!showComments);
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // For now, just log the comment. Backend integration can be added later.
    console.log("Comment submitted:", commentText);
    fetch(`http://localhost:3000/api/addcomments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        _id: post._id,
        userId: auth.userId,
        commentText: commentText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("new comment", data.newComment);
        addComment(data.newComment);
      });
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <>
      <div
        className={`${style.post} card border-0 shadow-sm bg-light`}
        style={{ width: "70%", minHeight: "auto" }}
      >
        <div className="card-body p-4">
          <div className={`${style.user} mb-3 align-items-start`}>
            <CgProfile size={50} className="text-primary me-3 flex-shrink-0" />
            <div className="flex-grow-1">
              <h6
                className="mb-1 fw-bold"
                onClick={showProfileHandler}
                style={{ cursor: "pointer" }}
              >
                {post.user.userName}
              </h6>
              <small className="text-muted">
                @{post.user.userName.toLowerCase().replace(/\s+/g, "")}
              </small>
            </div>
            {post.userId === auth.userId && isMyPost && (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  ⋯
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        editHandler(e);
                      }}
                    >
                      <FaEdit className="me-2" /> Edit
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item text-danger"
                      onClick={handleDeletePosts}
                    >
                      <MdDelete className="me-2" /> Delete
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="mb-3">
            {post.title && <h5 className="mb-2">{post.title}</h5>}
            <p className="card-text mb-3 fs-6">{post.body}</p>
          </div>

          {post.tags?.length > 0 && (
            <div className="mb-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-primary me-3"
                  style={{
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <hr className="my-3" />

          <div className="d-flex justify-content-around">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-flex align-items-center"
              onClick={handleLikes}
            >
              <FaHeart className="me-1" />
              <span>{post.likes?.length ?? 0}</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
              onClick={handledisLikes}
            >
              <FaThumbsDown className="me-1" />
              <span>{post.dislikes?.length ?? 0}</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary d-flex align-items-center"
              onClick={handleCommentClick}
            >
              <FaRegCommentDots className="me-1" />
              <span>{post.comments?.length ?? 0}</span>
            </button>
          </div>

          {showCommentBox && (
            <div className="mt-3">
              <form onSubmit={handleCommentSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    Comment
                  </button>
                </div>
              </form>
            </div>
          )}

          {showComments && post.comments && post.comments.length > 0 && (
            <div className="mt-3">
              <h6>Comments</h6>
              {post.comments.map((comment) => (
                <div key={comment._id} className="mb-3 p-2 border rounded">
                  <div className={`${style.user} mb-2 align-items-start`}>
                    <CgProfile
                      size={30}
                      className="text-primary me-2 flex-shrink-0"
                    />
                    <div className="flex-grow-1">
                      <strong className="mb-1 d-block">
                        {comment.user?.userName || "Unknown"}
                      </strong>
                      {/* <small className="text-muted">
                        @
                        {comment.user?.userName
                          ?.toLowerCase()
                          .replace(/\s+/g, "") || "unknown"}
                      </small> */}
                    </div>
                  </div>
                  <p className="mb-1">{comment.text}</p>
                  <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Post;

import { useContext, useState } from "react";
import { postList } from "../context/Post_List-store";
import { useNavigate } from "react-router-dom";
import style from "./Post.module.css";
import { CgProfile } from "react-icons/cg";
import { FaEdit, FaHeart, FaThumbsDown } from "react-icons/fa";
import { profileabout } from "../context/Profile_Store";
import { MdDelete } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { authentication } from "../context/AuthProvider";
function Post({ post }) {
  const {
    deleteComment,
    deletePosts,
    addDisLikes,
    addLikes,
    setEditPost,
    setEditing,
    addComment,
    setSelectedTab,
  } = useContext(postList);
  const { auth, authUser } = useContext(authentication);
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const handleDeletePosts = async () => {
    await fetch(`http://localhost:3000/api/deletePost/${post._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: post._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        deletePosts(post._id);
        toast.success("Post Deleted SuccessFully !!");
        navigate("/postify/myposts");
      });
  };
  const handleLikes = async () => {
    await fetch(`http://localhost:3000/api/addLikes/${post._id}`, {
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
        console.log(data.Msg);
        toast.success(data.Msg);
      });
  };
  const handledisLikes = async () => {
    await fetch(`http://localhost:3000/api/addDisLikes/${post._id}`, {
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
        addDisLikes(data.postId, data.userId);
        console.log(data.msg);
        toast.success(data.msg);
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
  const showProfileHandler = async (e) => {
    console.log("user id to find profiek fo user", post.user._id);
    if (post.user._id === auth.userId) {
      navigate("/postify/myprofile");
      return;
    }
    navigate(`/postify/userprofile/${post.user._id}`);
  };
  const location = useLocation();
  const isMyPost = location.pathname === "/postify/myposts";

  const handleCommentClick = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("Comment submitted:", commentText);
    await fetch(`http://localhost:3000/api/addcomments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        postId: post._id,
        userId: auth.userId,
        commentText: commentText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("new comment", data.newComment, post._id);
        addComment(post._id, data.newComment);
      });
    setCommentText("");
    setShowCommentBox(false);
  };
  const handleDeleteComment = async (commentId) => {
    await fetch(`http://localhost:3000/api/deleteComment/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: post._id,
        commentId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        deleteComment(post._id, commentId);
      });
  };
  const isFollowing = post.user?.following?.includes(authUser._id);

  return (
    <>
      <div className={`${style.post} card bg-white`}>
        <div className="card-body p-4">
          <div className={`${style.user} mb-3 align-items-start`}>
            {post?.user?.imageUrl ? (
              <img
                src={`http://localhost:3000${post.user.imageUrl}`}
                alt="profile"
                width="50"
                height="50"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <CgProfile size={50} className="text-primary" />
            )}
            <div className="flex-grow-1">
              <h6
                className="mb-1 fw-bold"
                onClick={showProfileHandler}
                style={{ cursor: "pointer", paddingLeft: "10px" }}
              >
                {post?.user?.userName}
              </h6>
              <small className="text-muted" style={{ paddingLeft: "10px" }}>
                {post?.user?.bio}
              </small>
            </div>

            {post?.user?._id === auth.userId && isMyPost ? (
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
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => onFollow(post.user._id)}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <div className="mb-3">
            {post.title && <h5 className="mb-2">{post.title}</h5>}
            <p className="card-text mb-3 fs-6">{post.body}</p>
            {post.imageUrl && (
              <img
                src={`http://localhost:3000${post.imageUrl}`}
                alt="Post image"
                className="img-fluid mb-3"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
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

          {isCommentOpen && (
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

          {isCommentOpen && post.comments && post.comments.length > 0 && (
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
                      <strong
                        className="mb-1 d-block"
                        onClick={showProfileHandler}
                      >
                        {comment.user?.userName || "Unknown"}
                      </strong>
                    </div>
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
                              // editHandler(e);
                            }}
                          >
                            <FaEdit className="me-2" /> Edit
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <MdDelete className="me-2" /> Delete
                          </a>
                        </li>
                      </ul>
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

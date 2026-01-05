import { useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { postList } from "../store/Post_List-store";
function MyPost() {
  const contextObj = useContext(postList);
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
        navigate("/");
      });
  };
  return (
    <>
      {auth.userId === post.userId && (
        <div className={`${style.post} card `} style={{ width: "70%" }}>
          <div className="postUser">
            <p></p>
          </div>
          <div className="card-body">
            <p className="delete" onClick={handleDeletePosts}>
              <span className="badge text-bg-danger">Delete Post</span>
            </p>
            <FaEdit className={style.editIcon} onClick={handleEdit} />
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.body}</p>
            {post.tags?.map((tag, index) => (
              <span
                key={index}
                className={`badge rounded-pill text-bg-success ${style.tags}`}
              >
                #{tag}
              </span>
            ))}

            {/* <p className="card-reactions">{post.reactions}</p> */}
            <br></br>
            <button
              type="button"
              className={`badge text-bg-warning btn btn-primary position-relative ${style.likes}`}
              onClick={handleLikes}
            >
              👍🏻
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {/* {post.reactions?.[0]?.likes ?? 0} */}
                {post.likes?.length ?? 0}
                <span className="visually-hidden">unread messages</span>
              </span>
            </button>
            <button
              type="button"
              className={`badge text-bg-warning btn btn-primary position-relative ${style.dislikes}`}
              onClick={handledisLikes}
            >
              👎🏻
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {/* {post.reactions?.[1]?.dislikes ?? 0} */}
                {post.dislikes?.length ?? 0}
                <span className="visually-hidden">unread messages</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default MyPost;

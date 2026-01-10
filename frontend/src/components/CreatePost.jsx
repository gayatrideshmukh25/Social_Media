import { useContext, useRef, useState, useEffect } from "react";
import { postList } from "../context/Post_List-store";
import style from "./CreatePost.module.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const contextObj = useContext(postList);

  const addPosts = contextObj.addPosts;
  const selectedTab = contextObj.selectedTab;
  const editing = contextObj.editing;
  const editPost = contextObj.editPost;
  const editPosts = contextObj.editPosts;
  const setEditing = contextObj.setEditing;
  const setSelectedTab = contextObj.setSelectedTab;
  const navigate = useNavigate();
  const auth = contextObj.auth;

  const title = useRef("");
  const body = useRef("");
  const likes = useRef("");
  const dislikes = useRef("");
  const tags = useRef("");
  const userId = useRef("");

  const handleAddPosts = (event) => {
    event.preventDefault();
    if (editing) {
      console.log(editPost._id);
      const tagsArray = editedTags
        .split(" ")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      fetch(`http://localhost:3000/api/editpost/${editPost._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editedTitle,
          body: editedBody,
          tags: tagsArray,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.post);
          editPosts(data.post);
          setEditing(false);
          navigate("/postify/myposts");
        });
    } else {
      let titlePost = title.current.value;
      let bodyPost = body.current.value;
      let likesPost = likes.current.value;
      let dislikesPost = dislikes.current.value;
      let tagsPost = tags.current.value.split(" ");
      console.log(titlePost, bodyPost, likesPost, dislikesPost, tagsPost);

      fetch("http://localhost:3000/api/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: titlePost,
          body: bodyPost,
          likes: [],
          dislikes: [],
          tags: tagsPost,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          addPosts(data.post);
          navigate("/postify");
        });
    }
  };
  const cancelhandler = () => {
    if (editing) {
      navigate("/postify/myposts");
      setSelectedTab("myposts");
      setEditing(false);
    } else {
      navigate("/postify");
    }
  };
  const [editedTitle, setEditedTitle] = useState(editPost.title || "");
  const [editedBody, setEditedBody] = useState(editPost.body || "");
  const [editedTags, setEditedTags] = useState(editPost.tags?.join(" ") || "");

  const onChangeTitle = (event) => {
    let editedTitle = event.target.value;
    setEditedTitle(editedTitle);
  };
  const onChangeBody = (event) => {
    let editedBody = event.target.value;
    setEditedBody(editedBody);
  };
  const onChangeTags = (event) => {
    let editedTags = event.target.value;
    setEditedTags(editedTags);
  };

  return (
    <>
      {auth.isAuthenticated && (
        <div
          style={{
            minHeight: "100vh",
            background: "#f8f9fa",
            padding: "20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <div className="container" style={{ maxWidth: "600px" }}>
            <div
              className="card shadow-sm border-0"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4 fw-bold">
                  {editing ? "Edit Post" : "Create New Post"}
                </h2>
                <form onSubmit={handleAddPosts}>
                  {editing ? (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="editTitle"
                          className="form-label fw-semibold"
                        >
                          Title
                        </label>
                        <input
                          value={editedTitle}
                          onChange={onChangeTitle}
                          type="text"
                          className="form-control"
                          id="editTitle"
                          placeholder="Enter your post title"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="editBody"
                          className="form-label fw-semibold"
                        >
                          Content
                        </label>
                        <textarea
                          value={editedBody}
                          onChange={onChangeBody}
                          className="form-control"
                          id="editBody"
                          rows="4"
                          placeholder="Write your post content here..."
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="editTags"
                          className="form-label fw-semibold"
                        >
                          Tags
                        </label>
                        <input
                          value={editedTags}
                          onChange={onChangeTags}
                          type="text"
                          className="form-control"
                          id="editTags"
                          placeholder="Add tags separated by spaces (e.g., react javascript web)"
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary flex-fill"
                        >
                          Update Post
                        </button>
                        <button
                          type="button"
                          onClick={cancelhandler}
                          className="btn btn-outline-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="createTitle"
                          className="form-label fw-semibold"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          ref={title}
                          className="form-control"
                          id="createTitle"
                          placeholder="Enter your post title"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="createBody"
                          className="form-label fw-semibold"
                        >
                          Content
                        </label>
                        <textarea
                          ref={body}
                          className="form-control"
                          id="createBody"
                          rows="4"
                          placeholder="Write your post content here..."
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="createTags"
                          className="form-label fw-semibold"
                        >
                          Tags
                        </label>
                        <input
                          ref={tags}
                          type="text"
                          className="form-control"
                          id="createTags"
                          placeholder="Add tags separated by spaces (e.g., react javascript web)"
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary flex-fill"
                        >
                          Create Post
                        </button>
                        <button
                          type="button"
                          onClick={cancelhandler}
                          className="btn btn-outline-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default CreatePost;

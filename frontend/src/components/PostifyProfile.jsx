import { useContext, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { postList } from "../context/Post_List-store";
import Post from "./Post";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authentication } from "../context/AuthProvider";

const ProfileLayout = ({
  profile,
  editProfile,
  postsCount,
  followersCount,
  followingCount,
  isOwner,
  onEdit,
  onBack,
  onFollow,
  isFollowing,
  userPosts = [],
  userFollowers = [],
  userFollowing = [],
  isFollowingUser = [],
}) => {
  const { auth, authUser } = useContext(authentication);
  const [showUserPosts, setShowUserPosts] = useState(false);
  const [showUserFollowers, setShowUserFollowers] = useState(false);
  const [showUserFollowing, setShowUserFollowing] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const showPosts = () => {
    setShowUserPosts(!showUserPosts);
  };
  const showFollowers = () => {
    setShowUserFollowers(!showUserFollowers);
  };
  const showFollowing = () => {
    console.log("following");
    setShowUserFollowing(!showUserFollowing);
  };
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const updateProfilePic = () => {
    setShowUpdateOptions(!showUpdateOptions);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:3000/api/edit/profilepic", {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.log("not updated");
        } else {
          setPreview(URL.createObjectURL(file));
          console.log("updated", profile);
          editProfile({
            ...profile,
            imageUrl: data.user.imageUrl || profile.user?.imageUrl,
          });
        }
      });
  };
  const handleDeleteProfilePic = () => {
    fetch("http://localhost:3000/api/delete/profilepic", {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPreview(null);
          editProfile({
            ...profile,
            imageUrl: null,
          }); // 👈 backend must return this

          // navigate("/postify/myprofile");
        } else {
          console.log("Failed to delete profile picture");
        }
      })
      .catch((error) => {
        console.log("Error deleting profile picture:", error);
      });
  };
  if (!profile) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "100px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="container" style={{ maxWidth: "600px" }}>
        <div
          className="card shadow-sm border-0"
          style={{ borderRadius: "15px" }}
        >
          <div className="card-body p-4 text-center">
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {profile.imageUrl ? (
                <div>
                  <div>
                    <img
                      src={
                        preview
                          ? preview
                          : `http://localhost:3000${profile.imageUrl}`
                      }
                      alt="profile"
                      width="100"
                      height="100"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      onClick={isOwner ? updateProfilePic : undefined}
                    />
                  </div>
                  {showUpdateOptions && profile.imageUrl && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={handleDeleteProfilePic}
                        style={{ fontSize: "0.8rem" }}
                      >
                        Delete Profile Picture
                      </button>
                      <br></br>
                      <button
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={handleImageClick}
                        style={{ fontSize: "0.8rem" }}
                      >
                        Update Profile Picture
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <CgProfile
                  size={120}
                  className="text-primary"
                  onClick={isOwner ? handleImageClick : undefined}
                />
              )}
            </div>
            <h3 className="card-title mb-2 fw-bold">{profile?.userName}</h3>
            <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
              {profile?.bio || "No bio available"}
            </p>

            {/* Stats Section */}
            <div className="row text-center mb-4">
              <div className="col-4">
                <div className="p-2">
                  <h4 className="mb-1 fw-bold text-primary">{postsCount}</h4>
                  <small
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => showPosts()}
                  >
                    Posts
                  </small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2">
                  <h4 className="mb-1 fw-bold text-success">
                    {followersCount}
                  </h4>
                  <small
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => showFollowers()}
                  >
                    Followers
                  </small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2">
                  <h4 className="mb-1 fw-bold text-info">{followingCount}</h4>
                  <small
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={() => showFollowing()}
                  >
                    Following
                  </small>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center gap-2">
              {isOwner || auth.userId === profile._id ? (
                <>
                  <button className="btn btn-primary" onClick={onEdit}>
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={onBack}
                  >
                    Back to Posts
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={onBack}
                  >
                    Back to Posts
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onFollow(profile._id)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                    {/* Follow */}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        {showUserPosts && userPosts.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-3 text-center">Posts</h4>
            {userPosts?.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
        {showUserFollowers && userFollowers.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-3 text-center">Followers</h4>
            <div className="list-group">
              {userFollowers.map((user) => (
                <div
                  key={user._id}
                  className="list-group-item d-flex align-items-center border-0 shadow-sm mb-2"
                  style={{
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => {
                    authUser._id === user._id
                      ? navigate(`/postify/myprofile`)
                      : navigate(`/postify/userprofile/${user._id}`);
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  <CgProfile
                    size={40}
                    className="text-primary me-3 flex-shrink-0"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold">{user.userName}</h6>
                    <small className="text-muted">{user.bio || "No bio"}</small>
                  </div>
                  {!(authUser._id === user._id) && (
                    <button
                      className="btn btn-primary"
                      onClick={() => addFollowers(user._id)}
                    >
                      {isFollowingUser ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {showUserFollowing && userFollowing.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-3 text-center">Following</h4>
            <div className="list-group">
              {userFollowing.map((user) => (
                <div
                  key={user._id}
                  className="list-group-item d-flex align-items-center border-0 shadow-sm mb-2"
                  style={{
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => navigate(`/postify/userprofile/${user._id}`)}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "white")
                  }
                >
                  <CgProfile
                    size={40}
                    className="text-primary me-3 flex-shrink-0"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold">{user.userName}</h6>
                    <small className="text-muted">{user.bio || "No bio"}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;

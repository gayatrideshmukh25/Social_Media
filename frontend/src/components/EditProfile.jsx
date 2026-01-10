import { useContext, useState } from "react";
import { postList } from "../context/Post_List-store";
import { profileabout } from "../context/Profile_Store";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const contextObj = useContext(postList);
  const profileObj = useContext(profileabout);
  const profile = profileObj.profile;
  const editProfile = profileObj.editProfile;
  const setSelectedTab = profileObj.setSelectedTab;

  console.log(profile);
  const [profileBio, setProfileBio] = useState(profile.bio);
  const [profileUserName, setProfileUserName] = useState(profile.userName);

  const navigate = useNavigate();

  const onBioChange = (event) => {
    let bio = event.target.value;
    setProfileBio(bio);
  };
  const onUserNameChange = (event) => {
    let userName = event.target.value;
    setProfileUserName(userName);
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/edit/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        bio: profileBio,
        userName: profileUserName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        editProfile(data.user);
        navigate("/postify/myprofile");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="card shadow-sm border-0"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}
      >
        <div className="card-body p-4">
          <h2 className="card-title mb-4 fw-bold">Edit Profile</h2>
          <form onSubmit={handleEditProfile}>
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <input
                onChange={onBioChange}
                value={profileBio}
                type="text"
                className="form-control"
                id="bio"
                placeholder="Enter your bio"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">
                Username
              </label>
              <input
                onChange={onUserNameChange}
                value={profileUserName}
                type="text"
                className="form-control"
                id="userName"
                placeholder="Enter your username"
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EditProfile;

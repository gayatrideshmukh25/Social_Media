import { useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { postList } from "../store/Post_List-store";

const ProfileLayout = ({
  profile,
  postsCount,
  followersCount,
  followingCount,
  isOwner,
  onEdit,
  onBack,
}) => {
  const { auth } = useContext(postList);
  return (
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
          <div className="card-body p-4 text-center">
            <div className="mb-4">
              <CgProfile size={120} className="text-primary" />
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
                  <small className="text-muted">Posts</small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2">
                  <h4 className="mb-1 fw-bold text-success">
                    {followersCount}
                  </h4>
                  <small className="text-muted">Followers</small>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2">
                  <h4 className="mb-1 fw-bold text-info">{followingCount}</h4>
                  <small className="text-muted">Following</small>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center gap-2">
              {(isOwner || auth.userId === profile._id) && (
                <button className="btn btn-primary" onClick={onEdit}>
                  Edit Profile
                </button>
              )}
              <button className="btn btn-outline-secondary" onClick={onBack}>
                Back to Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;

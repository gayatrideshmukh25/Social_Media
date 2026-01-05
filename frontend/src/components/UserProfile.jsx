import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { postList } from "../store/Post_List-store";
import Loading from "./Loading";
import ProfileLayout from "./PostifyProfile";

function UserProfile() {
  const { userId } = useParams();
  const { postlist } = useContext(postList);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data.user))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Loading />;
  if (!profile) return <h1>User not found</h1>;

  const userPosts = postlist.filter((p) => p.userId === profile._id);

  return (
    <ProfileLayout
      profile={profile}
      postsCount={userPosts.length}
      followersCount={profile?.followers?.length || 0}
      followingCount={profile?.following?.length || 0}
      isOwner={false}
      onBack={() => navigate(-1)}
    />
  );
}
export default UserProfile;

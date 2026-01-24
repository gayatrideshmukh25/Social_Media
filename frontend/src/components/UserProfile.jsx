import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { postList } from "../context/Post_List-store";
import { profileabout } from "../context/Profile_Store";
import Loading from "./Loading";
import ProfileLayout from "./PostifyProfile";
import { authentication } from "../context/AuthProvider";

function UserProfile() {
  const { userId } = useParams();
  const { postlist, users } = useContext(postList);
  const { editProfile, profile, setProfile } = useContext(profileabout);
  const { authUser, setAuthUser } = useContext(authentication);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.user);
        else {
          editProfile(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const onFollow = (userId) => {
    fetch("http://localhost:3000/api/addFollowers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        receiverId: userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log("adding follower");
        // setFollowStatus((prev) => ({
        //   ...prev,
        //   [userId]: "Following",
        // }));
      });
  };

  if (loading) return <Loading />;
  if (!profile) return <h1>User not found</h1>;
  console.log(postlist, profile._id);
  const userPosts = postlist.filter((p) => p.user._id === profile._id);
  const userFollowers = users.filter((f) => profile.followers.includes(f._id));
  const userFollowing = users.filter((u) => profile.following.includes(u._id));
  const isFollowing = authUser?.following?.includes(profile._id);
  const isFollowingUser = profile?.following?.includes(authUser?._id);

  console.log(isFollowingUser);

  return (
    <ProfileLayout
      profile={profile}
      setProfile={setProfile}
      isFollowing={isFollowing}
      postsCount={userPosts.length}
      followersCount={profile?.followers?.length || 0}
      followingCount={profile?.following?.length || 0}
      isOwner={false}
      onBack={() => navigate(-1)}
      onEdit={() => navigate("/postify/edit/profile")}
      onFollow={() => onFollow(profile._id)}
      userPosts={userPosts}
      userFollowers={userFollowers}
      userFollowing={userFollowing}
      isFollowingUser={isFollowingUser}
    />
  );
}
export default UserProfile;

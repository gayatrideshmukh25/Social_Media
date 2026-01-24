import { postList } from "../context/Post_List-store";
import { profileabout } from "../context/Profile_Store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ProfileLayout from "./PostifyProfile";
import Loading from "./Loading";
import { authentication } from "../context/AuthProvider";
function MyProfile() {
  const contextObj = useContext(postList);
  const {
    profile,
    setProfile,
    editProfile,
    profileLoading,
    setProfileLoading,
  } = useContext(profileabout);
  const { auth, authUser } = useContext(authentication);

  const { users } = contextObj;

  const postlist = contextObj.postlist;

  const navigate = useNavigate();
  const [postsCount, setPostsCount] = useState(0);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    console.log("fetching profile");
    if (!auth.isAuthenticated) return;

    setProfileLoading(true);

    fetch("http://localhost:3000/api/myprofile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.user);
          setPostsCount(data.postsCount || 0);
          setUserPosts(data.posts || []);
        } else {
          console.log("Failed to fetch profile");
        }
      })
      .finally(() => setProfileLoading(false));
  }, []);

  // const userPosts = postlist.filter((post) => post.userId === profile?._id);

  if (profileLoading) {
    console.log(auth.isAuthenticated);
    return <Loading />;
  }

  if (!profile) {
    return <h1>No profile found</h1>;
  }
  const userPostsFiltered = userPosts.filter((p) => p.user._id === profile._id);

  const userFollowers = users.filter((f) =>
    profile?.followers?.includes(f?._id),
  );
  const userFollowing = users.filter((u) =>
    profile?.following?.includes(u?._id),
  );

  const isFollowingUser = profile?.following?.includes(authUser?._id);

  return (
    <>
      <ProfileLayout
        profile={profile}
        setProfile={setProfile}
        editProfile={editProfile}
        postsCount={userPostsFiltered.length}
        followersCount={profile?.followers?.length || 0}
        followingCount={profile?.following?.length || 0}
        isOwner={true}
        onEdit={() => navigate("/postify/edit/profile")}
        onBack={() => navigate("/postify")}
        userPosts={userPostsFiltered}
        userFollowers={userFollowers}
        userFollowing={userFollowing}
        isFollowingUser={isFollowingUser}
      />
    </>
  );
}

export default MyProfile;

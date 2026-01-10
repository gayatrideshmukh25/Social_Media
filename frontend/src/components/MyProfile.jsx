import { postList } from "../context/Post_List-store";
import { profileabout } from "../context/Profile_Store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ProfileLayout from "./PostifyProfile";
import Loading from "./Loading";
function MyProfile() {
  const contextObj = useContext(postList);
  const profileObj = useContext(profileabout);
  const profile = profileObj.profile;
  const setProfile = profileObj.setProfile;
  const editProfile = profileObj.editProfile;
  const profileLoading = profileObj.profileLoading;
  const setProfileLoading = profileObj.setProfileLoading;

  const postlist = contextObj.postlist;
  const auth = contextObj.auth;
  const navigate = useNavigate();

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
        if (data.success) setProfile(data.user);
        else {
          editProfile(data.user);
        }
      })
      .finally(() => setProfileLoading(false));
  }, []);

  const userPosts = postlist.filter((post) => post.userId === profile?._id);

  if (profileLoading) {
    console.log(auth.isAuthenticated);
    return <Loading />;
  }

  if (!profile) {
    return <h1>No profile found</h1>;
  }

  return (
    <>
      <ProfileLayout
        profile={profile}
        postsCount={userPosts.length}
        followersCount={profile?.followers?.length || 0}
        followingCount={profile?.following?.length || 0}
        isOwner={true}
        onEdit={() => navigate("/postify/edit/profile")}
        onBack={() => navigate("/postify")}
      />
    </>
  );
}

export default MyProfile;

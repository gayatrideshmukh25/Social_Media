import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postList } from "../context/Post_List-store";
import { CgProfile } from "react-icons/cg";

const AllUsers = () => {
  const { users, setUsers } = useContext(postList);
  // const [users, setUsers] = useState([]);
  const { auth, authUser, setAuthUser } = useContext(postList);

  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/allusers", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          // const authUser = await db
          //     .collection("users")
          //     .findOne({ _id: new ObjectId(userId) });
          const followersIds = authUser?.following || [];
          console.log(followersIds);

          // const users = await db
          //   .collection("users")
          //   .find({
          //     _id: {
          //       $nin: [...followersIds, new ObjectId(userId)],
          //     },
          //   })
          //   .toArray();

          setUsers(data.users);
          setAuthUser(data.authUser);
          console.log(data.users);
          console.log(authUser);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  const showProfileHandler = (userId) => {
    // console.log("user id to find profiek fo user", post.user._id);
    console.log(userId, "kxajsicje");
    navigate(`/postify/userprofile/${userId}`);
  };
  const addFollowers = (userId) => {
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
        setFollowStatus((prev) => ({
          ...prev,
          [userId]: "Following",
        }));
      });
  };

  const followingIds = authUser?.following || [];

  const filteredUsers = users.filter(
    (user) => !followingIds.includes(user._id) && user._id !== authUser._id
  );

  return (
    <div className="all-users">
      {/* {users.map(
        (user) =>
          auth.userId === user._id && ( */}
      <li key={authUser._id}>
        <CgProfile size={40} className="text-primary me-3 flex-shrink-0" />
        <div className="flex-grow-1">
          <h6
            className="mb-1 fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => showProfileHandler(authUser._id)}
          >
            {authUser.userName}
          </h6>
        </div>
        {/* <button onClick={() => addFollowers(user._id)}>
              {followStatus[user._id] || "Follow"}
            </button> */}
      </li>
      {/* )
      )} */}
      <hr></hr>
      <ul>
        {/* {users.map((user) => ( */}
        {filteredUsers.map((user) => (
          <li key={user._id}>
            <CgProfile size={40} className="text-primary me-3 flex-shrink-0" />
            <div className="flex-grow-1">
              <h6
                className="mb-1 fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => showProfileHandler(user._id)}
              >
                {user.userName}
              </h6>
            </div>
            <button onClick={() => addFollowers(user._id)}>
              {followStatus[user._id] || "Follow"}
            </button>
          </li>
        ))}

        {/* <li key={user._id}>
            <CgProfile size={40} className="text-primary me-3 flex-shrink-0" />
            <div className="flex-grow-1">
              <h6
                className="mb-1 fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => showProfileHandler(user._id)}
              >
                {user.userName}
              </h6>
            </div>
            <button onClick={() => addFollowers(user._id)}>
              {followStatus[user._id] || "Follow"}
            </button>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default AllUsers;

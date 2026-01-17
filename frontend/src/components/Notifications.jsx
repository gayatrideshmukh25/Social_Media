import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  useEffect(() => {
    console.log("inside use effect fro getting notifications");
    fetch("http://localhost:3000/api/getNotifications", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.notifications, "notifications");
        setNotifications(data.notifications);
      });
  }, []);
  const acceptRequest = (notificationId, senderId, notificationStatus) => {
    const currState = notificationStatus;
    if (currState === "pending") {
      console.log(senderId, "its senders id");
      fetch("http://localhost:3000/api/acceptFollowRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          senderId: senderId,
          notificationId: notificationId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setFollowStatus((prev) => ({
            ...prev,
            [senderId]: "Follow Back",
          }));
          console.log(data.message);
        });
      console.log("request accepted");
    } else if (currState === "accepted") {
      fetch("http://localhost:3000/api/followBack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          receiverId: senderId,
          notificationId: notificationId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setFollowStatus((prev) => ({
            ...prev,
            [senderId]: "Following",
          }));
          console.log(data.message);
        });
    }
  };

  return (
    <>
      <div className="container mt-4 notifications">
        <h3>Notifications</h3>
        {notifications.length === 0 && <p>No notifications</p>}

        {notifications.map((notification) => (
          <div key={notification._id} className="card mb-2 p-3">
            <p>{notification.message}</p>

            {notification.type === "Follow_Request" && (
              <div className="notification">
                {/* <img
                  src={n.sender.profilePic}
                  alt="profile"
                  className="avatar"
                /> */}
                <CgProfile
                  size={40}
                  className="text-primary me-3 flex-shrink-0"
                />
                <strong>{notification.sender.userName}</strong>
                <span> sent you a follow request</span>

                <button
                  onClick={() =>
                    acceptRequest(
                      notification._id,
                      notification.sender._id,
                      notification.status
                    )
                  }
                >
                  {notification.status === "pending"
                    ? "Accept"
                    : notification.status === "accepted"
                    ? "Follow Back"
                    : notification.status === "Requested_back"
                    ? "Requested"
                    : "Following"}
                  {/* {followStatus[notification.sender._id] || "Accept"} */}
                </button>
              </div>
              //   <strong>{n.sender.username}</strong>
              // <button
              //   className="btn btn-success btn-sm"
              //   onClick={() =>
              //     acceptRequest(notification._id, notification.senderId)
              //   }
              // >
              //   Accept
              // </button>Follow_Back
            )}
            {notification.type === "Follow_Back" && (
              <div className="notification">
                {/* <img
                  src={n.sender.profilePic}
                  alt="profile"
                  className="avatar"
                /> */}
                <CgProfile
                  size={40}
                  className="text-primary me-3 flex-shrink-0"
                />
                <strong>{notification.sender.userName}</strong>
                <span> sent you a follow request</span>

                <button
                  onClick={() =>
                    acceptRequest(notification._id, notification.sender._id)
                  }
                >
                  {notification.status === "pending"
                    ? "Accept"
                    : notification.status === "accepted"
                    ? "Follow Back"
                    : notification.status === "Requested_back"
                    ? "Requested"
                    : "Following"}
                  {/* {followStatus[notification.sender._id] || "Accept"} */}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
export default Notifications;

import "./rightBar.scss";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const { data: followingg } = useQuery({
    queryKey: ["relationships", userId],
    queryFn: () =>
      makeRequest
        .get(`/relationships/followed/${userId}`)
        .then((res) => res.data),
    onSuccess: (data) => {},
  });
  const { data: followers } = useQuery({
    queryKey: ["relationships", userId],
    queryFn: () =>
      makeRequest
        .get(`/relationships/follower/${userId}`)
        .then((res) => res.data),
    onSuccess: (data) => {},
  });
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
        </div>
        <div className="item">
          <span>Followers</span>
          <div>
            {followers &&
              followers.map((follower) => (
                <div key={follower.id}>
                  <ul className="user">
                    <li  className="userInfo">
                      <Link
                        to={`/profile/${follower.id}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <img src={`/upload/${follower.profilePic}`} alt="" />
                      </Link>
                      <div className="online" />
                      <span>{follower.username}</span>
                    </li>
                  </ul>
                </div>
              ))}
          </div>
        </div>

        <div className="item">
          <span>Followings</span>
          <div>
            {followingg &&
              followingg.map((following) => (
                <div key={following.id}>
                  <ul className="user">
                    <li  className="userInfo">
                      <Link
                        to={`/profile/${following.id}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <img src={`/upload/${following.profilePic}`} alt="" />
                      </Link>
                      <div className="online" />
                      <span>{following.username}</span>
                    </li>
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;

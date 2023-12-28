import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [followingg, setFollowingg] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserId=" + userId)
        .then((res) => res.data),
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(currentUser.id));
  };

  const getFollower = async () => {
    try {
      const response = await makeRequest.get(
        `/relationships/follower/${userId}`
      );
      setFollowers(response.data);
      setShowFollowers(!showFollowers);
    } catch (error) {
      console.error("Error fetching followers", error);
    }
  };
  const getFollowing = async () => {
    try {
      const response = await makeRequest.get(
        `/relationships/followed/${userId}`
      );
      setFollowingg(response.data);
      setShowFollowing(!showFollowing);
    } catch (error) {
      console.error("Error fetching following", error);
    }
  };
  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <img
              src={"/upload/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData?.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              {/* TODO: it needs refresh to load any follower or following's profile  */}
              <div className="right">
                <button onClick={getFollower}>Follower</button>
                {showFollowers && (
                  <div>
                    <h2 style={{marginTop:'30px'}}>Followers</h2>
                    <ul>
                      {followers.map((follower) => (
                        <li key={follower.id} style={{listStyle:'none'}}>
                          <Link
                            to={`/profile/${follower.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              cursor: "pointer",
                            }}
                          >
                            <img
                              style={{
                                marginRight: "10px",
                                height: "20px",
                                width: "20px",
                                borderRadius: "50%",
                              }}
                              src={`/upload/${follower.profilePic}`}
                              alt=""
                            />
                          </Link>
                          {follower.username}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={getFollowing}>Following</button>
                {showFollowing && (
                  <div>
                    <h2>Following</h2>
                    <ul>
                      {followingg.map((followed) => (
                        <li key={followed.id}  style={{listStyle:'none'}}>
                          <Link
                            to={`/profile/${followed.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              cursor: "pointer",
                            }}
                          >
                            <img
                              style={{
                                marginRight: "10 px",
                                height: "20px",
                                width: "20px",
                                borderRadius: "50%",
                              }}
                              src={`/upload/${followed.profilePic}`}
                              alt=""
                            />
                          </Link>
                          {followed.username}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            
            </div>
            <Posts  />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;

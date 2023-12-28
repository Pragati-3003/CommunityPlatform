import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
const Posts = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts?userId=" + userId).then((res) => res.data),
  });

  if (error) {
    return <div className="posts">Something went wrong!</div>;
  }

  if (isLoading) {
    return <div className="posts">Loading...</div>;
  }
  return (
    <div className="posts">
      {data?.map((post,index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Posts;

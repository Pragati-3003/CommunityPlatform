import React from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const queryClient = useQueryClient();
  const { currentUser } = React.useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  const mutation = useMutation(
   { mutationFn:(newStory) => makeRequest.post("/stories", newStory).then((res) => res.data),
    
      onSuccess: () => {
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  const [newStory, setNewStory] = React.useState({
    img: "",
    name: currentUser.name,
  });

  const [file, setFile] = React.useState(null);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data.url; // assuming the response has a property named 'url'
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const imgUrl = await upload();
        setNewStory({ ...newStory, img: imgUrl });
        mutation.mutate(newStory);
        setFile(null);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={`/upload/${currentUser.profilePic}`} alt="" />
        <span>{currentUser.name}</span>

        <input type="file" id="file" onChange={handleFileChange} />
        <label htmlFor="file">
          <button onClick={handleAddStory}>+</button>
        </label>
      </div>
      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        "Loading"
      ) : (
        data.map((story, index) => (
          <div className="story" key={story.id || index}>
            <img src={story.img} alt="" />
            <span>{story.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;

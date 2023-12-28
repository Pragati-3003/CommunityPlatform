import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const getFollowers = (req, res) => {
  const userId = req.params.userId;
  const q =
    "SELECT DISTINCT users.id,users.profilePic, users.username ,relationships.followedUserId FROM relationships INNER JOIN users ON relationships.followerUserId = users.id WHERE followedUserId = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error in getFollowers query", err);
      return res.status(500).json(err);
    }
    // console.log("Followers data:", data);
    return res.status(200).json(data);
  });
};

export const getFollowed = (req, res) => {
  const userId = req.params.userId;
  const q =
    "SELECT DISTINCT users.id,users.profilePic, users.username ,relationships.followerUserId FROM relationships INNER JOIN users ON relationships.followedUserId = users.id WHERE followerUserId = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error in getFollowed query", err);
      return res.status(500).json(err);
    }
    // console.log("Followed data:", data);
    return res.status(200).json(data);
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token,process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};
export const getRelationships = (req,res)=>{
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(relationship=>relationship.followerUserId));
  });
}
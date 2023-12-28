import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

export const getSuggestedUsers = async (req, res) => {
  const userId = req.query.userId;

  try {
    const query = `
      SELECT u.id, u.name, u.profilePic
      FROM users u
      WHERE u.id <> ? AND u.id NOT IN (
        SELECT r.followedUserId
        FROM relationships r
        WHERE r.followerUserId = ?
      )
      AND u.id NOT IN (
        SELECT r2.followedUserId
        FROM relationships r1
        JOIN relationships r2 ON r1.followedUserId = r2.followerUserId
        WHERE r1.followerUserId = ?
      )
      ORDER BY RAND()
      LIMIT 5;
    `;

    const [suggestedUsers] = await db.query(query, [userId, userId, userId]);

    if (suggestedUsers.length === 0) {
      return res.status(404).json({ error: "Not Found", details: "No suggested users found" });
    }

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error fetching suggested users", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
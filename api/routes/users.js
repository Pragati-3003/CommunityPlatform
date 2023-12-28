import express from "express";
import { getUser , updateUser,getSuggestedUsers} from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/suggestions/:userId", getSuggestedUsers);

export default router
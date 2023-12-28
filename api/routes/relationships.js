import express from "express";
import { getFollowers , getRelationships,getFollowed, addRelationship, deleteRelationship } from "../controllers/relationship.js";

const router = express.Router()
router.get("/", getRelationships)
router.get("/follower/:userId", getFollowers)
router.get("/followed/:userId", getFollowed)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)


export default router
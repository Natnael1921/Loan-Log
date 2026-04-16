import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  searchUsers,
  sendRequest,
  acceptRequest,
  rejectRequest,
  getFriends,
  getFriendRequests,
} from "../controllers/friend.controller.js";

const router = express.Router();

// search users
router.get("/search", protect, searchUsers);

// send friend request
router.post("/request/:id", protect, sendRequest);

// accept request
router.put("/accept/:id", protect, acceptRequest);

// reject request
router.put("/reject/:id", protect, rejectRequest);

// get friends list
router.get("/", protect, getFriends);

//get requests list
router.get("/requests", protect, getFriendRequests);

export default router;

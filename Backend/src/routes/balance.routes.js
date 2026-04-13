import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getBalance } from "../controllers/balance.routes.js";

const router = express.Router();

router.get("/:friendId", protect, getBalance);

export default router;

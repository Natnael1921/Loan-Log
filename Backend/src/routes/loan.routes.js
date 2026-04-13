import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createLoan,
  getLoans,
  acceptLoan,
  rejectLoan,
} from "../controllers/loan.controller.js";

const router = express.Router();

// create loan request
router.post("/", protect, createLoan);

// get loan history between 2 users
router.get("/:friendId", protect, getLoans);

// accept loan
router.put("/accept/:id", protect, acceptLoan);

// reject loan
router.put("/reject/:id", protect, rejectLoan);

export default router;
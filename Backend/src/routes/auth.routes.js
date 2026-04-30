import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { sendCode } from "../controllers/auth.controller.js";
const router = express.Router();
import { verifyCode } from "../controllers/auth.controller.js";
router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
//router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
export default router;
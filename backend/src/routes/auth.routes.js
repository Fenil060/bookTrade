import express from "express";
import { registerUser, loginUser, googleAuth, getProfile, updatePhone } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.get("/profile", protect, getProfile);
router.put("/update-phone", protect, updatePhone);

export default router;
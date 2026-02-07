import express from "express";
import { isAuth, login, logout, signup, updateProfile } from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/isauth",isAuthenticated,isAuth)
router.post("/logout", logout);


router.put("/profile", isAuthenticated, updateProfile);


export default router;

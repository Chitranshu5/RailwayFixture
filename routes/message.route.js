import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { getMessages, getUsers, sendMessage } from "../controller/message.controller";

const router = express.Router();

router.get("/users", isAuthenticated, getUsers);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:receiverId", isAuthenticated, sendMessage);

export default router;

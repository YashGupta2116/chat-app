import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUserMessages, getUsers , sendMessage} from '../controllers/message.controller.js';

const router = express.Router();

router.get("/user" , protectRoute , getUsers);
router.get("/:id" , protectRoute , getUserMessages);

router.post("/send/:id" , protectRoute , sendMessage)

export default router;
import express from "express";
import { triggerServo } from "../controllers/servoController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, triggerServo);

export default router;

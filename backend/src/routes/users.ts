import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController";


const router = express.Router();

router.get("/", protect, getAllUsers);
router.post("/", createUser);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUserById);
router.delete("/:id", protect, deleteUserById);

export default router;

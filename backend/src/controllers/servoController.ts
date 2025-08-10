import { Request, Response } from "express";
import ServoLog from "../models/ServoLog";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const triggerServo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Assume userId is in req.userId from your auth middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Increment pressCount or create if none exists
    const updatedLog = await ServoLog.findOneAndUpdate(
      { userId },
      { $inc: { pressCount: 1 } },
      { upsert: true, new: true }
    );

    // TODO: Add your device triggering logic here

    res.json({
      message: "Button pressed and logged",
      pressCount: updatedLog.pressCount,
    });
  } catch (error) {
    console.error("Error pressing button:", error);
    res.status(500).json({ message: "Server error" });
  }
};

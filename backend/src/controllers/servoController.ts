import { Request, Response } from "express";
import ServoLog from "../models/ServoLog";
import { sendCommandToDevice } from "../services/wsManager"; // new helper

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const triggerServo = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Increment pressCount
    const updatedLog = await ServoLog.findOneAndUpdate(
      { userId },
      { $inc: { pressCount: 1 } },
      { upsert: true, new: true }
    );

    // Ask device via WebSocket
    console.log(`Triggering servo for userId=${userId}`);
    const result = await sendCommandToDevice(userId, { action: "TRIGGER" });

    res.json({
      message: "Button pressed, logged, and servo triggered",
      pressCount: updatedLog.pressCount,
      servoResult: result,
    });
  } catch (error) {
    console.error("Error pressing button:", error);
    res.status(500).json({ message: "Server error" });
  }
};

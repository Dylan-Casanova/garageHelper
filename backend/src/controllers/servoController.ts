import { Request, Response } from "express";
import ServoLog from "../models/ServoLog";
import axios from "axios";

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

    // Increment pressCount or create if none exists
    const updatedLog = await ServoLog.findOneAndUpdate(
      { userId },
      { $inc: { pressCount: 1 } },
      { upsert: true, new: true }
    );
    
    let servoResponse;
    const servoApiUrl = process.env.SERVO_API;
    if (!servoApiUrl) {
      return res.status(500).json({ message: "SERVO_API environment variable is not set" });
    }
    try {
      servoResponse = await axios.post(servoApiUrl);
      console.log("Servo response:", servoResponse.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error reaching servo device:", err.message);
      } else {
        console.error("Error reaching servo device:", err);
      }
      return res.status(502).json({ message: "Could not reach servo device" });
    }

    res.json({
      message: "Button pressed, logged, and servo triggered",
      pressCount: updatedLog.pressCount,
      servoResult: servoResponse.data,
    });
  } catch (error) {
    console.error("Error pressing button:", error);
    res.status(500).json({ message: "Server error" });
  }
};

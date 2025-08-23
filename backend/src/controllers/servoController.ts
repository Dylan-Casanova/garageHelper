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
    console.log("from controller,", userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { triggerAt } = req.body; // optional ISO string timestamp

    // Always increment pressCount when request made
    const updatedLog = await ServoLog.findOneAndUpdate(
      { userId },
      { $inc: { pressCount: 1 } },
      { upsert: true, new: true }
    );

    if (triggerAt) {
      console.log('triggered at', triggerAt)
      // Scheduled trigger
      const delayMs = new Date(triggerAt).getTime() - Date.now();

      if (delayMs <= 0) {
        return res
          .status(400)
          .json({ message: "Invalid time (must be in the future)" });
      }

      setTimeout(async () => {
        try {
          await sendCommandToDevice(userId, { action: "TRIGGER" });
          console.log(
            `Scheduled servo triggered for userId=${userId} at ${triggerAt}...`
          );
        } catch (err) {
          console.error("Scheduled trigger failed:", err);
        }
      }, delayMs);
console.log('inside the timeout before return')
      return res.json({
        message: "Servo scheduled successfully",
        triggerAt,
        pressCount: updatedLog.pressCount,
      });
    } else {
      // Immediate trigger
      const result = await sendCommandToDevice(userId, { action: "TRIGGER" });

      console.log("else")
      return res.json({
        message: "Servo triggered immediately",
        pressCount: updatedLog.pressCount,
        servoResult: result,
      });
    }
  } catch (error) {
    console.error("Error triggering servo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

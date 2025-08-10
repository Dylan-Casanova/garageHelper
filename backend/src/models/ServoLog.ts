import mongoose, { Schema, Document } from "mongoose";

export interface IServoLog extends Document {
  userId: mongoose.Types.ObjectId;
  pressCount: number;
  updatedAt: Date;
  createdAt: Date;
}

const ServoLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    pressCount: { type: Number, default: 0 },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export default mongoose.model<IServoLog>("ServoLogSchema", ServoLogSchema);

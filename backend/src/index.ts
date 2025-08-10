import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import servoRoutes from "./routes/servo";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use(
  cors()
);

app.get("/", (req, res) => res.send("API running"));

app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/servo", servoRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

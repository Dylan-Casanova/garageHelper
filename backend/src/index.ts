import express from "express";
import http from "http";

import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import servoRoutes from "./routes/servo";
import { initWs } from "./services/wsManager"; // WebSocket manager

dotenv.config();

const app = express();
const server = http.createServer(app);
// Init WebSocket manager
initWs(server);


connectDB();

app.use(express.json());

app.use(
  cors()
);

app.get("/", (req, res) => res.send("API running"));

app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/servo", servoRoutes);
app.get("/ping", (_, res) => res.send("pong"));

// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const PORT = parseInt(process.env.PORT || "5001", 10);
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server started on port ${PORT},servo`)
);


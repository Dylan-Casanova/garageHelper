import { WebSocketServer } from "ws";
import WebSocket from "ws";
import type { Server as HttpServer } from "http";

// Store mapping: userId → deviceSocket
const devices: Map<string, WebSocket> = new Map();

export function initWs(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");

    // Expect device to authenticate right away
    ws.once("message", (msg: WebSocket.RawData) => {
      try {
        const data = JSON.parse(msg.toString());
        const { userId } = data as { userId?: string };

        if (!userId) {
          ws.close(1008, "Missing userId");
          return;
        }

        devices.set(userId, ws);
        console.log(`Device registered for userId=${userId}`);

        ws.on("close", () => {
          devices.delete(userId);
          console.log(`Device for userId=${userId} disconnected`);
        });
      } catch (err) {
        console.error("Invalid first message from device:", err);
        ws.close(1008, "Invalid handshake");
      }
    });
  });

  console.log("WebSocket server running at /ws");
}

export function sendCommandToDevice(
  userId: string,
  command: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const ws = devices.get(userId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return reject(new Error("Device offline"));
    }

    // Send command
    ws.send(JSON.stringify(command));

    // Wait for ACK
    const ackHandler = (msg: WebSocket.RawData) => {
      try {
        const data = JSON.parse(msg.toString()) as Record<string, unknown>;
        if (data.status === "ok") {
          ws.off("message", ackHandler);
          resolve(data);
        }
      } catch (err) {
        console.error("Invalid ACK from device:", err);
      }
    };

    ws.on("message", ackHandler);

    // Timeout after 3s
    setTimeout(() => {
      ws.off("message", ackHandler);
      reject(new Error("Device did not respond in time"));
    }, 3000);
  });
}

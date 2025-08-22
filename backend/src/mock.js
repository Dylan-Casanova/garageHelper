const WebSocket = require("ws");

const userId = "testUser1"; // same as ESP will use
const ws = new WebSocket("ws://192.168.86.22:5001/ws"); // replace with your PC LAN IP

ws.on("open", () => {
  console.log("Mock device connected to server");

  // Send handshake with userId
  ws.send(JSON.stringify({ userId }));

  // Reply with ACK when receiving a command
  ws.on("message", (msg) => {
    console.log("Mock device got command:", msg.toString());
    setTimeout(() => {
      ws.send(JSON.stringify({ status: "ok" })); // simulate ACK
    }, 500);
  });
});

ws.on("close", () => console.log("Mock device disconnected"));
ws.on("error", (err) => console.error("Mock device error:", err));

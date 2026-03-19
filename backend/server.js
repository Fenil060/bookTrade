import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ requestId }) => {
    socket.join(requestId);
    console.log(`Joined room ${requestId}`);
  });

  socket.on("sendMessage", (msg) => {
    // emit to everyone EXCEPT sender
    socket.to(msg.requestId.toString()).emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

// Connect DB first, then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});


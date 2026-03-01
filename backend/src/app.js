import express from "express";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import requestRoutes from "./routes/request.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", chatRoutes);

export default app;

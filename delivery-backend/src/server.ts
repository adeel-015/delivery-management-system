import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { initSocket } from "./socket/socketManager";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";
import ordersRoutes from "./routes/orders";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Validate critical env vars early to fail fast with helpful message
const requiredEnvs = ["MONGODB_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
  console.error(
    "Copy .env.example to .env and set the missing values, then restart the server."
  );
  process.exit(1);
}

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5001;

connectDB(
  process.env.MONGODB_URI || "mongodb://localhost:27017/delivery-system"
)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

export default app;

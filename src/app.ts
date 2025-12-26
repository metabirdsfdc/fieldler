import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import routes from "./routes/index.js";

const app = express();

const url = "http://localhost:5173";
const frontendUrl = "https://metafie.vercel.app";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origin === frontendUrl) {
        return callback(null, true);
      }

      if (origin === url) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/request/v1", routes);
app.use("/api/auth", authRoutes);

app.get("/request/v1/ping", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString()
  });
});

export default app;

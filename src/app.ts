import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/request/v1", routes);

app.get("/request/v1/ping", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString()
  });
});

export default app;

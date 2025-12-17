import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://fieldler.vercel.app"],
    credentials: true
  })
);
app.use(express.json());
app.use("/request", routes);

app.get("/request/ping", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString()
  });
});

export default app;

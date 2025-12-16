import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/api/ping", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

export default app;

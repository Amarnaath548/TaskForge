import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes.js";
import { errorMiddlewar } from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timeStamp: new Date().toISOString(),
  });
});

app.use(generalLimiter)



app.use("/api/v1", router);

app.use(errorMiddlewar);

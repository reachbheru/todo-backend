import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: "32kb"}));
app.use(express.urlencoded({limit: "32kb", extended: true}));
app.use(cookieParser());

//import routers
import usersRouter from "./routers/users.router.js"
import tasksRouter from "./routers/tasks.router.js"

//declaring routers
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/tasks", tasksRouter);

export { app };
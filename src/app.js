import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


//import routers
import usersRouter from "./routers/users.router.js"
import tasksRouter from "./routers/tasks.router.js"

//declaring routers
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/tasks", tasksRouter);

export { app };
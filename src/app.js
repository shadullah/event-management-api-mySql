import express from "express";

const app = express();

import eventsRouter from "./routes/events.route.js";

app.use("/api/v1/events", eventsRouter);

export { app };

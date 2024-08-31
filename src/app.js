import express from "express";

const app = express();

app.use(express.json({ limit: "16kb" }));

// routes import here
import eventsRouter from "./routes/events.route.js";

//  routes declaration
app.use("/api/v1/events", eventsRouter);

export { app };

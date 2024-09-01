// import { request } from "express";
import request from "supertest";
import { app } from "../app.js";

// app.use('/', eventsRo)

describe("Event api", () => {
  it("should get all events", async () => {
    const res = await request(app).get("/api/v1/events");
    expect(res.status).toBe(200);
  });

  it("should get signle events", async () => {
    const res = await request(app).get("/api/v1/events/3");
    expect(res.status).toBe(200);
  });
});

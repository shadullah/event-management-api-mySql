// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

// main route
app.get("/", (req, res) => {
  res.send("Welcome to Event management Api with Mysql");
});

// db listen
connectDb()
  .then((connection) => {
    return connection.query("SELECT 1");
  })
  .then(() => {
    console.log("my sql db connected");

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("error connecting mysql db ", err);
  });

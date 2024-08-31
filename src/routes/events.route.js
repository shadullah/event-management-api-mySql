import { Router } from "express";
import {
  createEvents,
  deleteAnEvent,
  getAllEvents,
  getEventsById,
  updateAnEvent,
} from "../controllers/events.controller.js";

const router = Router();

// routes
router.route("/list").get(getAllEvents);
router.route("/list/:id").get(getEventsById);
router.route("/create").post(createEvents);
router.route("/update/:id").put(updateAnEvent);
router.route("/delete/:id").delete(deleteAnEvent);

export default router;

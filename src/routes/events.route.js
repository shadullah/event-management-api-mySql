import { Router } from "express";
import {
  addParticipantsInEvent,
  createEvents,
  deleteAnEvent,
  getAllEvents,
  getEventsById,
  getEventsParticipants,
  removeAnParticipant,
  updateAnEvent,
} from "../controllers/events.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// routes
// event lists
router.route("/events").get(getAllEvents);
// event by ID
router.route("/events/:id").get(getEventsById);
// event create
router.route("/events").post(verifyJWT, createEvents);
// event update
router.route("/events/:id").put(verifyJWT, updateAnEvent);
// event delete
router.route("/events/:id").delete(verifyJWT, deleteAnEvent);
// add participant
router.route("/events/:id/participants").post(addParticipantsInEvent);
// get participants of an event
router.route("/events/:id/participants").get(getEventsParticipants);
// remove participant from ann event
router
  .route("/events/:id/participants/:participantId")
  .delete(removeAnParticipant);

export default router;

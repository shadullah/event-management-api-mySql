import connectDb from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const connection = await connectDb();

// get events
const getAllEvents = asyncHandler(async (req, res) => {
  //   const connection = await connectDb();

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const [[{ totalRecords }]] = await connection.query(
    "select count(*) as totalRecords from events"
  );

  const [data] = await connection.query(
    "select * from events limit ? offset ?",
    [limit, offset]
  );

  if (!data) {
    throw new ApiError(404, "No records found");
  }

  const totalPages = Math.ceil(totalRecords / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events: data,
        totalEvents: data.length,
        totalPages,
        currentPage: page,
      },
      "all events fetched"
    )
  );
});

// get by Id
const getEventsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "event id not given");
  }

  const [data] = await connection.query(
    `select * from events WHERE Event_ID=?`,
    [id]
  );

  if (data.length === 0) {
    throw new ApiError(404, "event with this id not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "event with id fetched"));
});

// create events
const createEvents = asyncHandler(async (req, res) => {
  const {
    Event_name,
    Event_date,
    Start_time,
    End_time,
    Location,
    Description,
  } = req.body;

  if (
    [Event_name, Event_date, Start_time, End_time, Location].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const [existingEvent] = await connection.query(
    `SELECT * FROM events 
     WHERE 
       (
         (Start_time < ? AND End_time > ?)
         OR
         (Start_time > ? AND End_time < ?)
         OR
         (Start_time = ? AND End_time = ?)
       ) 
       AND Location = ? AND Event_date=?`,
    [
      Start_time,
      End_time,
      Start_time,
      End_time,
      Start_time,
      End_time,
      Location,
      Event_date,
    ]
  );

  if (existingEvent.length > 0) {
    throw new ApiError(
      500,
      "an event with this location or date exists already!!"
    );
  }

  const [makeEvents] = await connection.query(
    `INSERT into events (Event_name, Event_date, Start_time, End_time,Location,Description ) VALUES (?, ?,?, ?,?,?)`,
    [Event_name, Event_date, Start_time, End_time, Location, Description]
  );

  if (!makeEvents.affectedRows) {
    throw new ApiError(400, "could not create the event");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, makeEvents, "event created successfully!"));
});

// update events
const updateAnEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "id not given");
  }

  const { Event_name, Event_date, Location, Description } = req.body;

  const [editEvent] = await connection.query(
    `UPDATE events SET 
        Event_name = ?,
        Event_date = ?,
        Location= ?,
        Description = ?
        WHERE Event_ID = ?`,
    [Event_name, Event_date, Location, Description, id]
  );

  if (editEvent.affectedRows === 0) {
    throw new ApiError(500, "Could not edit the event");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, editEvent, "event updated successfully!!"));
});

// Delete an event
const deleteAnEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(500, "id not given");
  }

  const [removeEvent] = await connection.query(
    `DELETE FROM events WHERE Event_ID = ?`,
    [id]
  );

  if (removeEvent.affectedRows === 0) {
    throw new ApiError(400, "couldn't delete the event");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, removeEvent, "deleted event successfully!!"));
});

// Add participants to event
const addParticipantsInEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    throw new ApiError(500, "email not given");
  }

  const [eventExists] = await connection.query(
    `SELECT * FROM events WHERE Event_ID=?`,
    [id]
  );
  if (eventExists.length === 0) {
    throw new ApiError(404, "Event not found");
  }

  let [participant] = await connection.query(
    `SELECT * FROM participants WHERE Email = ?`,
    [email]
  );

  if (participant.length === 0) {
    const [newParticipant] = await connection.query(
      `INSERT INTO participants(Email) VALUES (?)`,
      [email]
    );
    participant = [{ Participant_id: newParticipant.insertId }];
  }

  const [createParticipant] = await connection.query(
    `INSERT INTO event_participants(Event_ID, Participant_id) VALUES(?, ?)`,
    [id, participant[0].Participant_id]
  );

  if (createParticipant.affectedRows === 0) {
    throw new ApiError(400, "participant not created");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createParticipant,
        "participant added to event successfully"
      )
    );
});

// get events with participants
const getEventsParticipants = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(500, "id not given");
  }

  const [eventParticpants] = await connection.query(
    `SELECT * FROM event_participants WHERE Event_ID = ?`,
    [id]
  );

  if (eventParticpants.affectedRows === 0) {
    throw new ApiError(404, "No event participants found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        eventParticpants,
        "event participants fetched successfully!!"
      )
    );
});

// remove participants from an event
const removeAnParticipant = asyncHandler(async (req, res) => {
  const { id, participantId } = req.params;

  if (!(id || participantId)) {
    throw new ApiError(500, "event id or participant id not given");
  }

  const [eventExists] = await connection.query(
    `SELECT * FROM events WHERE Event_ID=?`,
    [id]
  );
  if (eventExists.length === 0) {
    throw new ApiError(404, "Event not found");
  }

  const [DeleteParticipantFromEvent] = await connection.query(
    `DELETE FROM event_participants WHERE Event_ID = ? AND Participant_id =?`,
    [id, participantId]
  );

  if (DeleteParticipantFromEvent.affectedRows === 0) {
    throw new ApiError(400, "Delete participant failed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        DeleteParticipantFromEvent,
        "Deleted participant successfull"
      )
    );
});

export {
  getAllEvents,
  getEventsById,
  createEvents,
  updateAnEvent,
  deleteAnEvent,
  addParticipantsInEvent,
  getEventsParticipants,
  removeAnParticipant,
};

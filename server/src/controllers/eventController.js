const Event = require("../models/eventModel");
const { checkUserPermission } = require("../middlewares/checkUserPermission");
const { Op } = require("sequelize");
const eventService = require("../services/eventService");
require("dotenv").config();

async function generateEventId() {
  const currentYear = new Date().getFullYear().toString();
  const latestEvent = await Event.findOne({
    where: {
      eventId: {
        [Op.like]: `${currentYear}-%`,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  let newEventIdNumber = "0001";

  if (latestEvent) {
    const latestIdNumber = parseInt(latestEvent.eventId.split("-")[1], 10);
    const nextIdNumber = latestIdNumber + 1;
    newEventIdNumber = nextIdNumber.toString().padStart(4, "0");
  }

  return `${currentYear}-${newEventIdNumber}`;
}

async function addEvent(req, res) {
  try {
    const {
      eventName,
      eventHost,
      eventSchedStart,
      eventSchedEnd,
      eventLocation,
      eventDescription,
      needRD,
      needARD,
      needLGMED,
      needLGCDD,
      needORD,
      needFAD,
      needPDMU,
      needRICTU,
      needLEGAL,
      invitedEmails,
      eventDate,
      createdBy,
      meetingLink,
    } = req.body;

    const eventId = await generateEventId();

    const newEvent = await Event.create({
      eventId,
      eventName,
      eventHost,
      eventSchedStart,
      eventSchedEnd,
      eventLocation,
      eventDescription,
      needRD,
      needARD,
      needLGMED,
      needLGCDD,
      needORD,
      needFAD,
      needPDMU,
      needRICTU,
      needLEGAL,
      invitedEmails,
      eventDate,
      createdBy,
      meetingLink,
    });

    res.status(201).json({ newEvent });
  } catch (error) {
    console.error("Error during adding event:", error);
    res.status(500).json({ error: "Adding event failed" });
  }
}

async function editEvent(req, res) {
  try {
    const { eventId } = req.params;
    const updatedData = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    await event.update(updatedData);

    res.status(200).json({ event });
  } catch (error) {
    console.error("Error during event edit:", error);
    res.status(500).json({ error: "Event edit failed" });
  }
}

async function approveEvent(req, res) {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    await event.update({ isApproved: true, approvedEventStatus: "Scheduled" });

    // Send invitation emails to all invited users
    const invitedEmails = JSON.parse(event.invitedEmails);
    await eventService.sendInvitationEmail(invitedEmails, event);

    res.status(200).json({ event });
  } catch (error) {
    console.error("Error during event approval:", error);
    res.status(500).json({ error: "Event approval failed" });
  }
}

async function markEventInProgress(req, res) {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.isApproved && event.approvedEventStatus === "Scheduled") {
      await event.update({ approvedEventStatus: "In Progress" });
      event.invitedEmails = JSON.parse(event.invitedEmails);

      res.status(200).json({ event });
    } else {
      res.status(400).json({ error: "Event cannot be marked as In Progress" });
    }
  } catch (error) {
    console.error("Error during marking event in progress:", error);
    res.status(500).json({ error: "Marking event in progress failed" });
  }
}

async function markEventCompleted(req, res) {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.isApproved && event.approvedEventStatus === "In Progress") {
      await event.update({ approvedEventStatus: "Completed" });
      event.invitedEmails = JSON.parse(event.invitedEmails);

      res.status(200).json({ event });
    } else {
      res.status(400).json({ error: "Event cannot be marked as Completed" });
    }
  } catch (error) {
    console.error("Error during marking event as completed:", error);
    res.status(500).json({ error: "Marking event as completed failed" });
  }
}

async function markEventPostponed(req, res) {
  try {
    const { eventId } = req.params;
    const { reasonPostponedCancelled } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.isApproved && event.approvedEventStatus === "Scheduled") {
      await event.update({
        approvedEventStatus: "Postponed",
        reasonPostponedCancelled: reasonPostponedCancelled,
      });
      event.invitedEmails = JSON.parse(event.invitedEmails);

      await eventService.sendInterruptionEmail(event.invitedEmails, event);
      res.status(200).json({ event });
    } else {
      res.status(400).json({ error: "Event cannot be marked as postponed" });
    }
  } catch (error) {
    console.error("Error during marking event as postponed:", error);
    res.status(500).json({ error: "Marking event as postponed failed" });
  }
}

async function markEventCancelled(req, res) {
  try {
    const { eventId } = req.params;
    const { reasonPostponedCancelled } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.isApproved && event.approvedEventStatus === "Scheduled") {
      await event.update({
        approvedEventStatus: "Cancelled",
        reasonPostponedCancelled: reasonPostponedCancelled,
      });
      event.invitedEmails = JSON.parse(event.invitedEmails);

      await eventService.sendInterruptionEmail(event.invitedEmails, event);
      res.status(200).json({ event });
    } else {
      res.status(400).json({ error: "Event cannot be marked as cancelled" });
    }
  } catch (error) {
    console.error("Error during marking event as cancelled:", error);
    res.status(500).json({ error: "Marking event as cancelled failed" });
  }
}

async function declineEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { eventRemarks } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    await event.update({ eventRemarks });
    event.invitedEmails = JSON.parse(event.invitedEmails);

    res.status(200).json({ event });
  } catch (error) {
    console.error("Error during event decline:", error);
    res.status(500).json({ error: "Event decline failed" });
  }
}

async function deleteEvent(req, res) {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    await event.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error during event deletion:", error);
    res.status(500).json({ error: "Event deletion failed" });
  }
}

async function viewEvent(req, res) {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    event.dataValues.invitedEmails = JSON.parse(event.dataValues.invitedEmails);

    event.dataValues.eventSched = `${event.eventSchedStart} to ${event.eventSchedEnd}`;
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error during viewing event:", error);
    res.status(500).json({ error: "Viewing event failed" });
  }
}

async function retrieveAllEvents(req, res) {
  try {
    const { filter } = req.query;
    let events;
    if (filter === "approved") {
      events = await Event.findAll({
        where: {
          isApproved: true,
          eventRemarks: null,
        },
      });
    } else if (filter === "declined") {
      events = await Event.findAll({
        where: {
          isApproved: false,
          eventRemarks: {
            [Op.ne]: null,
          },
        },
      });
    } else if (filter === "unapproved") {
      events = await Event.findAll({
        where: {
          isApproved: false,
          eventRemarks: null,
        },
      });
    } else if (filter === "scheduled") {
      events = await Event.findAll({
        where: {
          isApproved: true,
          approvedEventStatus: "Scheduled",
        },
      });
    } else if (filter === "inProgress") {
      events = await Event.findAll({
        where: {
          isApproved: true,
          approvedEventStatus: "In Progress",
        },
      });
    } else if (filter === "completed") {
      events = await Event.findAll({
        where: {
          isApproved: true,
          approvedEventStatus: "Completed",
        },
      });
    } else if (filter === "postponed") {
      events = await Event.findAll({
        where: {
          isApproved: true,
          approvedEventStatus: "Postponed",
        },
      });
    } else if (filter === "cancelled") {
      events = await Event.findAll({
        where: {
          isApproved: true,
          approvedEventStatus: "Cancelled",
        },
      });
    } else {
      events = await Event.findAll();
    }
    events = events.map((event) => {
      try {
        event.invitedEmails = JSON.parse(event.invitedEmails);
      } catch (e) {
        console.error("Error parsing invitedEmails:", e);
        event.invitedEmails = [];
      }
      return event;
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error during retrieving all events:", error);
    res.status(500).json({ error: "Retrieving all events failed" });
  }
}

module.exports = {
  addEvent,
  editEvent,
  approveEvent,
  markEventInProgress,
  markEventCompleted,
  markEventPostponed,
  markEventCancelled,
  declineEvent,
  deleteEvent,
  viewEvent,
  retrieveAllEvents,
};

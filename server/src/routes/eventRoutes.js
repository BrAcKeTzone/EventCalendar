const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/add", eventController.addEvent);
router.put("/edit/:eventId", eventController.editEvent);
router.put("/approve/:eventId", eventController.approveEvent);
router.put("/decline/:eventId", eventController.declineEvent);
router.delete("/delete/:eventId", eventController.deleteEvent);
router.get("/view/:eventId", eventController.viewEvent);
router.get("/retrieve", eventController.retrieveAllEvents);

module.exports = router;
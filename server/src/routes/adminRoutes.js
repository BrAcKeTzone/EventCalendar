const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/adminController");


router.put("/approve/:id", adminController.approveUser);
router.put("/promote/:id", adminController.promoteUser);
router.put("/demote/:id", adminController.demoteUser);
router.delete("/decline/:id", adminController.declineUser);
router.get("/find", adminController.getAllUsers);

module.exports = router;

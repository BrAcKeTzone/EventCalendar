const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const router = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinaryConfig");
const userController = require("../controllers/userController");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: "auto",
    folder: "DILG/profiles",
    public_id_thumbnail: (req, file) => {
      return `profilePic_${Date.now()}_${file.originalname}`;
    },
    public_id_video: (req, file) => {
      return `profilePic_${Date.now()}_${file.originalname}`;
    },
  },
  allowedFormats: ["jpg", "jpeg", "png"],
  timeout: 60000 * 5,
});
const upload = multer({ storage: storage });

router.get("/profile/:id", userController.getUserInfo);
router.put(
  "/prof-edit",
  upload.single("profileImage"),
  userController.editUserInfo
);

module.exports = router;

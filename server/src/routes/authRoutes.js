const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

// Validation middleware for signup
const signupValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

// Validation middleware for verify signup
const verifySignupValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

// Validation middleware for login
const loginValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required")
];

// Validation middleware for forgot password
const forgotPassValidation = [
    body("email").isEmail().withMessage("Invalid email format")
];

const verifyForgotPassValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 characters long"),
    body("password").notEmpty().withMessage("Password is required")
];

const changePassValidation = [
    body("id")
        .isLength({ min: 4, max: 4 })
        .withMessage("ID must be 4 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required")
];

const verifyChangePassValidation = [
    body("id")
        .isLength({ min: 4, max: 4 })
        .withMessage("ID must be 4 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 characters long"),
    body("newPassword").notEmpty().withMessage("Password is required")
];

router.post("/signup", signupValidation, authController.signup);
router.post("/vsignup", verifySignupValidation, authController.verifySignup);
router.post("/login", loginValidation, authController.login);
router.post("/forgot", forgotPassValidation, authController.forgotPassword);
router.put(
    "/vforgot",
    verifyForgotPassValidation,
    authController.verifyForgotPassword
);
router.post("/cpass", changePassValidation, authController.changePassword);
router.put(
    "/vcpass",
    verifyChangePassValidation,
    authController.verifyChangePassword
);

module.exports = router;

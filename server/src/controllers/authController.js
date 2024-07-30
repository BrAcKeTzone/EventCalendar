require("dotenv").config();
const { Op } = require("sequelize");
const defineUserModel = require("../models/userModel");
const defineOTPModel = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../services/emailService");
const { checkUserPermission } = require("../middlewares/checkUserPermission");

let User, OTP;

const initializeModels = async () => {
    User = await defineUserModel;
    OTP = await defineOTPModel;
};

initializeModels();

async function signup(req, res) {
    try {
        const { email } = req.body;

        await initializeModels();

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        await OTP.removeExpiredEntries();

        const generatedOTP = await OTP.generateAndStoreOTP(email);

        await sendOTPEmail(email, generatedOTP);

        res.status(200).json({ message: "OTP sent to email for verification" });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "User signup failed" });
    }
}

async function verifySignup(req, res) {
    try {
        const {
            id,
            email,
            otp,
            name,
            password,
            dateOfBirth,
            jobPosition,
            assignedOffice
        } = req.body;
        
        await initializeModels();

        const latestOTP = await OTP.findOne({
            where: {
                email,
                expires: { [Op.gt]: new Date() }
            },
            order: [["createdAt", "DESC"]]
        });

        if (!latestOTP || latestOTP.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            id,
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            jobPosition,
            assignedOffice,
            isApproved: false,
            isAdmin: false
        });

        // Check if this is the first user and update fields accordingly
        const userCount = await User.count();
        if (userCount === 1) {
            await newUser.update({ isApproved: true, isAdmin: true });
        }

        await latestOTP.destroy();

        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY);

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ error: "OTP verification failed" });
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        
await initializeModels();

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ error: "Email does not exist" });
        }

        await OTP.removeExpiredEntries();

        const generatedOTP = await OTP.generateAndStoreOTP(email);

        await sendOTPEmail(email, generatedOTP);

        res.status(200).json({
            message: "OTP sent to email for password reset"
        });
    } catch (error) {
        console.error("Error during forgot password:", error);
        res.status(500).json({ error: "Forgot password failed" });
    }
}

async function verifyForgotPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        
await initializeModels();

        const latestOTP = await OTP.findOne({
            where: {
                email,
                expires: { [Op.gt]: new Date() }
            },
            order: [["createdAt", "DESC"]]
        });

        if (!latestOTP || latestOTP.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update({ password: hashedPassword }, { where: { email } });

        await latestOTP.destroy();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error during forgot password verification:", error);
        res.status(500).json({ error: "Forgot password verification failed" });
    }
}

async function changePassword(req, res) {
    try {
        const { id, email, currentPassword } = req.body;
        
        await initializeModels();
        
        if (!(await checkUserPermission(id, res))) {
            return;
        }
        const teacher = await User.findOne({ where: { email } });
        if (!teacher) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            teacher.password
        );
        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        await OTP.removeExpiredEntries(email);
        const generatedOTP = await OTP.generateAndStoreOTP(email);
        await sendOTPEmail(email, generatedOTP);
        res.status(200).json({ message: "OTP sent to email for verification" });
    } catch (error) {
        console.error(
            "Error during OTP generation for password change:",
            error
        );
        res.status(500).json({ error: "OTP generation failed" });
    }
}

async function verifyChangePassword(req, res) {
    try {
        const { id, email, otp, newPassword } = req.body;
        
        await initializeModels();
        
        if (!(await checkUserPermission(id, res))) {
            return;
        }
        const latestOTP = await OTP.findOne({
            where: {
                email,
                expires: { [Op.gt]: new Date() }
            },
            order: [["createdAt", "DESC"]]
        });
        if (!latestOTP || latestOTP.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });
        await latestOTP.destroy();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(
            "Error during OTP verification for password change:",
            error
        );
        res.status(500).json({ error: "OTP verification failed" });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        await initializeModels();

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (!user.isApproved) {
            return res.status(403).json({ error: "User is not approved" });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

        res.status(200).json({ user: user, token });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ error: "User login failed" });
    }
}

module.exports = {
    signup,
    verifySignup,
    forgotPassword,
    verifyForgotPassword,
    changePassword,
    verifyChangePassword,
    login
};

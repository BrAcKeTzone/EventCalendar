const defineUserModel = require("../models/userModel");
const { checkUserPermission } = require("../middlewares/checkUserPermission");
const bcrypt = require("bcryptjs");
const cloudinary = require("../configs/cloudinaryConfig");
require("dotenv").config();

let User;

const initializeModels = async () => {
    User = await defineUserModel;
};

initializeModels();

async function getUserInfo(req, res) {
    try {
        const { id } = req.params;
        await initializeModels();

        if (!(await checkUserPermission(id, res))) {
            return;
        }
        const profile = await User.findByPk(id);
        if (!profile) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ profile });
    } catch (error) {
        console.error("Error during getting user by ID:", error);
    }
}

async function editUserInfo(req, res) {
    try {
        const { id } = req.body;
        await initializeModels();
        // if (!(await checkUserPermission(id, res))) {
        //     return;
        // }
        const { currentPassword, ...updatedData } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (req.file) {
            if (user.profileImage && user.public_id) {
                await cloudinary.uploader.destroy(user.public_id);
            }
            updatedData.profileImage = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        if (currentPassword) {
            const passwordMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!passwordMatch) {
                return res
                    .status(401)
                    .json({ error: "Incorrect current password" });
            }
        }
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }
        await user.update(updatedData);
        res.status(201).json({ user });
    } catch (error) {
        console.error("Error during editing user information:", error);
        res.status(500).json({ error: "Editing user information failed" });
    }
}

module.exports = {
    getUserInfo,
    editUserInfo
};

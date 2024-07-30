const defineUserModel = require("../models/userModel");
const { checkUserPermission } = require("../middlewares/checkUserPermission");
require("dotenv").config();

let User;

const initializeModels = async () => {
    User = await defineUserModel;
};

initializeModels();


async function approveUser(req, res) {
    try {
        const { id } = req.params;
        
        await initializeModels();

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await user.update({ isApproved: true });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error during user edit:", error);
        res.status(500).json({ error: "User edit failed" });
    }
}

async function promoteUser(req, res) {
    try {
        const { id } = req.params;
        
        await initializeModels();

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await user.update({ isAdmin: true });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error during user edit:", error);
        res.status(500).json({ error: "User edit failed" });
    }
}

async function demoteUser(req, res) {
    try {
        const { id } = req.params;
        
        await initializeModels();

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await user.update({ isAdmin: false });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error during user edit:", error);
        res.status(500).json({ error: "User edit failed" });
    }
}

async function declineUser(req, res) {
    try {
        const { id } = req.params;
        
        await initializeModels();

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await user.destroy();

        res.status(204).send();
    } catch (error) {
        console.error("Error during user deletion:", error);
        res.status(500).json({ error: "User deletion failed" });
    }
}

async function getAllUsers(req, res) {
  await initializeModels();
    try {
        const { filter } = req.query;
        let users;

        switch (filter) {
            case "ARDRD":
                users = await User.findAll({
                    where: {
                        jobPosition: ["Regional Director", "Assistant Regional Director"],
                        isApproved: true
                    }
                });
                break;
            case "Approved":
                users = await User.findAll({
                    where: {
                        isApproved: true
                        
                    }
                });
                break;
            case "Pending":
                users = await User.findAll({
                    where: {
                        isApproved: false
                    }
                });
                break;
            case "Admin":
                users = await User.findAll({
                    where: {
                        isAdmin: true
                    }
                });
                break;
            default:
                users = await User.findAll();
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
}

module.exports = {
    approveUser,
    promoteUser,
    demoteUser,
    declineUser,
    getAllUsers
};

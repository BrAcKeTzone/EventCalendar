const User = require("../models/userModel");

async function checkUserPermission(userId, res) {
  try {
    if (!userId) {
      return res
        .status(400)
        .json({ error: "UserId is required in the request body" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return true;
  } catch (error) {
    console.error("Error during user permission check:", error);
    res.status(500).json({ error: "User permission check failed" });
    return false;
  }
}
exports.checkUserPermission = checkUserPermission;
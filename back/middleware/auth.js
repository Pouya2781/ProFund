const jwt = require("jsonwebtoken");
const { BannedUser, User } = require("../models");

module.exports = async function (req, res, next) {
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).json({ status: "missing_token", message: "Access denied. auth token required!" });
    
    
    let decoded = null;
    try {
        decoded = jwt.verify(token, "privateKey");
    }
    catch (ex) {
        res.status(400).json({ status: "invalid_token", message: "Invalid token!" });
    }

    let bannedUser = null;
    try {
        // Trying to find banned user
        const user = await User.findOne({
            where: {
                uuid: decoded.uuid
            }
        });
        bannedUser = await BannedUser.findOne({
            where: {
                userId: user.id
            }
        });
    }
    catch (ex) {
        res.status(500).json({ status: "internal_error", message: "Internal error!" });
    }

    if (bannedUser != null)
        return res.status(403).json({ status: "banned_user", message: "Access denied. You are banned!" });

    req.user = decoded;
    next();
}
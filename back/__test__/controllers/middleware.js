const { User, BannedUser } = require("../../models");
const jwt = require("jsonwebtoken");

const apiAccess = { user: ["/api/route"] };
const jwtPrivateKey = "privateKey";

async function authenticateAndAccess(req, res) {
    ////////// auth middleware
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).json({ status: "missing_token", message: "Access denied. auth token required!" });
    
    let decoded = null;
    try {
        decoded = jwt.verify(token, jwtPrivateKey);
    }
    catch (ex) {
        return res.status(400).json({ status: "invalid_token", message: "Invalid token!" });
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

    ////////// access middleware
    const role = req.user.role;
    if (!apiAccess[role].includes(req.originalUrl))
        return res.status(403).json({ status: "access_denied", message: "Access denied. You don't have access to use this API!" });

    return res.status(200).json({ status: "ok", message: "User authenticated and has access to API!" });
}

module.exports = { authenticateAndAccess }
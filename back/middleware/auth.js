const jwt = require("jsonwebtoken");
const { BannedUser } = require("../models");

module.exports = async function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. auth token required!");
    try {
        const decoded = jwt.verify(token, "privateKey");

        // Trying to find banned user
        const user = await User.findOne({
            where: {
                uuid: decoded.uuid
            }
        });
        const bannedUser = await BannedUser.findOne({
            where: {
                userId: user.id
            }
        });

        if (bannedUser != null)
            return res.status(403).send("Access denied. You are banned!");

        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send("Invalid token!");
    }
}
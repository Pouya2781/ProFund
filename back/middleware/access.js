// Should only be called after auth middleware
const config = require("config");

const apiAccess = config.get("api_access");

module.exports = function (req, res, next) {
    const role = req.user.role;
    if (!apiAccess[role].includes(req.originalUrl))
        return res.status(403).json({ status: "access_denied", message: "Access denied. You don't have access to use this API!" });
    next();
}
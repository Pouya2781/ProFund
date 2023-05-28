const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("x-ver-token");
    if (!token) return res.status(401).send("Access denied. ver token required!");
    try {
        const decoded = jwt.verify(token, "privateKey");
        req.phoneNumber = decoded.phoneNumber;
        next();
    }
    catch (ex) {
        res.status(400).send("Invalid token!");
    }
}
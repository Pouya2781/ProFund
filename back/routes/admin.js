const { User, Wallet, Project, Invest } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
//const { validateUserVerificationData } = require("../validators/user");
const express = require("express");
const router = express.Router();

router.get("/user", auth, access, asyncMiddleware(async (req, res) => {
    const users = await User.findAll({
        where: {
            role: "user"
        }
    });

    res.status(200).json({
        data: users,
        message: "user data retrieved successfully!",
        status: "ok"
    });
}));

module.exports = router;
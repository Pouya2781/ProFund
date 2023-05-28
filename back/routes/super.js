const { User } = require("../models");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateUserOptionData, validateUserIdData } = require("../validators/super");
const express = require("express");
const router = express.Router();

router.post("/user", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateUserOptionData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    let users = null;
    if (req.body.option == "0") {
        users = await User.findAll({
            where: {
                role: "user"
            }
        });
    } else if (req.body.option == "1") {
        users = await User.findAll({
            where: {
                role: "admin"
            }
        });
    } else {
        users = await User.findAll({
            where: {
                role: ["admin", "user"]
            }
        });
    }
    

    res.status(200).json({
        data: users,
        message: "user list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/user/promote", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateUserIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    await User.update(
        {
            role: "admin"
        },
        {
            where: { id: req.body.id }
        }
    );

    res.status(200).json({
        message: "user promoted successfully!",
        status: "ok"
    });
}));

router.post("/user/demote", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateUserIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    await User.update(
        {
            role: "user"
        },
        {
            where: { id: req.body.id }
        }
    );

    res.status(200).json({
        message: "user demoted successfully!",
        status: "ok"
    });
}));

module.exports = router;
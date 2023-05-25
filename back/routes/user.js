const { User, Wallet, Payment, Project, Invest } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { validateUserVerificationData } = require("../validators/user");
const express = require("express");
const router = express.Router();

router.get("/", auth, asyncMiddleware(async (req, res) => {
    // Finding the user according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    res.status(200).json({
        data: _.pick(newUser, ["phone_number", "full_name", "national_code", "birth_date", "email", "state", "city", "address", "bio"]),
        message: "user data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/wallet", auth, asyncMiddleware(async (req, res) => {
    // Finding the wallet according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const wallet = await Wallet.findOne({
        where: {
            userId: user.id
        }
    });

    res.status(200).json({
        data: _.pick(wallet, ["balance"]),
        message: "user's wallet data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/payment", auth, asyncMiddleware(async (req, res) => {
    // Finding the payments according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const wallet = await Wallet.findOne({
        where: {
            userId: user.id
        }
    });
    const payments = await Payment.findAll({
        where: {
            walletId: wallet.id
        }
    });
    

    res.status(200).json({
        data: payments,
        message: "user's payments data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/projects", auth, asyncMiddleware(async (req, res) => {
    // Finding the payments according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const projects = await Project.findAll({
        where: {
            userId: user.id
        }
    });
    

    res.status(200).json({
        data: projects,
        message: "user's projects data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/investments", auth, asyncMiddleware(async (req, res) => {
    // Finding the payments according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const investments = await Invest.findAll({
        where: {
            userId: user.id
        }
    });
    

    res.status(200).json({
        data: investments,
        message: "user's investment data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/verify", auth, asyncMiddleware(async (req, res) => {
    const { error } = validateUserVerificationData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    // Updating and completing user data 
    try {
        await User.update(
            {
                full_name: req.body.full_name,
                national_code: req.body.national_code,
                email: req.body.email,
                birth_date: req.body.birth_date,
                state: req.body.state,
                city: req.body.city,
                address: req.body.address,
                bio: req.body.bio
            },
            {
                where: { uuid: req.user.uuid }
            }
        );
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    res.status(200).json({
        message: "user data updated and completed successfully!",
        status: "ok"
    });
}));
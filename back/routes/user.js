const { User, Wallet, Payment, Project, Invest } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateUserVerificationData } = require("../validators/user");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const express = require("express");
const router = express.Router();

router.get("/", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the user according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    res.status(200).json({
        data: _.pick(user, ["phoneNumber", "fullName", "nationalCode", "birthDate", "email", "state", "city", "address", "bio"]),
        message: "user data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/wallet", auth, access, asyncMiddleware(async (req, res) => {
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

router.get("/payment", auth, access, asyncMiddleware(async (req, res) => {
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
        data: _.map(payments, (item) => _.pick(item, ['amount', 'status', 'createdAt'])),
        message: "user's payments data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/projects", auth, access, asyncMiddleware(async (req, res) => {
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
        data: _.map(projects, (item) => _.pick(item, ['goal', 'category', 'investedAmount', 'investorCount', 'hasDonate', 'hasToken', 'status', 'expirationDate', 'createdAt'])),
        message: "user's projects data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/investments", auth, access, asyncMiddleware(async (req, res) => {
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
        data: _.map(investments, (item) => _.pick(item, ['tokenId', 'count'])),
        message: "user's investment data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/verify", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateUserVerificationData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    if (user.idCardPic == null)
        return res.status(400).json({ status: "missing_data", message: "ID card picture must be uploaded before calling this API!" });
    if (user.profilePic == null)
        return res.status(400).json({ status: "missing_data", message: "Profile picture must be uploaded before calling this API!" });

    // Updating and completing user data
    try {
        await User.update(
            {
                fullName: req.body.fullName,
                nationalCode: req.body.nationalCode,
                email: req.body.email,
                verified: true,
                birthDate: req.body.birthDate,
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

router.post("/upload-id-card-pic", auth, access, multer({ dest: "resources/id_card_pic" }).single("image"), asyncMiddleware(async (req, res) => {
    if (!req.file) {
        return res.state(400).json({
            message: "No file uploaded!",
            status: "fail"
        })
    }

    // Finding the user according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    // Deleting the previous image
    if (user.idCardPic != null)
        fs.unlinkSync(path.join(path.resolve(__dirname, ".."), "resources/id_card_pic", user.idCardPic));

    // Fixing the image extension
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const uniqueFilename = `${req.file.filename}${fileExtension}`;
    const newPath = path.join(path.resolve(__dirname, ".."), 'resources/id_card_pic', uniqueFilename);
    const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
    fs.renameSync(oldPath, newPath);

    // Updating idCardPic address
    try {
        await User.update(
            {
                idCardPic: uniqueFilename
            },
            {
                where: { id: user.id }
            }
        );
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    res.status(200).json({
        message: "id card image uploaded successfully!",
        status: "ok"
    });
}));

router.post("/upload-profile-pic", auth, access, multer({ dest: "resources/profile_pic" }).single("image"), asyncMiddleware(async (req, res) => {
    if (!req.file) {
        return res.state(400).json({
            message: "No file uploaded!",
            status: "fail"
        })
    }

    // Finding the user according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    // Deleting the previous image
    if (user.profilePic != null)
        fs.unlinkSync(path.join(path.resolve(__dirname, ".."), "resources/profile_pic", user.profilePic));

    // Fixing the image extension
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const uniqueFilename = `${req.file.filename}${fileExtension}`;
    const newPath = path.join(path.resolve(__dirname, ".."), 'resources/profile_pic', uniqueFilename);
    const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
    fs.renameSync(oldPath, newPath);

    // Updating idCardPic address
    try {
        await User.update(
            {
                profilePic: uniqueFilename
            },
            {
                where: { id: user.id }
            }
        );
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    res.status(200).json({
        message: "profile image image uploaded successfully!",
        status: "ok"
    });
}));

router.get("/id-card-pic", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the user according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    if (user.idCardPic == null)
        return res.status(200).send("There is no ID card picture for this user!");

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/id_card_pic", user.idCardPic));
}));

router.get("/profile-pic", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the user according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    if (user.profilePic == null)
        return res.status(200).send("There is no profile picture for this user!");

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/profile_pic", user.profilePic));
}));

module.exports = router;
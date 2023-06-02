const { User, Wallet, Payment, Project, Invest, Donate, Token, ProjectDescription, Comment, Reply, Like } = require("../models");
const { donateToProject, buyProjectToken } = require("../utils");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateUserVerificationData, validateIdData, validateDonateData, validateInvestData, validateCommentData } = require("../validators/user");
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
        data: _.pick(user, ["phoneNumber", "fullName", "nationalCode", "birthDate", "email", "state", "city", "address", "bio", "role", "verified"]),
        message: "User data retrieved successfully!",
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
        message: "User's wallet data retrieved successfully!",
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
        message: "User's payments data retrieved successfully!",
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
        include: [ProjectDescription],
        where: {
            userId: user.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(projects, (item) => {
            return {
                id: item['id'],
                goal: item['goal'],
                category: item['category'],
                investedAmount: item['investedAmount'],
                investorCount: item['investorCount'],
                hasDonate: item['hasDonate'],
                hasToken: item['hasToken'],
                status: item['status'],
                expirationDate: item['expirationDate'],
                createdAt: item['createdAt'],
                title: item['ProjectDescription.title']
            }
        }),
        message: "User's projects data retrieved successfully!",
        status: "ok"
    });
}));

router.get("/invests", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the investments according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const invests = await Invest.findAll({
        include: [{ model: Token, include: [{ model: Project, include: [ProjectDescription] }] }],
        where: {
            userId: user.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(invests, (item) => {
            return {
                projectTitle: item['Token.Project.ProjectDescription.title'],
                projectId: item['Token.Project.id'],
                tokenId: item['Token.id'],
                price: item['Token.price'],
                count: item['count']
            }
        }),
        message: "User's investment data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/invest", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateInvestData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const result = await buyProjectToken(req.body.id, req.user.uuid, req.body.count);
    if (result.status != "ok")
        return res.status(400).json(result);

    res.status(200).json(result);
}));

router.get("/donates", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the donates according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const donates = await Donate.findAll({
        include: [{ model: Project, include: [ProjectDescription] }],
        where: {
            userId: user.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(donates, (item) => {
            return {
                projectTitle: item['Project.ProjectDescription.title'],
                projectId: item['projectId'],
                amount: item['amount'],
            }
        }),
        message: "User's donates data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/donate", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateDonateData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const result = await donateToProject(req.body.id, req.user.uuid, req.body.amount);
    if (result.status != "ok")
        return res.status(400).json(result);

    res.status(200).json(result);
}));

router.get("/comments", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the comments according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const comments = await Comment.findAll({
        include: [{ model: Project, include: [ProjectDescription] }],
        where: {
            userId: user.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(comments, (item) => {
            return {
                projectTitle: item['Project.ProjectDescription.title'],
                projectId: item['projectId'],
                message: item['message'],
                id: item['id']
            }
        }),
        message: "User's comments data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/comment", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateCommentData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    try {
        await Comment.create({
            userId: user.id,
            projectId: req.body.id,
            message: req.body.message
        });
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    res.status(200).json({
        message: "Comment created successfully!",
        status: "ok"
    });
}));

router.get("/replies", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the replies according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const replies = await Reply.findAll({
        include: [{ model: Comment, include: [{ model: Project, include: [ProjectDescription] }] }],
        where: {
            userId: user.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(replies, (item) => {
            return {
                projectTitle: item['Comment.Project.ProjectDescription.title'],
                projectId: item['Comment.projectId'],
                replyMessage: item['message'],
                commentMessage: item['Comment.message'],
                commentId: item['Comment.id'],
                commentUserId: item['Comment.userId'],
                id: item['id']
            }
        }),
        message: "User's replies data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/reply", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateCommentData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    try {
        await Reply.create({
            userId: user.id,
            commentId: req.body.id,
            message: req.body.message
        });
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    res.status(200).json({
        message: "Reply created successfully!",
        status: "ok"
    });
}));

router.get("/liked-projects", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the liked projects according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const likedProjects = await Like.findAll({
        include: [{ model: Project, include: [ProjectDescription] }],
        where: {
            userId: user.id,
            liked: true
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(likedProjects, (item) => {
            return {
                projectTitle: item['Project.ProjectDescription.title'],
                projectId: item['projectId'],
                createdAt: item['createdAt'],
                id: item['id']
            }
        }),
        message: "User's liked projects data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/like", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    try {
        const like = await Like.findOne({
            where: {
                userId: user.id,
                projectId: req.body.id
            }
        });

        if (like == null) {
            await Like.create({
                userId: user.id,
                projectId: req.body.id,
                liked: true
            });
            res.status(200).json({
                message: "Project liked successfully!",
                status: "ok_liked"
            });
        } else {
            if (like.liked) {
                await Like.destroy({
                    where: {
                        id: like.id
                    }
                });
                res.status(200).json({
                    message: "Like deleted from project successfully!",
                    status: "ok_neutral"
                });
            } else {
                await Like.update(
                    {
                        liked: true
                    },
                    {
                        where: {
                            id: like.id
                        }
                    }
                );
                res.status(200).json({
                    message: "Project liked successfully!",
                    status: "ok_liked"
                });
            }
        }
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }
}));

router.get("/disliked-projects", auth, access, asyncMiddleware(async (req, res) => {
    // Finding the disliked projects according to uuid stored in jwt
    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });
    const dislikedProjects = await Like.findAll({
        include: [{ model: Project, include: [ProjectDescription] }],
        where: {
            userId: user.id,
            liked: false
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(dislikedProjects, (item) => {
            return {
                projectTitle: item['Project.ProjectDescription.title'],
                projectId: item['projectId'],
                createdAt: item['createdAt'],
                id: item['id']
            }
        }),
        message: "User's disliked projects data retrieved successfully!",
        status: "ok"
    });
}));

router.post("/dislike", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    try {
        const like = await Like.findOne({
            where: {
                userId: user.id,
                projectId: req.body.id
            }
        });

        if (like == null) {
            await Like.create({
                userId: user.id,
                projectId: req.body.id,
                liked: false
            });
            res.status(200).json({
                message: "Project disliked successfully!",
                status: "ok_disliked"
            });
        } else {
            if (!like.liked) {
                await Like.destroy({
                    where: {
                        id: like.id
                    }
                });
                res.status(200).json({
                    message: "Dislike deleted from project successfully!",
                    status: "ok_neutral"
                });
            } else {
                await Like.update(
                    {
                        liked: false
                    },
                    {
                        where: {
                            id: like.id
                        }
                    }
                );
                res.status(200).json({
                    message: "Project disliked successfully!",
                    status: "ok_disliked"
                });
            }
        }
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }
}));

router.post("/edit", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateUserVerificationData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    // Updating and completing user data
    try {
        await User.update(
            {
                fullName: req.body.fullName,
                nationalCode: req.body.nationalCode,
                email: req.body.email,
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
        message: "User data updated successfully!",
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
        return res.status(400).json({ status: "missing_id_card_pic", message: "ID card picture must be uploaded before calling this API!" });
    if (user.profilePic == null)
        return res.status(400).json({ status: "missing_profile_pic", message: "Profile picture must be uploaded before calling this API!" });

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
            status: "upload_fail"
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
        message: "ID card picture uploaded successfully!",
        status: "ok"
    });
}));

router.post("/upload-profile-pic", auth, access, multer({ dest: "resources/profile_pic" }).single("image"), asyncMiddleware(async (req, res) => {
    if (!req.file) {
        return res.state(400).json({
            message: "No file uploaded!",
            status: "upload_fail"
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
        message: "Profile picture uploaded successfully!",
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
        return res.status(400).json({ status: "missing_id_card_pic", message: "There is no ID card picture for this user!" });

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
        return res.status(200).json({ status: "missing_profile_pic", message: "There is no profile picture for this user!" });

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/profile_pic", user.profilePic));
}));

module.exports = router;
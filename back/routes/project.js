const { User, Wallet, Project, Invest, Donate, Comment, Reply, Payment, Like, ProjectDescription, BannedUser, Token } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateProjectSearchData, validateIdData } = require("../validators/project");
const { Op } = require('sequelize');
const path = require("path");
const express = require("express");
const router = express.Router();


router.get("/", auth, access, asyncMiddleware(async (req, res) => {
    const projects = await Project.findOne({
        where: {
            status: ["active", "pending_payment", "pending_delivery"]
        }
    });

    res.status(200).json({
        data: projects,
        message: "Project list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateProjectSearchData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    await sleep(1000);

    let projects;
    if (req.body.status !== undefined) {
        projects = await Project.findAll({
            include: [
                {
                    model: ProjectDescription,
                    where: {
                        ...(req.body.title && { title: { [Op.like]: `%${req.body.title}%` } }),
                        ...(req.body.subtitle && { subtitle: { [Op.like]: `%${req.body.subtitle}%` } })
                    }
                }
            ],
            where: {
                ...(req.body.goal && { goal: { [Op.like]: `%${req.body.goal}%` } }),
                ...(req.body.category && { category: { [Op.like]: `%${req.body.category}%` } }),
                ...(req.body.investedAmount && { investedAmount: { [Op.like]: `%${req.body.investedAmount}%` } }),
                ...(req.body.investorCount && { investorCount: { [Op.like]: `%${req.body.investorCount}%` } }),
                ...(req.body.status && { status: req.body.status }),
                ...(req.body.hasDonate !== undefined && { hasDonate: req.body.hasDonate }),
                ...(req.body.hasToken !== undefined && { hasToken: req.body.hasToken })
            },
            raw: true
        });
    } else {
        projects = await Project.findAll({
            include: [
                {
                    model: ProjectDescription,
                    where: {
                        ...(req.body.title && { title: { [Op.like]: `%${req.body.title}%` } }),
                        ...(req.body.subtitle && { subtitle: { [Op.like]: `%${req.body.subtitle}%` } })
                    }
                }
            ],
            where: {
                ...(req.body.goal && { goal: { [Op.like]: `%${req.body.goal}%` } }),
                ...(req.body.category && { category: { [Op.like]: `%${req.body.category}%` } }),
                ...(req.body.investedAmount && { investedAmount: { [Op.like]: `%${req.body.investedAmount}%` } }),
                ...(req.body.investorCount && { investorCount: { [Op.like]: `%${req.body.investorCount}%` } }),
                ...(req.body.status && { status: req.body.status }),
                ...(req.body.hasDonate !== undefined && { hasDonate: req.body.hasDonate }),
                ...(req.body.hasToken !== undefined && { hasToken: req.body.hasToken }),
                status: ['active', 'pending_payment', 'pending_delivery']
            },
            raw: true
        });
    }
    

    res.status(200).json({
        data: _.map(projects, (item) => {
            return {
                id: item['id'],
                userId: item['userId'],
                goal: item['goal'],
                category: item['category'],
                investedAmount: item['investedAmount'],
                investorCount: item['investorCount'],
                hasDonate: item['hasDonate'],
                hasToken: item['hasToken'],
                status: item['status'],
                expirationDate: item['expirationDate'],
                createdAt: item['createdAt'],
                title: item['ProjectDescription.title'],
                subtitle: item['ProjectDescription.subtitle']
            }
        }),
        message: "Project list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/info", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    await sleep(1000);
    
    const project = await Project.findOne({
        include: [ProjectDescription],
        where: {
            id: req.body.id
        },
        raw: true
    });
    if (project == null) return res.status(400).json({ status: "project_not_found", message: "Project not found!" });

    res.status(200).json({
        data: {
            id: project['id'],
            userId: project['userId'],
            goal: project['goal'],
            category: project['category'],
            investedAmount: project['investedAmount'],
            investorCount: project['investorCount'],
            hasDonate: project['hasDonate'],
            hasToken: project['hasToken'],
            status: project['status'],
            expirationDate: project['expirationDate'],
            title: project['ProjectDescription.title'],
            subtitle: project['ProjectDescription.subtitle']
        }
        ,
        message: "Project info retrieved successfully!",
        status: "ok"
    });
}));

router.post("/tokens", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    await sleep(1000);
    
    const tokens = await Token.findAll({
        where: {
            projectId: req.body.id
        }
    });

    let boughtCounts = [];
    for (let i = 0; i < tokens.length; i++) {
        const tokenInvests = await Invest.findAll({
            where: {
                tokenId: tokens[i].id
            },
            raw: true
        });
        const boughtCount = _.sumBy(tokenInvests, 'count');
        boughtCounts[i] = boughtCount;
    }
    
    res.status(200).json({
        data: tokens.map((item, index) => {
            return {
                boughtCount: boughtCounts[index],
                projectId: item.projectId,
                price: item.price,
                limit: item.limit,
                description: item.description,
                createdAt: item.createdAt,
                id: item.id
            }
        }),
        message: "Project tokens retrieved successfully!",
        status: "ok"
    });
}));

router.post("/comment", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const comments = await Comment.findAll({
        include: [User],
        where: {
            projectId: req.body.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(comments, (item) => {
            return {
                userId: item['userId'],
                message: item['message'],
                projectId: item['projectId'],
                createdAt: item['createdAt'],
                fullName: item['User.fullName']
            }
        }),
        message: "Project comments retrieved successfully!",
        status: "ok"
    });
}));

router.post("/reply", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const replies = await Reply.findAll({
        include: [User],
        where: {
            commentId: req.body.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(replies, (item) => {
            return {
                userId: item['userId'],
                message: item['message'],
                commentId: item['commentId'],
                createdAt: item['createdAt'],
                fullName: item['User.fullName']
            }
        }),
        message: "Comment replies retrieved successfully!",
        status: "ok"
    });
}));

router.post("/like", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const likes = await Like.findAll({
        include: [User],
        where: {
            liked: true,
            projectId: req.body.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(likes, (item) => {
            return {
                userId: item['userId'],
                projectId: item['projectId'],
                createdAt: item['createdAt'],
                fullName: item['User.fullName']
            }
        }),
        message: "Project likes retrieved successfully!",
        status: "ok"
    });
}));

router.post("/dislike", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const dislikes = await Like.findAll({
        include: [User],
        where: {
            liked: false,
            projectId: req.body.id
        },
        raw: true
    });

    res.status(200).json({
        data: _.map(dislikes, (item) => {
            return {
                userId: item['userId'],
                projectId: item['projectId'],
                createdAt: item['createdAt'],
                fullName: item['User.fullName']
            }
        }),
        message: "Project dislikes retrieved successfully!",
        status: "ok"
    });
}));

async function sleep(miliseconds) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

router.post("/main-pic", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });
    
    await sleep(1000);
    
    const project = await Project.findOne({
        include: [ProjectDescription],
        where: {
            id: req.body.id
        },
        raw: true
    });
    if (project == null) return res.status(400).send("Project not found!");
    if (project['ProjectDescription.mainPic'] == null) return res.status(400).json("There is no main picture for this project!");

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/main_pic", project['ProjectDescription.mainPic']));
}));

router.post("/presentation", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const project = await Project.findOne({
        where: {
            id: req.body.id
        }
    });
    if (project == null) return res.status(400).send("Project not found!");
    if (project.mainPic == null) return res.status(400).json("There is no presentation file for this project!");

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/presentation", project.presentation));
}));


module.exports = router;
const { User, Wallet, Project, Invest, Donate, Comment, Reply, Payment, Like, ProjectDescription, BannedUser } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateIdData, validateProjectSearchData, validateUserSearchData } = require("../validators/admin");
const { refundProject, fundProject } = require("../utils");
const { Op } = require('sequelize');
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
        message: "User list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/user", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateUserSearchData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const users = await User.findAll({
        where: {
            ...(req.body.phoneNumber && { phoneNumber: { [Op.like]: `%${req.body.phoneNumber}%` } }),
            ...(req.body.fullName && { fullName: { [Op.like]: `%${req.body.fullName}%` } }),
            ...(req.body.email && { email: { [Op.like]: `%${req.body.email}%` } }),
            ...(req.body.nationalCode && { nationalCode: { [Op.like]: `%${req.body.nationalCode}%` } }),
            ...(req.body.state && { state: { [Op.like]: `%${req.body.state}%` } }),
            ...(req.body.city && { city: { [Op.like]: `%${req.body.city}%` } }),
            ...(req.body.address && { address: { [Op.like]: `%${req.body.address}%` } }),
            ...(req.body.verified !== undefined && { verified: req.body.verified }),
            role: "user"
        },
    });

    res.status(200).json({
        data: users,
        message: "user list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/user/delete", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    });
    if (user == null) return res.status(400).json({ status: "not_found", message: "User not found!" });

    await Donate.destroy({
        where: { userId: req.body.id }
    });
    await Invest.destroy({
        where: { userId: req.body.id }
    });

    const comments = await Comment.findAll({
        where: { userId: req.body.id }
    });
    await Reply.destroy({
        where: { commentId: comments.map(c => c.id) }
    });
    await Comment.destroy({
        where: { userId: req.body.id }
    });
    await Like.destroy({
        where: { userId: req.body.id }
    });

    const wallet = await Wallet.findOne({
        where: { userId: req.body.id }
    });
    await Payment.destroy({
        where: { walletId: wallet.id }
    });
    await Wallet.destroy({
        where: { userId: req.body.id }
    });

    const projects = await Project.findAll({
        where: { userId: req.body.id }
    });

    for (let i = 0; i < projects.length; i++) {
        if (projects[i].status == "active" || projects[i].status == "pending_payment")
            await refundProject(projects[i].id)
        await ProjectDescription.destroy({
            where: { projectId: projects[i].id }
        });
        await Token.destroy({
            where: { projectId: projects[i].id }
        });
    }

    await User.destroy({
        where: { id: req.body.id }
    });

    res.status(200).json({
        message: "user has been deleted successfully!",
        status: "ok"
    });
}));

router.post("/user/ban", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    });
    if (user == null) return res.status(400).json({ status: "not_found", message: "User not found!" });

    await BannedUser.create({
        userId: req.body.id
    });

    res.status(200).json({
        message: "user has been banned successfully!",
        status: "ok"
    });
}));

router.post("/user/unban", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    });
    if (user == null) return res.status(400).json({ status: "not_found", message: "User not found!" });

    await BannedUser.destroy({
        where: { userId: req.body.id }
    });

    res.status(200).json({
        message: "user has been unbanned successfully!",
        status: "ok"
    });
}));

router.get("/project", auth, access, asyncMiddleware(async (req, res) => {
    const projects = await Project.findAll({ include: [ProjectDescription], raw: true });

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
                title: item['ProjectDescription.title'],
                subtitle: item['ProjectDescription.subtitle']
            }
        }),
        message: "Project list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/project", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateProjectSearchData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const projects = await Project.findAll({
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
            ...(req.body.userId && { userId: { [Op.like]: `%${req.body.userId}%` } }),
            ...(req.body.goal && { goal: { [Op.like]: `%${req.body.goal}%` } }),
            ...(req.body.category && { category: { [Op.like]: `%${req.body.category}%` } }),
            ...(req.body.investedAmount && { investedAmount: { [Op.like]: `%${req.body.investedAmount}%` } }),
            ...(req.body.investorCount && { investorCount: { [Op.like]: `%${req.body.investorCount}%` } }),
            ...(req.body.hasDonate !== undefined && { hasDonate: req.body.hasDonate }),
            ...(req.body.hasToken !== undefined && { hasToken: req.body.hasToken }),
            ...(req.body.status && { status: req.body.status })
        },
        raw: true
    });

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
                title: item['ProjectDescription.title'],
                subtitle: item['ProjectDescription.subtitle']
            }
        }),
        message: "Project list retrieved successfully!",
        status: "ok"
    });
}));

router.post("/project/approve", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const project = await Project.findOne({
        where: {
            id: req.body.id
        }
    });
    if (project == null)
        return res.status(400).json({ status: "not_found", message: "Project not found!" });
    if (project.status != "pending_approval")
        return res.status(400).json({ status: "approve_fail", message: "Project can not be approved!" });

    await Project.update(
        {
            status: "active"
        },
        {
            where: { id: project.id }
        }
    )

    res.status(200).json({
        message: "Project approved successfully!",
        status: "ok"
    });
}));

router.post("/project/delete", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const project = await Project.findOne({
        where: {
            id: req.body.id
        }
    });
    if (project == null)
        return res.status(400).json({ status: "not_found", message: "Project not found!" });

    if (project.status == "active" || project.status == "pending_payment")
        await refundProject(project.id)
    await ProjectDescription.destroy({
        where: { projectId: project.id }
    });
    await Token.destroy({
        where: { projectId: project.id }
    });

    res.status(200).json({
        message: "Project deleted successfully!",
        status: "ok"
    });
}));

router.post("/project/fund", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const project = await Project.findOne({
        where: {
            id: req.body.id
        }
    });
    if (project == null)
        return res.status(400).json({ status: "not_found", message: "Project not found!" });
    if (project.status != "pending_payment")
        return res.status(400).json({ status: "fund_fail", message: "Project can not be funded!" });

    await fundProject(project.id);
    await Project.update(
        {
            status: "pending_delivery"
        },
        {
            where: { id: project.id }
        }
    )

    res.status(200).json({
        message: "Project funded successfully!",
        status: "ok"
    });
}));

router.post("/project/close", auth, access, asyncMiddleware(async (req, res) => {
    const { error } = validateIdData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const project = await Project.findOne({
        where: {
            id: req.body.id
        }
    });
    if (project == null)
        return res.status(400).json({ status: "not_found", message: "Project not found!" });
    if (project.status != "pending_delivery")
        return res.status(400).json({ status: "delivery_fail", message: "Project can not be delivered!" });

    await Project.update(
        {
            status: "done"
        },
        {
            where: { id: project.id }
        }
    )

    res.status(200).json({
        message: "Project delivered successfully!",
        status: "ok"
    });
}));

module.exports = router;
const { User, Wallet, Project, Invest, Donate, Comment, Reply, Payment, Like, ProjectDescription, BannedUser } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateIdData, validateProjectStatusData } = require("../validators/admin");
const { refundProject, fundProject } = require("../utils");
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
        message: "user list retrieved successfully!",
        status: "ok"
    });
}));

router.get("/user/delete", auth, access, asyncMiddleware(async (req, res) => {
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
            refundProject(projects[i].id)
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

router.get("/user/ban", auth, access, asyncMiddleware(async (req, res) => {
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

router.get("/user/unban", auth, access, asyncMiddleware(async (req, res) => {
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
    const { error } = validateProjectStatusData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const projects = await Project.findAll({
        where: {
            status: req.body.status
        }
    });

    res.status(200).json({
        data: projects,
        message: "Project list retrieved successfully!",
        status: "ok"
    });
}));

router.get("/project/approve", auth, access, asyncMiddleware(async (req, res) => {
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

router.get("/project/delete", auth, access, asyncMiddleware(async (req, res) => {
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
        refundProject(project.id)
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

router.get("/project/fund", auth, access, asyncMiddleware(async (req, res) => {
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

    fundProject(project.id);
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

router.get("/project/close", auth, access, asyncMiddleware(async (req, res) => {
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
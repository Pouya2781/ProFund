const { User, Wallet, Project, Invest, Donate, Comment, Reply, Payment, Like, ProjectDescription, BannedUser, Token } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateProjectSearchData, validateIdData } = require("../validators/project");
const { Op } = require('sequelize');
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
                title: item['ProjectDescription.title'],
                subtitle: item['ProjectDescription.subtitle']
            }
        }),
        message: "Project list retrieved successfully!",
        status: "ok"
    });
}));

module.exports = router;
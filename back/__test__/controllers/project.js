const { User, Comment, Reply } = require("../../models");
const _ = require("lodash");
const { validateIdData } = require("../../validators/project");

async function comment(req, res) {
    ////////// comment controller
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
}

async function reply(req, res) {
    ////////// comment controller
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
}

module.exports = { comment, reply }
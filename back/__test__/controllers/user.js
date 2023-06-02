const { User, Wallet, Project, Invest, Token } = require("../../models");
const _ = require("lodash");
const { validateInvestData } = require("../../validators/user");

async function buyToken(req, res) {
    const { error } = validateInvestData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    const result = await buyProjectToken(req.body.id, req.user.uuid, req.body.count);
    if (result.status != "ok")
        return res.status(400).json(result);

    res.status(200).json(result);
}

async function buyProjectToken(tokenId, userUuid, count) {
    const user = await User.findOne({
        where: {
            uuid: userUuid
        }
    });
    if (user == null)
        return {
            message: "User not found!",
            status: "user_not_found"
        };

    const token = await Token.findOne({
        where: {
            id: tokenId
        }
    });
    if (token == null)
        return {
            message: "Token not found!",
            status: "token_not_found"
        };

    const project = await Project.findOne({
        where: {
            id: token.projectId
        }
    });
    if (project == null)
        return {
            message: "Project not found!",
            status: "project_not_found"
        };

    if (project.status != "active")
        return {
            message: "Project is not in active status!",
            status: "project_not_active"
        };

    const tokenInvests = await Invest.findAll({
        where: {
            tokenId: token.id
        }
    });
    const boughtCount = _.sumBy(tokenInvests, 'count');
    if (boughtCount + count > token.limit)
        return {
            message: "There is not enough tokens to buy!",
            status: "out_of_stuck"
        };

    const wallet = await Wallet.findOne({
        where: {
            userId: user.id
        }
    });
    if (count * token.price > wallet.balance)
        return {
            message: "Insufficient balance!",
            status: "insufficient_balance"
        };

    const invest = await Invest.findOne({
        where: {
            tokenId: tokenId,
            userId: user.id
        }
    });

    if (invest == null) {
        await Invest.create({
            userId: user.id,
            tokenId: tokenId,
            count: count
        });
    } else {
        await Invest.update(
            {
                count: invest.count + count
            },
            {
                where: {
                    tokenId: tokenId,
                    userId: user.id
                }
            }
        );
    }

    await Project.update(
        {
            investedAmount: project.investedAmount + (count * token.price),
            investorCount: project.investorCount + 1
        },
        {
            where: { id: project.id }
        }
    );
    await Wallet.update(
        {
            balance: wallet.balance - (count * token.price)
        },
        {
            where: { userId: user.id }
        }
    );
    return {
        message: "Token has been bought successfully!",
        status: "ok"
    };
}

module.exports = { buyToken, buyProjectToken }
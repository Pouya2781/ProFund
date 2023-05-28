const { User, Wallet, Project, Invest, Donate, Token } = require("../models");

async function donateToProject(projectId, userUuid, amount) {
    const user = await User.findOne({
        where: {
            uuid: userUuid
        }
    });
    if (user == null) return "User not found!";

    const wallet = await Wallet.findOne({
        where: {
            userId: user.id
        }
    });
    if (amount > wallet.balance) return "Insufficient balance!";

    const project = await Project.findOne({
        where: {
            id: projectId
        }
    });
    if (project == null) return "Project not found!";

    const donate = await Donate.findOne({
        where: {
            projectId: projectId,
            userId: user.id
        }
    });

    if (donate == null) {
        await Donate.create({
            userId: user.id,
            projectId: projectId,
            amount: amount
        });
    } else {
        await Donate.update(
            {
                amount: donate.amount + amount
            },
            {
                where: {
                    projectId: projectId,
                    userId: user.id
                }
            }
        );
    }

    await Project.update(
        {
            investedAmount: project.investedAmount + amount,
            investorCount: project.investorCount + 1
        },
        {
            where: { id: projectId }
        }
    );
    await Wallet.update(
        {
            balance: wallet.balance - amount
        },
        {
            where: { userId: user.id }
        }
    );
    return "Donate completed successfully!";
}

async function buyProjectToken(tokenId, userUuid, count) {
    const user = await User.findOne({
        where: {
            uuid: userUuid
        }
    });
    if (user == null) return "User not found!";

    const token = await Token.findOne({
        where: {
            id: tokenId
        }
    });
    if (token == null) return "Token not found!";

    const project = await Project.findOne({
        where: {
            id: token.projectId
        }
    });
    if (project == null) return "Project not found!";

    const wallet = await Wallet.findOne({
        where: {
            userId: user.id
        }
    });
    if (count * token.price > wallet.balance) return "Insufficient balance!";

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
}

async function fundProject(projectId) {
    const project = await Project.findOne({
        where: {
            id: token.projectId
        }
    });
    if (project == null) return "Project not found!";

    const wallet = await Wallet.findOne({
        where: {
            userId: project.userId
        }
    });

    await Wallet.update(
        {
            balance: wallet.balance + project.investedAmount
        },
        {
            where: { userId: project.userId }
        }
    );
}

async function refundProject(projectId) {
    const investsWithToken = await Token.findAll({
        include: [Invest],
        where: {
            projectId: projectId
        }
    });
    const donates = await Donate.findAll({
        where: {
            projectId: projectId
        }
    });

    await Project.update(
        {
            investedAmount: 0,
            investorCount: 0
        },
        {
            where: { id: project.id }
        }
    );

    // Refunding donates
    for (let i = 0; i < donates.length; i++) {
        await Wallet.update(
            {
                balance: sequelize.literal(`balance + ${donates[i].amount}`)
            },
            {
                userId: donates[i].userId
            }
        );
    }

    // Refunding tokens
    for (let i = 0; i < investsWithToken.length; i++) {
        await Wallet.update(
            {
                balance: sequelize.literal(`balance + ${investsWithToken[i].price * investsWithToken[i].count}`)
            },
            {
                userId: investsWithToken[i].userId
            }
        );
    }

    const tokens = await Token.findAll({
        where: {
            projectId: projectId
        }
    });
    await Invest.destroy({
        where: {
            tokenId: tokens.map(t => t.id)
        }
    });
    await Donate.destroy({
        where: {
            projectId: projectId
        }
    });
}

module.exports = {
    donateToProject: donateToProject,
    buyProjectToken: buyProjectToken,
    fundProject: fundProject,
    refundProject: refundProject
}
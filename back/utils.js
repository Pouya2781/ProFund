const { User, Wallet, Project, Invest, Donate, Token } = require("./models");
const _ = require("lodash");

async function donateToProject(projectId, userUuid, amount) {
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

    const wallet = await Wallet.findOne({
        where: {
            userId: user.id
        }
    });
    if (amount > wallet.balance)
        return {
            message: "Insufficient balance!",
            status: "insufficient_balance"
        };

    const project = await Project.findOne({
        where: {
            id: projectId
        }
    });
    if (project == null)
        return {
            message: "Project not found!",
            status: "project_not_found"
        };

    if (!project.hasDonate)
        return {
            message: "Project does't have donate!",
            status: "donate_disable"
        };

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
    return {
        message: "Donate completed successfully!",
        status: "ok"
    };
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

async function fundProject(projectId) {
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
    return {
        message: "Project funded successfully!",
        status: "ok"
    };
}

async function refundProject(projectId) {
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

    const tokenWithInvests = await Token.findAll({
        include: [Invest],
        where: {
            projectId: projectId
        },
        raw: true
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
    for (let i = 0; i < tokenWithInvests.length; i++) {
        await Wallet.update(
            {
                balance: sequelize.literal(`balance + ${tokenWithInvests[i].price * tokenWithInvests[i]['Invest.count']}`)
            },
            {
                userId: tokenWithInvests[i]['Invest.userId']
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
    return {
        message: "Project refunded successfully!",
        status: "ok"
    };
}

module.exports = {
    donateToProject: donateToProject,
    buyProjectToken: buyProjectToken,
    fundProject: fundProject,
    refundProject: refundProject
}
const { buyToken, buyProjectToken } = require("./controllers/user");
const { User, Wallet, Project, Invest, Token } = require("../models");
const { validateInvestData } = require("../validators/user");

const req = {
    body: {
        id: 1,
        count: 5,
    },
    user: {
        uuid: "user-uuid",
    },
};

const mockedUser = {
    id: 1
};

const mockedToken = {
    id: 1,
    projectId: 2,
    limit: 10,
    price: 50,
};

const mockedProject = {
    id: 2,
    status: "active",
    investedAmount: 100,
    investorCount: 2,
};

const mockedInvests = [
    {
        userId: 1,
        tokenId: 1,
        count: 3
    },
    {
        userId: 2,
        tokenId: 1,
        count: 2
    },
];

const mockedInvest = {
    userId: 1,
    tokenId: 1,
    count: 3
};

const mockedWallet = {
    userId: 1,
    balance: 300
};

jest.mock("../validators/user", () => (
    {
        validateInvestData: jest.fn(() => ({ error: undefined }))
    }
));
User.findOne = jest.fn((x) => null);
Token.findOne = jest.fn((x) => mockedToken);
Project.findOne = jest.fn((x) => mockedProject);
Invest.findAll = jest.fn((x) => mockedInvests);
Wallet.findOne = jest.fn((x) => mockedWallet);
Invest.findOne = jest.fn((x) => mockedInvest);
Invest.create = jest.fn((x) => null);
Invest.update = jest.fn((x) => null);
Project.update = jest.fn((x) => null);
Wallet.update = jest.fn((x) => null);

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

it("should handle user not found", async () => {
    await buyToken(req, res);

    expect(validateInvestData).toHaveBeenCalledWith(req.body);
    expect(User.findOne).toHaveBeenCalledWith({
        where: { uuid: req.user.uuid },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "User not found!",
        status: "user_not_found",
    });
});
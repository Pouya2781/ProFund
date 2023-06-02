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
        validateInvestData: jest.fn(() => ({ error: { details: [{ message: "id is required" }] } }))
    }
));
User.findOne = jest.fn((x) => mockedUser);
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

it("should handle validation error", async () => {
    await buyToken(req, res);

    expect(validateInvestData).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "validation_fail",
        message: "id is required",
    });
});
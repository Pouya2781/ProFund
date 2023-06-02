const jwt = require("jsonwebtoken");
const { authenticateAndAccess } = require("./controllers/middleware");
const { User, BannedUser } = require("../models");

const mockedToken = "mocked-token";
const mockedDecoded = { uuid: "mocked-uuid", role: "user" };

const apiAccess = { user: ["/api/route"] };
const jwtPrivateKey = "privateKey"

const mockAuthToken = "mocked-token";

User.findOne = jest.fn((x) => ({ id: 1 }))
BannedUser.findOne = jest.fn((x) => x)
jwt.verify = jest.fn((x) => ({
    uuid: "mocked-uuid",
    role: "user"
}));

const req = {
    header: jest.fn((x) => mockAuthToken),
    originalUrl: "/api/route"
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    set: jest.fn()
};

it("should handle banned user", async () => {
    await authenticateAndAccess(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
        status: "banned_user",
        message: "Access denied. You are banned!",
    });
});
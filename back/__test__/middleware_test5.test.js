const jwt = require("jsonwebtoken");
const { authenticateAndAccess } = require("./controllers/middleware");
const { User, BannedUser } = require("../models");

const mockedToken = "mocked-token";
const mockedDecoded = { uuid: "mocked-uuid", role: "user" };

const apiAccess = { user: ["/api/route"] };
const jwtPrivateKey = "privateKey"

const mockAuthToken = "mocked-token";

User.findOne = jest.fn((x) => ({ id: 1 }))
BannedUser.findOne = jest.fn((x) => null)
jwt.verify = jest.fn((x) => ({
    uuid: "mocked-uuid",
    role: "user"
}));

const req = {
    header: jest.fn((x) => mockAuthToken),
    originalUrl: "/api/fake"
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    set: jest.fn()
};

it("should handle access denied", async () => {
    await authenticateAndAccess(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
        status: "access_denied",
        message: "Access denied. You don't have access to use this API!",
    });
});

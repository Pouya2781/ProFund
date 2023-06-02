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
    originalUrl: "/api/route"
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    set: jest.fn()
};

it("should authenticate user and allow access", async () => {
    await authenticateAndAccess(req, res);

    expect(jwt.verify).toHaveBeenCalledWith(mockAuthToken, jwtPrivateKey);
    expect(User.findOne).toHaveBeenCalledWith({ where: { uuid: mockedDecoded.uuid } });
    expect(BannedUser.findOne).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        status: "ok",
        message: "User authenticated and has access to API!",
    });
    expect(req.user).toEqual(mockedDecoded);
});

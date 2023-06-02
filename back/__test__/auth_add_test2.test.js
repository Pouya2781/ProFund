const { register } = require("./controllers/auth");
const { User, Wallet } = require("../models");
const jwt = require("jsonwebtoken");

jest.mock("../validators/auth", () => (
    {
        validateUserData: jest.fn(() => ({error: undefined}))
    }
));
const jwtPrivateKey = "privateKey";

const req = {
    header: jest.fn((x) => undefined),
    body: {
        phoneNumber: "123456789",
        fullName: "John Doe",
        nationalCode: "ABC123",
        email: "john.doe@example.com",
        birthDate: "1990-01-01",
    },
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

it("should return error if verification token is missing", async () => {
    await register(req, res);

    expect(req.header).toHaveBeenCalledWith("x-ver-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
        status: "missing_token",
        message: "Access denied. ver token required!",
    });
});
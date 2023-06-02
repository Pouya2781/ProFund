const { register } = require("./controllers/auth");
const { User, Wallet } = require("../models");
const jwt = require("jsonwebtoken");

jest.mock("../validators/auth", () => (
    {
        validateUserData: jest.fn(() => ({ error: undefined }))
    }
));
const jwtPrivateKey = "privateKey";

const mockVerToken = "mocked-invalid-token";

const req = {
    header: jest.fn((x) => mockVerToken),
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

jwt.verify = jest.fn((x) => { throw Error() });

it("should return error if verification token is invalid", async () => {
    await register(req, res);

    expect(req.header).toHaveBeenCalledWith("x-ver-token");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "invalid_token",
        message: "Invalid token!",
    });
    expect(jwt.verify).toHaveBeenCalledWith(mockVerToken, jwtPrivateKey);
});
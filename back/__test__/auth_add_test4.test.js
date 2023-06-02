const { register } = require("./controllers/auth");
const { User, Wallet } = require("../models");
const jwt = require("jsonwebtoken");

jest.mock("../validators/auth", () => (
    {
        validateUserData: jest.fn(() => ({ error: { details: [{ message: "phoneNumber is required" }] } }))
    }
));
const jwtPrivateKey = "privateKey";

const mockVerToken = "mocked-token";

jwt.verify = jest.fn((x) => ({
    phoneNumber: "09991234567"
}));

const req = {
    header: jest.fn((x) => mockVerToken),
    body: {
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

it("should return error if user data validation fails", async () => {
    await register(req, res);

    expect(req.header).toHaveBeenCalledWith("x-ver-token");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "validation_fail",
        message: "phoneNumber is required",
    });
});
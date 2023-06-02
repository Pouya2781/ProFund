const { register } = require("./controllers/auth");
const { User, Wallet } = require("../models");
const jwt = require("jsonwebtoken");

jest.mock("../validators/auth", () => (
    {
        validateUserData: jest.fn(() => ({ error: undefined }))
    }
));
const jwtPrivateKey = "privateKey";

const mockVerToken = "mocked-token";
const mockSignedToken = "mocked-signed-token";

jwt.sign = jest.fn((x) => mockSignedToken)
jwt.verify = jest.fn((x) => ({
    phoneNumber: "09991234568"
}));

const req = {
    header: jest.fn((x) => mockVerToken),
    body: {
        phoneNumber: "09991234567",
        fullName: "John Doe",
        nationalCode: "ABC123",
        email: "john.doe@example.com",
        birthDate: "1990-01-01",
    }
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    set: jest.fn()
};

it("should return error if phone number does not match the verification phone number", async () => {
    await register(req, res);

    expect(req.header).toHaveBeenCalledWith("x-ver-token");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "PhoneNumber_mismatch",
        message:
            "The phone number supplied to API doesn't match the phone number entered during verification!",
    });
});
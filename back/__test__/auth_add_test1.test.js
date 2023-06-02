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
const mockNewUser = {
    id: 1,
    uuid: "mocked-uuid",
    phoneNumber: "09991234567",
    fullName: "John Doe",
    nationalCode: "ABC123",
    email: "john.doe@example.com",
    birthDate: "1990-01-01",
    verified: false,
    role: "user"
};

User.create = jest.fn((x) => ({ ...mockNewUser }))
Wallet.create = jest.fn((x) => x);
jwt.sign = jest.fn((x) => mockSignedToken)
jwt.verify = jest.fn((x) => ({
    phoneNumber: "09991234567"
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

it("should register a new user successfully", async () => {
    await register(req, res);

    expect(req.header).toHaveBeenCalledWith("x-ver-token");
    expect(res.json).toHaveBeenCalledWith({
        data: expect.objectContaining({
            phoneNumber: "09991234567",
            fullName: "John Doe",
            nationalCode: "ABC123",
            birthDate: "1990-01-01",
            email: "john.doe@example.com",
        }),
        message: "New user added!",
        status: "ok",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.set).toHaveBeenCalledWith("x-auth-token", mockSignedToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockVerToken, jwtPrivateKey);
    expect(User.create).toHaveBeenCalledWith({
        phoneNumber: "09991234567",
        fullName: "John Doe",
        nationalCode: "ABC123",
        email: "john.doe@example.com",
        birthDate: "1990-01-01",
        verified: false,
        role: "user",
    });
    expect(Wallet.create).toHaveBeenCalledWith({
        userId: 1,
        balance: 0,
    });
    expect(jwt.sign).toHaveBeenCalledWith(
        { uuid: "mocked-uuid", role: "user" },
        jwtPrivateKey
    );
});
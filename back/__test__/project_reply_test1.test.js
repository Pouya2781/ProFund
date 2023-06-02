const { reply } = require("./controllers/project");
const { Reply, User } = require("../models");
const { validateIdData } = require("../validators/project");

const req = {
    body: {
        id: 1
    }
};

const mockedReplies = [
    {
        userId: 1,
        message: "Reply 1",
        commentId: 1,
        createdAt: "2023-06-01T12:00:00Z",
        'User.fullName': "John Doe"
    },
    {
        userId: 2,
        message: "Reply 2",
        commentId: 1,
        createdAt: "2023-06-02T10:00:00Z",
        'User.fullName': "Jane Smith"
    },
];

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

jest.mock("../validators/project", () => (
    {
        validateIdData: jest.fn(() => ({ error: undefined }))
    }
));

Reply.findAll = jest.fn((x) => mockedReplies);

it("should retrieve project replies successfully", async () => {
    await reply(req, res);

    expect(validateIdData).toHaveBeenCalledWith(req.body);
    expect(Reply.findAll).toHaveBeenCalledWith({
        include: [User],
        where: { commentId: req.body.id },
        raw: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        data: [
            {
                userId: 1,
                message: "Reply 1",
                commentId: 1,
                createdAt: "2023-06-01T12:00:00Z",
                fullName: "John Doe",
            },
            {
                userId: 2,
                message: "Reply 2",
                commentId: 1,
                createdAt: "2023-06-02T10:00:00Z",
                fullName: "Jane Smith",
            },
        ],
        message: "Comment replies retrieved successfully!",
        status: "ok",
    });
});

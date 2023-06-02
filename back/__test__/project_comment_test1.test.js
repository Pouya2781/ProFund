const { comment } = require("./controllers/project");
const { Comment, User } = require("../models");
const { validateIdData } = require("../validators/project");

const req = {
    body: {
        id: 1
    }
};

const mockedComments = [
    {
        userId: 1,
        message: "Comment 1",
        projectId: 1,
        createdAt: "2023-06-01T12:00:00Z",
        'User.fullName': "John Doe"
    },
    {
        userId: 2,
        message: "Comment 2",
        projectId: 1,
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

Comment.findAll = jest.fn((x) => mockedComments);

it("should retrieve project comments successfully", async () => {
    await comment(req, res);

    expect(validateIdData).toHaveBeenCalledWith(req.body);
    expect(Comment.findAll).toHaveBeenCalledWith({
        include: [User],
        where: { projectId: req.body.id },
        raw: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        data: [
            {
                userId: 1,
                message: "Comment 1",
                projectId: 1,
                createdAt: "2023-06-01T12:00:00Z",
                fullName: "John Doe",
            },
            {
                userId: 2,
                message: "Comment 2",
                projectId: 1,
                createdAt: "2023-06-02T10:00:00Z",
                fullName: "Jane Smith",
            },
        ],
        message: "Project comments retrieved successfully!",
        status: "ok",
    });
});

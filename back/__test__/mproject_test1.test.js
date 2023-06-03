const { AddProjectStep1 } = require("./controllers/mproject");
const path = require('path');
const {Project, ProjectDescription, User} = require("../models");
const mockVerToken = "mocked-token";

// mock: ProjectDescription.findOne
jest.mock("../models", () => ({
    ProjectDescription: {
      findOne: jest.fn(),
    },
  }));



// no image is uploaded
it("should return 400 if project image is not provided", async () => {
    const req = {
        header: jest.fn((x) => mockVerToken),
        body: {
            title: "title",
            subtitle: "This is a subtitle. Not a very long one.",
        },
        user: {
            uuid: "mocked-uuid",
        }
        //no image is uploaded
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn()
    };
    await AddProjectStep1(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "missing_image",
        message: "image is required!",
    });
});



// invalid title(less than 3 characters and not starting with a letter)
it("should return 400 if project title and subtitle validation fails", async () => {
    const req = {
        header: jest.fn((x) => mockVerToken),
        body: {
            title: "1", // invalid title
            subtitle: "This is a subtitle. Not a very long one.",
        },
        file: {
            mimetype: "image/jpeg",
            originalname: "image.jpg",
        },
        user: {
            uuid: "mocked-uuid",
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn()
    };
    await AddProjectStep1(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "validation_fail",
        message: "\"title\" length must be at least 3 characters long",
    });
});

// invalid subtitle(less than 20 characters)
it("should return 400 if project title and subtitle validation fails", async () => {
    const req = {
        header: jest.fn((x) => mockVerToken),
        body: {
            title: "title",
            subtitle: "1", // invalid subtitle
        },
        file: {
            mimetype: "image/jpeg",
            originalname: "image.jpg",
        },
        user: {
            uuid: "mocked-uuid",
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn()
    };
    await AddProjectStep1(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "validation_fail",
        message: "\"subtitle\" length must be at least 20 characters long",
    });
});

// invalid image type /jpeg|jpg|png/
it("should return 400 if project image type is invalid", async () => {
    path.extname = jest.fn(() => '.html');
    const req = {
        header: jest.fn((x) => mockVerToken),
        body: {
            title: "title",
            subtitle: "ُThis is a subtitle. Not a very long one.",
        },
        file: {// invalid image type
            mimetype: "text/html", 
            extName: "html",
        },
        user: {
            uuid: "mocked-uuid",
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn()
    };
    await AddProjectStep1(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        status: "invalid_image",
        message: "Invalid image file format! Only JPEG, JPG, and PNG images are allowed.",
    });
});


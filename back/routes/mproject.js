// to-do: save the work in each step
const express = require('express');
const { Project, ProjectDescription, Token, User } = require("../models");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const access = require('../middleware/access');
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const { validateProjectTitleandSubtitle, validatetoken } = require('../validators/mproject');
const winston = require('winston');
const { log } = require('console');
const logFilePath = path.join(__dirname, '../logs', 'addProject.log'); // Specify the desired log file path

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath }) // Set the log file path
  ]
});
const router = express.Router();

// project id and project description id
let new_project_id = 0;
let new_projectdesc_id = 0;
let new_token_id = 0;
const user = 0


// Step 1: Create project (Project title)
router.post("/step1", auth, access, multer({ dest: "resources/mproject_main_pic" }).single("mainPic"), asyncMiddleware(async (req, res) => {
  const { error } = validateProjectTitleandSubtitle(req.title, req.subtitle);
  if (error) {
    logger.error('project title and subtitle validation failed')
    return res.status(400).json({ status: "validation_fail", message: error.details[0].message });
  }
  
  // find the user
  const user = await User.findOne({
    where: {
      uuid: req.user.uuid
    }
  });
 
  // All the fields are required
  if (!req.body.title || !req.body.subtitle || !req.file) {
    logger.error('Error: project title, subtitle and picture are required')
    return res.status(400).json({ status: "missing_fields", message: "Project title, subtitle and picture are required!" });
  }

  // checks if the project's title is unique
  const projectTitleExists = await ProjectDescription.findOne({
    where: {
      title: req.body.title
    }
  });
  if (projectTitleExists != null) {
    logger.error('Error: project title already exists')
    return res.status(400).json({ status: "invalid_title", message: "Project title already exists!" });
  }
  

  // Validate the image file size and type
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(req.file.originalname).toLowerCase());
  const mimeType = fileTypes.test(req.file.mimetype);
  if (!(extName && mimeType)) {
    logger.error('Error: invalid image file format. (step1)' )
    return res.status(400).json({ status: "invalid_image", message: "Invalid image file format! Only JPEG, JPG, and PNG images are allowed." });
  }
  if (req.file.size > 10000000) {
    logger.error('Error: image file size exceeds the maximum limit of 10MB! (step1)')
    return res.status(400).json({ status: "invalid_image", message: "Image file size exceeds the maximum limit of 10MB!" });
  }

  // Generate a unique filename for the uploaded image using the user uuid
  const mainPicFilename = `${req.file.originalname}-${user.uuid}-${req.body.title}${path.extname(req.file.originalname)}`;
  // Store the uploaded image with the new filename
  const mainPic_path = path.join(__dirname, '../', 'resources/mproject_main_pic', mainPicFilename);
  fs.renameSync(req.file.path, mainPic_path);

  // Create the project
  const project = await Project.create({
    goal: null,
    userId: user.id,
    category: null,
    investedAmount:null,
    investorCount:null,
    hasDonate:false,
    hasToken:false,
    status:"creating1",
    expirationDate:null,
  });

  new_project_id = project.id;

  // Create the project subtitle
  const project_description = await ProjectDescription.create({
    projectId: new_project_id,
    title: req.body.title,
    subtitle: req.body.subtitle,
    mainPic: mainPic_path,
    presentation: null,
  });

  new_projectdesc_id = project_description.id;

  // Proceed to the next step or return a response indicating successful completion
  res.status(200).json({
    message: "Step 1 completed successfully!",
    status: "ok",
  });
  logger.info('Step 1 completed successfully!');
}));

// Step 2: Create project description
router.post("/step2", auth, access, multer({ dest: "resources/presentation" }).single("presentation"), asyncMiddleware(async (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    logger.error('Error: no file found')
    return res.status(400).json({ status: "error", message: "No file found." });
  }
   // Validate the image file size and type
   const fileTypes = /html/;
   const extName = fileTypes.test(path.extname(req.file.originalname).toLowerCase());
   const mimeType = fileTypes.test(req.file.mimetype);
   if (!(extName && mimeType)) {
     logger.error('Error: invalid file type. (step2)')
     return res.status(400).json({ status: "invalid_html", message: "Invalid html file! Only .html is allowed." });
   }
   if (req.file.size > 100000000) {
     logger.error('Error: file size exceeds the maximum limit of 100MB! (step2)')
     return res.status(400).json({ status: "invalid_html", message: "Image file size exceeds the maximum limit of 100MB!" });
   }

  // Generate a unique filename for the uploaded image using the user uuid
  const pFileWithoutExtension = path.parse(req.file.originalname).name;
  const presentationFilename = `${pFileWithoutExtension}-${req.user.uuid}-presentation-${path.extname(req.file.originalname)}`;
  // Store the uploaded image with the new filename
  const presentation_path = path.join(__dirname, '../', 'resources/mproject_main_pic', presentationFilename);
  fs.renameSync(req.file.path, presentation_path);
  

  // Update project description and status
  try {
    await ProjectDescription.update({
      presentation: presentation_path,
    }, {
      where: {
        id: new_projectdesc_id
      }
    });
  } catch (ex) {
    // Delete the uploaded file in case of a database error
    fs.unlinkSync(absolutePath);
    return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
  }

  try{
    await Project.update({
      status:"creating2"
    }, {
      where:{
        id: new_project_id
      }
    }
    );
    logger.info('Project status updated successfully!(step5)');
  } catch(ex){
    logger.error('Error: project status update failed(step5)')
    return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
  }

  // Proceed to the next step or return a response indicating successful completion
  res.status(200).json({
    message: "Step 2 completed successfully!",
    status: "ok",
  });
  logger.info('Step 2 completed successfully!');
}));


// Step 3: Create token and Donation module
router.post("/step3", auth, access, asyncMiddleware(async (req, res) => {
  // Validate the token price and description
  const { error } = validatetoken(req.body.tokenName, req.body.tokenDescription, req.body.tokenCost);
  if (error) {
    logger.error('Error: token validation failed')
    return res.status(400).json({ status: "validation_fail", message: error.details[0].message });
  }
  // Validate the donation module name
  //const { error1 } = validateDonation(req.body.???????????????);
  //if (error1) return res.status(400).json({ status: "validation_fail", message: error1.details[0].message });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Donation module


  // Create token
  await Token.create({
    projectId: new_project_id,
    price: req.body.tokenCost,
    limit: null,
    description: req.body.tokenDescription,
  });
  new_token_id = Token.id;
  // update project status
  try{
    await Project.update({
      status:"creating3"
    }, {
      where:{
        id: new_project_id
      }
    }
    );
    logger.info('Project status updated successfully!(step5)');
  } catch (ex) {
    return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
  }

  // Proceed to the next step or return a response indicating successful completion
  res.status(200).json({
    message: "Step 3 completed successfully!",
    status: "ok",
  });
  logger.info('Step 3 completed successfully!');
}));

// Step 4: Display project information and confirm
router.post("/step4", auth, access, asyncMiddleware(async (req, res) => {
  // Retrieve the project information from the database
  const project = await Project.findOne({ where: { id: new_project_id } });

  // Retrieve the project description from the database
  const projectDescription = await ProjectDescription.findOne({ where: { projectId: new_project_id } });

  // Retrieve the token details from the database
  const token = await Token.findOne({ where: { id: new_token_id } });

  // Combine the retrieved information into a single object
  const data = {
    project: project ? project.toJSON() : null,
    projectDescription: projectDescription ? projectDescription.toJSON() : null,
    token: token ? token.toJSON() : null,
  };

    // update project status
    try{
      await Project.update({
        status:"pending approval"
      }, {
        where:{
          id: new_project_id
        }
      }
      );
      logger.info('Project status updated successfully!(step5)');
    } catch (ex) {
      return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

  res.status(200).json({
    data,
    message: "Step 4 completed successfully!",
    status: "ok",
  });
  logger.info('Step 4 completed successfully!');
}));


// Step 5: Finalize project
router.post("/step5", auth, access, asyncMiddleware(async (req, res) => {
  // update project status
  
  

  // Send the confirmation message and the created project in the response
  res.status(200).json({
    data,
    message: "Project added successfully!",
    status: "ok",
  });
  logger.info('Step 5 completed successfully!');
}));

module.exports = router;
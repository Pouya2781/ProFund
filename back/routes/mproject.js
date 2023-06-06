const express = require('express');
const { Project, ProjectDescription, Token, User } = require("../models");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const access = require('../middleware/access');
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const { validatetoken, validateIdData } = require('../validators/mproject');
const winston = require('winston');
const { log } = require('console');
const {AddProjectStep1, AddProjectStep2 } = require('../__test__/controllers/mproject');
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

// Step 1: Create project (Project title)
router.post("/step1", auth, access, multer({ dest: "resources/mproject_main_pic" }).single("mainPic"), asyncMiddleware(AddProjectStep1));

// Step 2: Create project description
router.post("/step2", auth, access, multer({ dest: "resources/presentation" }).single("presentation"), asyncMiddleware(AddProjectStep2));


// add token: Create token and Donation module
router.post("/addtoken", auth, access, asyncMiddleware(async (req, res) => {

  // Validate the token price and description
  const { error } = validatetoken(req.body);
  if (error) {
    logger.error('Error: token validation failed')
    return res.status(400).json({ status: "validation_fail", message: error.details[0].message });
  }
  // Create token
  await Token.create({
    projectId: req.body.id,
    price: req.body.price,
    limit: req.body.limit,
    description: req.body.description,
  });

  res.status(200).json({
    data: {
      id: req.body.id,
      token_id: Token.id,
    },
    message: "token added successfully!",
    status: "ok",
  });
  logger.info('token added successfully!');
}));

// 
router.post("/step3", auth, access, asyncMiddleware(async (req, res) => {
  const {err} = validateIdData(req.body);
  if (err) { 
    logger.error('Error: id validation failed')
    return res.status(400).json({ status: "validation_fail", message: err.details[0].message });
  }

    // update project status
  try{
    await Project.update({
      status:"creating3"
    }, {
      where:{
        id: req.body.id
      }
    }
    );
    logger.info('Project status updated successfully!(step5)');
  } catch (ex) {
    return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
  }

  res.status(200).json({
    data: {
      id: req.body.id,
      token_id: req.body.token_id,
    },
    message: "Step 3 completed successfully!",
    status: "ok",
  });
  logger.info('Step 3 completed successfully!');
}));

// Step 4: adding project confirmation
router.get("/step4", auth, access, asyncMiddleware(async (req, res) => {
  const {error} = validateIdData(req.body);
  if (error) { 
    logger.error('Error: token validation failed')
    return res.status(400).json({ status: "validation_fail", message: error.details[0].message });
  }
  try {
    // Retrieve the project information from the database
    const project = await Project.findOne({ where: { id: req.body.id } });
    if (!project) {
      logger.error(`Project not found for ID: ${req.body.id}`);
      return res.status(404).json({ status: "not_found", message: "Project not found" });
    }
    logger.info(`Retrieved project with ID: ${req.body.id}`);

    // Retrieve the project description from the database
    const projectDescription = await ProjectDescription.findOne({ where: { projectId: req.body.id } });
    if (!projectDescription) {
      logger.error(`Project description not found for project ID: ${req.body.id}`);
      return res.status(404).json({ status: "not_found", message: "Project description not found" });
    }
    logger.info(`Retrieved project description for project ID: ${req.body.id}`);

    // Retrieve the token details from the database
    const token = await Token.findOne({ where: { id: req.body.token_id } });
    if (!token) {
      logger.error(`Token not found for ID: ${req.body.token_id}`);
      return res.status(404).json({ status: "not_found", message: "Token not found" });
    }
    logger.info(`Retrieved token with ID: ${req.body.token_id}`);

    // Combine the retrieved information into a single object
    const data = {
      project: project ? project.toJSON() : null,
      projectDescription: projectDescription ? projectDescription.toJSON() : null,
      token: token ? token.toJSON() : null,
    };

    // Update project status to "pending approval"
    await Project.update({ status: "pending approval" }, { where: { id: req.body.id } });
    logger.info(`Updated project status to 'pending approval' for project ID: ${req.body.id}`);

    res.status(200).json({
      data: {
        ...data
      },
      message: "Step 4 completed successfully!",
      status: "ok",
    });
    logger.info('Step 4 completed successfully!');
  } catch (error) {
    logger.error(`An error occurred in Step 4: ${error.message}`);
    return res.status(500).json({ status: "error", message: "An error occurred during Step 4" });
  }
}));


// Step 5: Finalize project
router.get("/step5", auth, access, asyncMiddleware(async (req, res) => {
  // Send the confirmation message in the response
  res.status(200).json({
    message: "Project added successfully!",
    status: "ok",
  });
  logger.info('Step 5 completed successfully!');
}));

module.exports = router;
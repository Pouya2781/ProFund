const express = require('express');
const { Project, ProjectDescription, User } = require("../../models");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const { validateProjectTitleandSubtitle } = require('../../validators/mproject');
const winston = require('winston');
const logFilePath = path.join(__dirname, '../../logs', 'addProject.log'); 

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath }) // Set the log file path
  ]
});
const router = express.Router();

// Step 1: Create project /////////////////////////////////////////////////////////////////
async function AddProjectStep1(req, res) {
    // Image is required
    if (!req.file) {
        logger.error('image is required')
        return res.status(400).json({ status: "missing_image", message: "image is required!" });
      }
    const { error } = validateProjectTitleandSubtitle(req.body);
    if (error) {
      logger.error('project title and subtitle validation failed')
      return res.status(400).json({ status: "validation_fail", message: error.details[0].message });
    }

    // checks if the project's title is unique
    const projectTitleExists = await ProjectDescription.findOne({
      where: {
        title: req.body.title
      }
    });
    if (projectTitleExists != null) {
      logger.error('project title already exists')
      return res.status(400).json({ status: "invalid_title", message: "Project title already exists!" });
    }
    
  
    // Validate the image file size and type
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(req.file.originalname).toLowerCase());
    const mimeType = fileTypes.test(req.file.mimetype);
    if (!(extName && mimeType)) {
      logger.error('invalid image file format. (step1)' )
      return res.status(400).json({ status: "invalid_image", message: "Invalid image file format! Only JPEG, JPG, and PNG images are allowed." });
    }
    if (req.file.size > 1024 * 1024 * 10) {
      logger.error('image file size exceeds the maximum limit of 10MB! (step1)')
      return res.status(400).json({ status: "invalid_image_size", message: "Image file size exceeds the maximum limit of 10MB!" });
    }
  
    // Generate a unique filename for the uploaded image using the user uuid
    const mainPicFilename = `${req.file.originalname}-${req.user.uuid}-${req.body.title}${path.extname(req.file.originalname)}`;
    // Store the uploaded image with the new filename
    const mainPic_path = path.join(__dirname, '../../', 'resources/mproject_main_pic', mainPicFilename);
    fs.renameSync(req.file.path, mainPic_path);
  

    // find the user
    const user = await User.findOne({
        where: {
          uuid: req.user.uuid
        }
      });

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
    
    // Create the project subtitle
    const project_description = await ProjectDescription.create({
      projectId: project.id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      mainPic: mainPic_path,
      presentation: null,
    });
    
    // Proceed to the next step or return a response indicating successful completion
    res.status(200).json({
      data: {
        id: project.id,
      },
      message: "Step 1 completed successfully!",
      status: "ok",
    });
    logger.info('Step 1 completed successfully!');
  }

// Step 2: Create project description /////////////////////////////////////////////////////////////////
async function AddProjectStep2(req, res) {
    // Check if a file was uploaded
    if (!req.file) {
      logger.error('no file found')
      return res.status(400).json({ status: "error", message: "No file found." });
    }

     // Validate the image file size and type
     const fileTypes = /html/;
     const extName = fileTypes.test(path.extname(req.file.originalname).toLowerCase());
     const mimeType = fileTypes.test(req.file.mimetype);
     if (!(extName && mimeType)) {
       logger.error('invalid file type. (step2)')
       return res.status(400).json({ status: "invalid_html", message: "Invalid html file! Only .html is allowed." });
     }

     if (req.file.size > 100000000) {
       logger.error('file size exceeds the maximum limit of 100MB! (step2)')
       return res.status(400).json({ status: "invalid_html", message: "Image file size exceeds the maximum limit of 100MB!" });
     }

    // Generate a unique filename for the uploaded image using the user uuid
    const pFileWithoutExtension = path.parse(req.file.originalname).name;
    const presentationFilename = `${pFileWithoutExtension}-${req.user.uuid}-presentation${path.extname(req.file.originalname)}`;
    // Store the uploaded image with the new filename
    const presentation_path = path.join(__dirname, '../../', 'resources/presentation', presentationFilename);
    fs.renameSync(req.file.path, presentation_path);
  
    // Update project description and status
    try {
      await ProjectDescription.update({
        presentation: presentationFilename,
      }, {
        where: {
          id: req.body.id
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
          id: req.body.id
        }
      }
      );
      logger.info('Project status updated successfully!(step5)');
    } catch(ex){
      logger.error('project status update failed(step5)')
      return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }
  
    // Proceed to the next step or return a response indicating successful completion
    res.status(200).json({
      data: {
        id: req.body.id,
      },
      message: "Step 2 completed successfully!",
      status: "ok",
    });
    logger.info('Step 2 completed successfully!');
  }

module.exports = { AddProjectStep1 , AddProjectStep2 }
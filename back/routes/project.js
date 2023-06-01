const { User, Wallet, Project, Invest, Donate, Comment, Reply, Payment, Like, ProjectDescription, BannedUser, Token } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
const { validateProjectSearchData, validateIdData } = require("../validators/project");
const { Op } = require('sequelize');
const express = require("express");
const router = express.Router();





module.exports = router;
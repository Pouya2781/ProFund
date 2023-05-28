const { User, Wallet, Project, Invest } = require("../models");
const _ = require("lodash");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const asyncMiddleware = require("../middleware/async");
//const { validateUserVerificationData } = require("../validators/user");
const express = require("express");
const router = express.Router();



module.exports = router;
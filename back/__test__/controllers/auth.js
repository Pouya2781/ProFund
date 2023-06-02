const { User, Wallet } = require("../../models");
const jwt = require("jsonwebtoken");
const { validateUserData } = require("../../validators/auth");
const _ = require("lodash");

const jwtPrivateKey = "privateKey";

async function register(req, res) {
    ////////// ver middleware
    let token = req.header("x-ver-token");
    if (!token) return res.status(401).json({ status: "missing_token", message: "Access denied. ver token required!" });
    try {
        const decoded = jwt.verify(token, "privateKey");
        req.phoneNumber = decoded.phoneNumber;
        next();
    }
    catch (ex) {
        res.status(400).json({ status: "invalid_token", message: "Invalid token!" });
    }

    ////////// sign up controller
    const { error } = validateUserData(req.body);
    if (error) return res.status(400).json({ status: "validation_fail", message: error.details[0].message });

    if (req.body.phoneNumber != req.phoneNumber) {
        return res.status(400).json({
            status: "PhoneNumber_mismatch",
            message: "The phone number supplied to API doesn't match the phone number entered during verification!"
        });
    }

    // Adding new user and its wallet to database
    let newUser;
    try {
        newUser = await User.create({
            phoneNumber: req.body.phoneNumber,
            fullName: req.body.fullName,
            nationalCode: req.body.nationalCode,
            email: req.body.email,
            birthDate: req.body.birthDate,
            verified: false,
            role: "user"
        });
        await Wallet.create({
            userId: newUser.id,
            balance: 0
        });
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    token = jwt.sign({ uuid: newUser.uuid, role: "user" }, jwtPrivateKey);
    res.set('x-auth-token', token);
    res.status(200).json({
        data: _.pick(newUser, ["phoneNumber", "fullName", "nationalCode", "birthDate", "email"]),
        message: "New user added!",
        status: "ok"
    });
}

module.exports = { register }
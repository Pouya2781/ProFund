const Joi = require("joi");

function validateUserVerificationData(body) {
    const schema = Joi.object().keys({
        fullName: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(5).max(30).email({ tlds: { allow: false } }).required(),
        birthDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
        nationalCode: Joi.string().regex(/^\d{10}$/).required(),
        state: Joi.string().min(3).max(20).required(),
        city: Joi.string().min(3).max(20).required(),
        address: Joi.string().min(3).max(120).required(),
        bio: Joi.string().min(25).max(500).required(),
    });

    return schema.validate(body);
}

function validateIdData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required()
    });

    return schema.validate(body);
}

function validateDonateData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required(),
        amount: Joi.number().min(10000).required()
    });

    return schema.validate(body);
}

function validateInvestData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required(),
        count: Joi.number().min(1).required()
    });

    return schema.validate(body);
}

function validateCommentData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required(),
        message: Joi.string().min(3).max(255).required()
    });

    return schema.validate(body);
}

module.exports = {
    validateUserVerificationData: validateUserVerificationData,
    validateIdData: validateIdData,
    validateDonateData: validateDonateData,
    validateInvestData: validateInvestData,
    validateCommentData: validateCommentData
}
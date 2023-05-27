const Joi = require("joi");

function validateUserData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
        fullName: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(5).max(30).email({ tlds: { allow: false } }).required(),
        birthDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
        nationalCode: Joi.string().regex(/^\d{10}$/).required()
    });

    return schema.validate(body);
}

function validateVerificationData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
        code: Joi.string().regex(/^\d{6}$/).required()
    });

    return schema.validate(body);
}

function validatePhoneNumberData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{11}$/).required(),
    });

    return schema.validate(body);
}

module.exports = {
    validatePhoneNumberData: validatePhoneNumberData,
    validateVerificationData: validateVerificationData,
    validateUserData: validateUserData
}
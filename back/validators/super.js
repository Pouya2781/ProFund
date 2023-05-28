const Joi = require("joi");

function validateUserOptionData(body) {
    const schema = Joi.object().keys({
        option: Joi.string().regex(/^[012]$/).required()
    });

    return schema.validate(body);
}

function validateUserIdData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required()
    });

    return schema.validate(body);
}

module.exports = {
    validateUserOptionData: validateUserOptionData,
    validateUserIdData: validateUserIdData
}
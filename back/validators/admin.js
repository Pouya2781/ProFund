const Joi = require("joi");

function validateIdData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required()
    });

    return schema.validate(body);
}

function validateProjectStatusData(body) {
    const schema = Joi.object().keys({
        status: Joi.string().regex(/^[creating|pending_approval|active|pending_payment|pending_delivery|done|expired]$/).required()
    });

    return schema.validate(body);
}

module.exports = {
    validateIdData: validateIdData,
    validateProjectStatusData: validateProjectStatusData
}
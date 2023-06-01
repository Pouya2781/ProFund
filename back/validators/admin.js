const Joi = require("joi");

function validateIdData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required()
    });

    return schema.validate(body);
}

function validateProjectStatusData(body) {
    const schema = Joi.object().keys({
        status: Joi.string().regex(/^(creating1|creating2|creating3|pending_approval|active|pending_payment|pending_delivery|done|expired)$/).required()
    });

    return schema.validate(body);
}

function validateProjectSearchData(body) {
    const schema = Joi.object().keys({
        title: Joi.string().min(1).optional(),
        subtitle: Joi.string().min(1).optional(),
        userId: Joi.number().optional(),
        goal: Joi.number().optional(),
        category: Joi.string().min(1).optional(),
        investedAmount: Joi.number().optional(),
        investorCount: Joi.number().optional(),
        hasDonate: Joi.boolean().optional(),
        hasToken: Joi.boolean().optional(),
        status: Joi.string().regex(/^(creating1|creating2|creating3|pending_approval|active|pending_payment|pending_delivery|done|expired)$/).optional()
    });

    return schema.validate(body);
}

function validateUserSearchData(body) {
    const schema = Joi.object().keys({
        phoneNumber: Joi.string().regex(/^\d{1,11}$/).optional(),
        fullName: Joi.string().min(1).max(30).optional(),
        email: Joi.string().min(1).max(30).email({ tlds: { allow: false } }).optional(),
        nationalCode: Joi.string().regex(/^\d{1,10}$/).optional(),
        state: Joi.string().min(1).max(20).optional(),
        city: Joi.string().min(1).max(20).optional(),
        address: Joi.string().min(1).max(120).optional(),
        verified: Joi.boolean().optional()
    });

    return schema.validate(body);
}

module.exports = {
    validateIdData: validateIdData,
    validateUserSearchData: validateUserSearchData,
    validateProjectSearchData: validateProjectSearchData
}
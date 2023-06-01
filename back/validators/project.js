const Joi = require("joi");

function validateProjectSearchData(body) {
    const schema = Joi.object().keys({
        title: Joi.string().min(1).optional(),
        subtitle: Joi.string().min(1).optional(),
        goal: Joi.number().optional(),
        category: Joi.string().min(1).optional(),
        investedAmount: Joi.number().optional(),
        investorCount: Joi.number().optional(),
        hasDonate: Joi.boolean().optional(),
        hasToken: Joi.boolean().optional(),
        status: Joi.string().regex(/^(active|pending_payment|pending_delivery)$/).optional()
    });

    return schema.validate(body);
}

function validateIdData(body) {
    const schema = Joi.object().keys({
        id: Joi.number().required()
    });

    return schema.validate(body);
}

module.exports = {
    validateProjectSearchData: validateProjectSearchData,
    validateIdData: validateIdData
}
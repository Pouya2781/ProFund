const Joi = require("joi");

function validateProjectTitleandSubtitle(body) {
  const schema = Joi.object().keys({
    title: Joi.string().min(3).max(30).required(),
    subtitle: Joi.string().min(20).max(200).required(),
  });

  return schema.validate(body);
}
function validatetoken(body) {
  const schema = Joi.object().keys({
    token_title: Joi.string().min(3).max(15).required(),
    token_description: Joi.string().min(20).max(200).required(),
    token_price: Joi.number().integer().min(10000).max(9999999999).required(),
  });

  return schema.validate(body);
}

module.exports = {
  validateProjectTitleandSubtitle: validateProjectTitleandSubtitle,
  validatetoken: validatetoken,
};
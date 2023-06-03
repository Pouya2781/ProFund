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
    id:Joi.number().required(),
    price: Joi.number().min(100).max(9999999999999).required(),
    limit: Joi.number().min(5).max(1000).required(),
    description: Joi.string().min(10).max(200).required(),
  });

  return schema.validate(body);
}

function validateIdData(body){
  const schema = Joi.object().keys({
    id: Joi.number().required(),
  });

  return schema.validate(body);
}
module.exports = {
  validateProjectTitleandSubtitle: validateProjectTitleandSubtitle,
  validatetoken: validatetoken,
  validateIdData: validateIdData
};
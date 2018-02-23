var Joi = require('joi');
var custom_fields = {
    name  : Joi.string().required(),
    history : Joi.string(),
    language : Joi.number().required(),
    plan : Joi.string(),
    deposit : Joi.number().required(),
    asset : Joi.number().required(),
    validation : Joi.string(),
    email : Joi.string().email().required(),
};
module.exports = custom_fields;

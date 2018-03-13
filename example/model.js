var Joi = require('joi');
var custom_fields = {
    name  : Joi.string().required(),
    province : Joi.string(),
    age : Joi.number().required(),
    workexperience : Joi.number().required(),
    degree : Joi.string(),
    history : Joi.string(),
    language : Joi.number().required(),
    plan : Joi.string(),
    personincome : Joi.number().required(),
    parentincome : Joi.number().required(),
    expectmajor : Joi.string(),
    asset : Joi.number().required(),
    refuse : Joi.string(),
    email : Joi.string().email().required(),
};
module.exports = custom_fields;

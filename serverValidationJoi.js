const Joi = require("joi");

module.exports.ValidateList = Joi.object({
  listing: Joi.object({
    tittle: Joi.string().required(),
    description: Joi.string().min(10).max(500).required(),
    image: Joi.string().allow("", null),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

module.exports.ValidateReview = Joi.object({
  Review  : Joi.object({
    content : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5),
    createdAt : Joi.string(),
  })
});


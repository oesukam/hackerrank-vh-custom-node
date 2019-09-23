const Joi = require('@hapi/joi');

export const addEvent = Joi.object().keys({
  id: Joi.number().required(),
  type: Joi.string().required(),
  actor: Joi.object()
    .keys({
      id: Joi.number().required(),
      login: Joi.string().required(),
      avatar_url: Joi.string().required()
    })
    .required(),
  repo: Joi.object()
    .keys({
      id: Joi.number().required(),
      name: Joi.string().required(),
      url: Joi.string().required()
    })
    .required(),
  created_at: Joi.date()
    .iso()
    .required()
});

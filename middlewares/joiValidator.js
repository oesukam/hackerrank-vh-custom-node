const Joi = require('@hapi/joi');
const { BAD_REQUEST } = require('../constants/statusCodes');

const joiValidator = ({ schema, type = 'body' } = {}) => async (
  req,
  res,
  next
) => {
  try {
    await Joi.validate(req[type], schema);
    return next();
  } catch (error) {
    return res.status(BAD_REQUEST).json({
      error: error.details ? error.details[0].message : error.message
    });
  }
};

module.exports = joiValidator;

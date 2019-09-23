const { INTERNAL_SERVER_ERROR } = require('../constants/statusCodes');
const asyncHandler = callback => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

export default asyncHandler;

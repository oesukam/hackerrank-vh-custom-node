const { Router } = require('express');
const router = Router();
const controller = require('../controllers/actors');
const joiValidator = require('../middlewares/joiValidator');
const joiRules = require('./validators/actors');
const asyncHandler = require('../helpers/asyncHandler');

// Routes related to actor.
router.route('/').get(controller.getAllActors);

module.exports = router;

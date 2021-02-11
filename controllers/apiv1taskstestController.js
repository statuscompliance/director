'use strict';

const varapiv1taskstestController = require('./apiv1taskstestControllerService');

module.exports.runTaskTest = function runTaskTest (req, res, next) {
  varapiv1taskstestController.runTaskTest(req.swagger.params, res, next);
};

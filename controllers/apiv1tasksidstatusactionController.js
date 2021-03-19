'use strict';

const varapiv1taskactionController = require('./apiv1tasksidstatusactionControllerService');

module.exports.updateTaskAction = function updateTaskAction (req, res, next) {
  varapiv1taskactionController.updateTaskAction(req.swagger.params, res, next);
};

'use strict';

const varapiv1tasksidstatusController = require('./apiv1tasksidstatusControllerService');

module.exports.findtaskstatusByid = function findTaskStatusByid (req, res, next) {
  varapiv1tasksidstatusController.findTaskStatusByid(req.swagger.params, res, next);
};

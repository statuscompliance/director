'use strict';

const varapiv1tasksidrunController = require('./apiv1tasksidrunControllerService');

module.exports.runTaskByid = function runTaskByid (req, res, next) {
  varapiv1tasksidrunController.runTaskByid(req.swagger.params, res, next);
};

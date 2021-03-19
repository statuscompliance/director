'use strict';

const varapiv1tasksidController = require('./apiv1tasksidControllerService');

module.exports.findTaskByid = function findTaskByid (req, res, next) {
  varapiv1tasksidController.findTaskByid(req.swagger.params, res, next);
};

module.exports.deleteTask = function deleteTask (req, res, next) {
  varapiv1tasksidController.deleteTask(req.swagger.params, res, next);
};

module.exports.updateTask = function updateTask (req, res, next) {
  varapiv1tasksidController.updateTask(req.swagger.params, res, next);
};

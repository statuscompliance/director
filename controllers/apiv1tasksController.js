'use strict';

const varapiv1tasksController = require('./apiv1tasksControllerService');

module.exports.gettasks = function getTasks (req, res, next) {
  varapiv1tasksController.getTasks(req, res, next);
};

module.exports.addTask = function addTask (req, res, next) {
  varapiv1tasksController.addTask(req.swagger.params, res, next);
};

'use strict';
var filemanager = require('./filemanager/');
var utils = require('./utils');
var taskExecutor = require('./taskExecutor/index')

module.exports.findTaskByid = async function findTaskByid (req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  res.send(task);
};




module.exports.deleteTask = async function deleteTask (req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  filemanager.deleteTaskFile(req.id.value);

  res.send({
    code: 202,
    message: 'Deleted'
  });
};

module.exports.updateTask = async function updateTask (req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  await filemanager.deleteTaskFile(req.id.value);
  var newTask = req.value.task;
  await filemanager.addTaskFile(newTask);
  res.send({
    code: 201,
    message: 'Updated'
  });
};

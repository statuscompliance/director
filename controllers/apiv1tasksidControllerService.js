'use strict';
const filemanager = require('./filemanager/');
const utils = require('./utils');

module.exports.findTaskByid = async function findTaskByid (req, res, next) {
  const task = await utils.getTaskById(req.id.value);
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
  const task = await utils.getTaskById(req.id.value);
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
  const task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  await filemanager.deleteTaskFile(req.id.value);
  const newTask = req.task.value;
  await filemanager.addTaskFile(newTask);
  res.send({
    code: 201,
    message: 'Updated'
  });
};

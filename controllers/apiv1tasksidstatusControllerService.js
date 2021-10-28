'use strict';
const utils = require('./utils');
const taskExecutor = require('./taskExecutor');

module.exports.findTaskStatusByid = async function findTaskStatusByid (req, res, next) {
  const task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }

  const response = {
    id: req.id.value,
    running: true,
    nextExecution: Object.keys(taskExecutor.getProgrammedTasks()?.[req.id.value] ?? [])?.[0]
  };
  res.send(response);
};

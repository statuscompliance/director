'use strict';
const utils = require('./utils');
const taskExecutor = require('./taskExecutor/index');

module.exports.runTaskByid = async function runTaskByid (req, res, next) {
  const task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  taskExecutor.runTask(task);
};

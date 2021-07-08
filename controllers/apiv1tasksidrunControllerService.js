'use strict';
const utils = require('./utils');
const taskExecutor = require('./taskExecutor/index');

module.exports.runTaskByid = async function runTaskByid (req, res, next) {
  try {
    const task = await utils.getTaskById(req.id.value);
    if (!task) {
      res.status(404).send({
        code: 404,
        message: 'Not Found'
      });
      return;
    }
    const scriptResponse = await taskExecutor.runTask(task);
    res.status(200).send(scriptResponse);
  } catch (err) {
    res.status(500).send(err);
    throw Error(err);
  }
};

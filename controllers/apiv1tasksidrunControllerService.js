'use strict';
var filemanager = require('./filemanager/');
var utils = require('./utils');
var taskExecutor = require('./taskExecutor/index')




module.exports.runTaskByid = async function runTaskByid (req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  taskExecutor.runTask(task);
};

'use strict'
var fs = require('fs');
const fsPromises = fs.promises;
var utils = require('./utils')
var taskExecutor =  require('./taskExecutor')

module.exports.findTaskStatusByid = async function findTaskStatusByid(req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task){
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
 
  var response = {
    id: req.id.value,
    running: true,
    nextExecution: Object.keys(taskExecutor.getProgrammedExecutions()[req.id.value])?.[0]
  }
  res.send(response);
};

'use strict'
var fs = require('fs');
const fsPromises = fs.promises;
var filemanager = require('./filemanager')
var utils = require('./utils')
const { v4: uuidv4 } = require('uuid');


module.exports.getTasks = async function getTasks(req, res, next) {
  console.log(req.query)
  var tasks = await utils.getTasksByData(req.query);
  console.log("Returning tasks list")
  res.send(tasks)
};

module.exports.addTask = async function addTask(req, res, next) {
  console.log(req.task.value)
  var tasks = await utils.getTasksByData(req.task.value);
  if (tasks.length > 0){
    res.status(400).send({
      code: 400,
      message: 'Task already exists'
    });
    return;
  }
  var newTask = req.task.value;
  if (!newTask.id){
    newTask.id = uuidv4();
  }
  filemanager.addTaskFile(newTask)
  res.status(200).send(newTask);
};
var fs = require('fs');
const fsPromises = fs.promises;
const mustache = require("mustache");
mustache.escape = function (text) { return text; };
var filemanager = require('../filemanager')

module.exports.getTaskById = async function getTaskById(id){
  var tasks = await filemanager.readFiles(false)
  var task = tasks.filter(ex=>{
    return ex.id == id
  })
  return task[0];
}



module.exports.getTasksByData = async function getTaskByData(task){
  var tasks = await filemanager.readFiles(false)
  var tasksFiltered = tasks.filter(ex=>{
    var identical = true;
    for (var prop in task){
      if (JSON.stringify(ex[prop]) !== JSON.stringify(task[prop])){
        identical = false;
        console.log('No coincide' + ex[prop] + ' - ' + task[prop])
      }
    }
    return identical;
  })
  return tasksFiltered;
}

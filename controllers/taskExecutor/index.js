const filemanager = require('../filemanager');
// const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
var requireFromString = require('require-from-string');
var programmedTasks = {};

module.exports.runTask = runTask;
module.exports.runScript = runScript;

module.exports.startExecutor = async function () {
  setInterval(programNextTasks, 3000);
};

module.exports.getProgrammedTasks = function () {
  return programmedTasks;
};

async function programNextTasks() {
  const currentTime = new Date().getTime();
  const maxTimeProgram = currentTime + 10000;

  var files = await filemanager.readFiles();

  // Programmed Task Object cleanup
  var taskListId = files.map(x => x.id);
  var programmedListId = Object.keys(programmedTasks);
  var toDelete = programmedListId.filter(id => { return !taskListId.includes(id); });
  var toCreate = taskListId.filter(id => { return !programmedListId.includes(id); });
  toDelete.forEach(id => delete programmedTasks[id]);
  toCreate.forEach(id => { programmedTasks[id] = {}; });

  // Iteration for all task files
  files.filter(task => { return task.running; }).forEach(task => {
    var initTime = new Date(task.init).getTime();
    var endTime = new Date(task.end).getTime();

    if (currentTime > endTime) {
      filemanager.deleteTaskFile(task.id);
    } else {
      var realInitTime = initTime;
      // Remove old period if time init is past for optimization
      if (initTime < currentTime) {
        realInitTime = currentTime - (currentTime - initTime) % task.interval;
      }
      var nextTaskDates = [];
      var currentTimeCalculation = realInitTime;
      while (maxTimeProgram > currentTimeCalculation && endTime > currentTimeCalculation) {
        if (currentTimeCalculation > currentTime && !programmedTasks[task.id][currentTimeCalculation]) {
          nextTaskDates.push(currentTimeCalculation);
        }
        currentTimeCalculation += task.interval;
      }

      nextTaskDates.forEach(time => {
        var scheduledFunction = function () {
          if (task) {
            delete programmedTasks[task.id][time];
            runTask(task);
          } else {
            console.log('Task canceled because it was deleted.');
          }
        };

        setTimeout(scheduledFunction, time - currentTime);
        programmedTasks[task.id][time] = { timer: 'id' };
      });
    }
  });
  console.log(programmedTasks);
}


//Run a specific tasktask
async function runTask(task) {
  try {
    let scriptFile = await axios({
      url: task.script,
      method: 'GET',
      headers: { 'User-Agent': 'request' },
      transformResponse: function (response) {
        // do not convert the response to JSON or object
        return response;
      }
    })
    await runScript(scriptFile.data, task.config, task.id)
  } catch (err) {
    console.error(err);
    throw Error('Error obtaining: ' + URL);
  };
}

// Run raw JS file with a specific configuration. 
async function runScript(scriptText, config, scriptInfo) {
  let scriptResponse;
  try {

    var module = requireFromString(scriptText);

    scriptResponse = await module.main(config);
    
   
  } catch (error) {
    scriptResponse = 'Error running script: ' + JSON.stringify(scriptInfo) + '\n' + 'Script config: ' + JSON.stringify(config);
    throw Error(scriptResponse);
  }
  return scriptResponse;
}

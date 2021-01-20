const filemanager = require('../filemanager');
// const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
var requireFromString = require('require-from-string');
var programmedExecutions = {};

module.exports.startExecutor = async function () {
  setInterval(programNextExecutions, 3000);
};

module.exports.getProgrammedExecutions = function () {
  return programmedExecutions;
};

async function programNextExecutions () {
  const currentTime = new Date().getTime();
  const maxTimeProgram = currentTime + 10000;

  var files = await filemanager.readFiles();

  // Programmed Task Object cleanup
  var executionListId = files.map(x => x.id);
  var programmedListId = Object.keys(programmedExecutions);
  var toDelete = programmedListId.filter(id => { return !executionListId.includes(id); });
  var toCreate = executionListId.filter(id => { return !programmedListId.includes(id); });
  toDelete.forEach(id => delete programmedExecutions[id]);
  toCreate.forEach(id => { programmedExecutions[id] = {}; });

  // Iteration for all execution files
  files.filter(execution => { return execution.running; }).forEach(execution => {
    var initTime = new Date(execution.init).getTime();
    var endTime = new Date(execution.end).getTime();

    if (currentTime > endTime) {
      filemanager.deleteTaskFile(execution.id);
    } else {
      var realInitTime = initTime;
      // Remove old period if time init is past for optimization
      if (initTime < currentTime) {
        realInitTime = currentTime - (currentTime - initTime) % execution.interval;
      }
      var nextExecutionDates = [];
      var currentTimeCalculation = realInitTime;
      while (maxTimeProgram > currentTimeCalculation && endTime > currentTimeCalculation) {
        if (currentTimeCalculation > currentTime && !programmedExecutions[execution.id][currentTimeCalculation]) {
          nextExecutionDates.push(currentTimeCalculation);
        }
        currentTimeCalculation += execution.interval;
      }

      nextExecutionDates.forEach(time => {
        var scheduledFunction = function () {
          if (execution) {
            delete programmedExecutions[execution.id][time];
            executeFile(execution);
          } else {
            console.log('Execution canceled because it was deleted.');
          }
        };

        setTimeout(scheduledFunction, time - currentTime);
        programmedExecutions[execution.id][time] = { timer: 'id' };
      });
    }
  });
  console.log(programmedExecutions);
}

function executeFile (execution) {
  axios({
    url: execution.script,
    method: 'GET',
    headers: { 'User-Agent': 'request' },
    transformResponse: function (response) {
      // do not convert the response to JSON or object
      return response;
    }
  }).then(response => {
    var module = requireFromString(response.data);
    module.main(execution.config);
  }).catch(err => {
    console.error(err);
    throw Error('Error obtaining: ' + URL);
  });
}

// function requireFromString(src, filename) {
//     var Module = module.constructor;
//     var m = new Module();
//     m._compile(src, filename);
//     return m.exports;
// }

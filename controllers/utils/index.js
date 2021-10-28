const mustache = require('mustache');
mustache.escape = function (text) { return text; };
const filemanager = require('../filemanager');
const logger = require('governify-commons').getLogger().tag('utils');

module.exports.getTaskById = async function getTaskById (id) {
  const tasks = await filemanager.readFiles(false);
  const task = tasks.filter(ex => {
    return ex.id === id;
  });
  return task[0];
};

module.exports.getTasksByData = async function getTaskByData (task) {
  const tasks = await filemanager.readFiles(false);
  const tasksFiltered = tasks.filter(ex => {
    let identical = true;
    for (const prop in task) {
      if (JSON.stringify(ex[prop]) !== JSON.stringify(task[prop])) {
        identical = false;
        logger.info('No coincide' + ex[prop] + ' - ' + task[prop]);
      }
    }
    return identical;
  });
  return tasksFiltered;
};

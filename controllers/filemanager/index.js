const fs = require('fs');
const fsPromises = fs.promises;
const mustache = require('mustache');
mustache.escape = function (text) { return text; };
const taskFolder = 'tasks';
const logger = require('governify-commons').getLogger().tag('file-manager');

module.exports.updateTask = async function updateTask (task) {
  await this.deleteTaskFile(task.id);
  await this.addTaskFile(task);
};

module.exports.readFiles = async function readFiles (parsed) {
  return Object.values(await this.readFilesMap(parsed));
};

module.exports.readFilesMap = async function readFilesMap (parsed) {
  const objects = {};
  const filenames = await fsPromises.readdir(taskFolder);
  for (const filename of filenames) {
    if (filename.endsWith('.json')) {
      const fileContent = await fsPromises.readFile(taskFolder + '/' + filename, 'utf-8');
      let jsonObject;
      if (parsed) {
        jsonObject = JSON.parse(mustache.render(fileContent, process.env, {}, ['$_[', ']']));
      } else {
        jsonObject = JSON.parse(fileContent);
      }
      objects[filename] = jsonObject;
    }
  }

  return objects;
};

module.exports.deleteTaskFile = async function deleteTaskFile (id) {
  const tasksFileMap = await this.readFilesMap();
  for (const taskFileName in tasksFileMap) {
    if (tasksFileMap[taskFileName].id === id) {
      const deletedFilePath = taskFolder + '/' + taskFileName;
      logger.info('Deleting task file:' + deletedFilePath);
      fs.unlinkSync(deletedFilePath);
      return;
    }
  }
};

module.exports.addTaskFile = async function addTaskFile (task) {
  fs.writeFile(taskFolder + '/' + task.id + '.json', JSON.stringify(task, null, 2), function (err) {
    if (err) {
      logger.error(err);
    }
  });
};

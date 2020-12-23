var fs = require('fs');
const fsPromises = fs.promises;
const mustache = require("mustache");
mustache.escape = function (text) { return text; };
var taskFolder = 'tasks';



module.exports.updateTask = async function updateTask(task) {
    await this.deleteTaskFile(task.id);
    await this.addTaskFile(task)
}

module.exports.readFiles = async function readFiles(parsed) {
    return Object.values(await this.readFilesMap(parsed));
}

module.exports.readFilesMap = async function readFilesMap(parsed) {
    var objects = {};
    var filenames = await fsPromises.readdir(taskFolder);
    for (const filename of filenames) {
        var fileContent = await fsPromises.readFile(taskFolder + '/' + filename, 'utf-8')
        var jsonObject;
        if (parsed) {
            jsonObject = JSON.parse(mustache.render(fileContent, process.env, {}, ['$_[', ']']));
        }
        else {
            jsonObject = JSON.parse(fileContent);
        }
        objects[filename] = jsonObject;
    }
    
    return objects;
}

module.exports.deleteTaskFile = async function deleteTaskFile(id) {
    var tasksFileMap = await this.readFilesMap()
    for (var taskFileName in tasksFileMap) {
        if (tasksFileMap[taskFileName].id == id) {
            var deletedFilePath = taskFolder + '/' + taskFileName;
            console.log('Deleting task file:' + deletedFilePath)
            fs.unlinkSync(deletedFilePath)
            return;
        }
    }
}


module.exports.addTaskFile = async function addTaskFile(task) {
    fs.writeFile(taskFolder + '/' + task.id + '.json', JSON.stringify(task, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
}




'use strict';
var utils = require('./utils');
var path = require('path');

module.exports.findTaskBadgeByid = async function findTaskBadgeByid (req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  var imgPath = 'badges/stopped.svg';
  if (task.running) {
    imgPath = 'badges/running.svg';
  }
  res.sendFile(path.join(__dirname, imgPath));
};

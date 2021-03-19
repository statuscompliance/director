'use strict';
const utils = require('./utils');
const path = require('path');

module.exports.findTaskBadgeByid = async function findTaskBadgeByid (req, res, next) {
  const task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  let imgPath = 'badges/stopped.svg';
  if (task.running) {
    imgPath = 'badges/running.svg';
  }
  res.sendFile(path.join(__dirname, imgPath));
};

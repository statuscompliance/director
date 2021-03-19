'use strict';

const varapiv1tasksidbadgeController = require('./apiv1tasksidbadgeControllerService');

module.exports.findTaskBadgeByid = function findTaskBadgeByid (req, res, next) {
  varapiv1tasksidbadgeController.findTaskBadgeByid(req.swagger.params, res, next);
};

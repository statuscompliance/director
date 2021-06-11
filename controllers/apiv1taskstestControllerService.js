'use strict';
const taskExecutor = require('./taskExecutor/index');
const logger = require('governify-commons').getLogger().tag('controller-tasks');

module.exports.runTaskTest = async function runTaskTest (req, res, next) {
  try {
    logger.info(req.testBody);
    const scriptResponse = await taskExecutor.runScript(req.testBody.value.scriptText, req.testBody.value.scriptConfig, 'Script from test API');

    res.status(200).send(scriptResponse);
  } catch (err) {
    res.status(500).send(err);
    throw Error(err);
  }
};

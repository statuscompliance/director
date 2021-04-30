'use strict';
const deploy = (env, commonsMiddleware) => {
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      const http = require('http');
      const path = require('path');

      const express = require('express');
      const cors = require('cors');
      const app = express();
      const bodyParser = require('body-parser');
      const taskExecutor = require('./controllers/taskExecutor');
      app.use(bodyParser.json({
        strict: false
      }));

      app.use(cors());
      app.use('/commons', commonsMiddleware)
      const oasTools = require('oas-tools');
      const jsyaml = require('js-yaml');
      const serverPort = process.env.PORT || 5800;

      const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
      const oasDoc = jsyaml.safeLoad(spec);

      const optionsObject = {
        controllers: path.join(__dirname, './controllers'),
        loglevel: env === 'test' ? 'error' : 'info',
        strict: false,
        router: true,
        validator: true
      };

      oasTools.configure(optionsObject);

      oasTools.initialize(oasDoc, app, function () {
        http.createServer(app).listen(serverPort, function () {
          if (env !== 'test') {
            console.log('App running at http://localhost:' + serverPort);
            console.log('________________________________________________________________');
            if (optionsObject.docs !== false) {
              console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
              console.log('________________________________________________________________');
            }
          }
        });
      });

      app.get('/info', function (req, res) {
        res.send({
          info: 'This API was generated using oas-generator!',
          name: oasDoc.info.title
        });
      });

      console.log('Starting task executor');
      taskExecutor.startExecutor();
    } catch (err) {
      reject(err);
    }
  });
};

const undeploy = () => {
  process.exit();
};

module.exports = {
  deploy: deploy,
  undeploy: undeploy
};

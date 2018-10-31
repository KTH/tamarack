const appInsights = require("applicationinsights");
const express = require("express");
const app = express();
const log = require("kth-node-log");
const templates = require("./modules/templates");
const about = require("./config/version");
const os = require("os");
const packageFile = require("./package.json");
var path = require('path');

/**
 * Index page.
 */
app.get("/", function (req, res) {
  app.logRequest(req);
  res.status(200).send(templates.index());
});

/**
 * About page. Versions and such.
 */
app.get("/_about", function (req, res) {
  app.logRequest(req);
  res.status(200).send(templates._about());
});

/**
 * Health check route.
 */
app.get("/_monitor", function (req, res) {
  app.logRequest(req);
  res.set("Content-Type", "text/plain");
  res.status(200).send(templates._monitor());
});

/**
 * Crawler access definitions.
 */
app.get("/robots.txt", function (req, res) {
  app.logRequest(req);
  res.set("Content-Type", "text/plain");
  res.status(200).send(templates.robotstxt());
});

/**
 * Default route, if no other route is matched.
 */
app.use(function (req, res) {
  app.logRequest(req, 404);
  res.status(404).send(templates.error404());
});

/************************************************* */

/**
 * Gets the log level passed as env LOG_LEVEL
 * or defaults to info.
 * 
 * Levels are:
 * log.info('hello from info, log level usually used in setup')
 * log.warn('error that code handled and can recover from')
 * log.error({err: err}, 'error that should be fixed in code')
 * log.fatal('a really bad error that will crash the application')
 * log.debug({req: req, res: res}, 'log a request and response, basic dev log')
 * log.trace('granular logging, rarely used')
 */
app.getLogLevel = function () {
  result = "info";
  if (process.env.LOG_LEVEL != null) {
    result = process.env.LOG_LEVEL;
  }
  console.log(`Loglevel: '${result}'`);
  return result;
};

/**
 * Set logging to the level specified in env LOG_LEVEL
 * or use default. 
 */
log.init({
  name: packageFile.name,
  app: packageFile.name,
  level: app.getLogLevel()
});

/**
 * Gets out the requestors IP.
 * The IP is found on differnt places depending on
 * if the service is accessed directly or via proxy.
 */
app.getRequestor = function (req) {
  let result = req.headers["x-forwarded-for"];

  if (result == null) {
    if (req.connection && req.connection.remoteAddress) {
      result = req.connection.remoteAddress;
    }
  }

  if (result == null) {
    result = req.ip;
  }

  if (result == null) {
    result = "missing remote ip";
  }

  return result

};

/**
 * Log incomming request.
 * E.g:  http://localhost:3000/_about - Response Code: 200, Client IP: 127.0.0.1
 */
app.logRequest = function (req, statusCode = 200) {

  log.info(
    `${req.protocol}://${req.get("Host")}${
      req.url
    } - Response Code: ${statusCode}, Client IP: ${app.getRequestor(req)}`
  );
};

/**
 * Init a Azure Application Insights if a key is passed as env APPINSIGHTS_INSTRUMENTATIONKEY
 */
app.initApplicationInsights = function () {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    appInsights
      .setup()
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .start();
    log.info(
      `Using Application Ingsights: '${
        process.env.APPINSIGHTS_INSTRUMENTATIONKEY
      }'.`
    );
  } else {
    log.info(`Application Ingsights not used.`);
  }
};

/**
 * Start server on port 80, or use port specifed in env PORT.
 */
app.getListenPort = function () {
  return process.env.PORT ? process.env.PORT : 80;
};

/**
 * Start the server on configured port.
 */
app.listen(app.getListenPort(), function () {
  console.log(
    `Started ${packageFile.name} on ${os.hostname()}:${app.getListenPort()}`
  );
  app.initApplicationInsights();
});
var appInsights = require("applicationinsights");
const express = require("express");
const app = express();
const log = require("kth-node-log");
const templates = require("./modules/templates");
const about = require("./config/version");
const os = require("os");
const packageFile = require("./package.json");

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

log.init({
  name: packageFile.name,
  app: packageFile.name,
  env: "dev",
  level: "DEBUG",
  console: false,
  stdout: true,
  src: true
});

app.get("/", function(req, res) {
  app.logRequest(req);
  res.status(200).send(templates.index());
});

app.get("/_about", function(req, res) {
  app.logRequest(req);
  res.status(200).send(templates._about());
});

app.get("/_monitor", function(req, res) {
  app.logRequest(req);
  res.set("Content-Type", "text/plain");
  res.status(200).send(templates._monitor());
});

app.use(function(req, res) {
  app.logRequest(req, 404);
  res.status(404).send(templates.error404());
});

app.logRequest = function(req, statusCode = 200) {
  log.info(
    `${req.headers["x-forwarded-for"]} ${statusCode} ${req.get("Host")}/${
      req.url
    }`
  );
};

/**
 * Start server on package.json port or default to 80.
 */
app.getListenPort = function() {
  return process.env.PORT ? process.env.PORT : 80;
};

app.listen(app.getListenPort(), function() {
  console.log(
    `${
      packageFile.name
    } running on port ${app.getListenPort()} on ${os.hostname()}`
  );
  log.info(
    `Using Application Ingsights: ${
      process.env.APPINSIGHTS_INSTRUMENTATIONKEY ? "yes" : "no"
    }.`
  );
});

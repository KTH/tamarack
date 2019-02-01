const appInsights = require("applicationinsights");
const express = require("express");
const app = express();
const log = require("kth-node-log");
const templates = require("./modules/templates");
const about = require("./config/version");
const os = require("os");
const packageFile = require("./package.json");
var path = require('path');

const CONTENT_TYPE_PLAIN_TEXT = "text/plain"
const CONTENT_TYPE_HTML = "text/html"

/**
 * Index page.
 */
app.get("/", function (req, res) {
  app.logRequest(req);
  app.ok(res, templates.index());
});

/**
 * About page. Versions and such.
 */
app.get("/_about", function (req, res) {
  app.logRequest(req);
  app.ok(res, templates._about());
});

/**
 * Health check route.
 */
app.get("/_monitor", function (req, res) {
  app.logRequest(req);
  app.ok(res, templates._monitor(), CONTENT_TYPE_PLAIN_TEXT);
});

/**
 * Crawler access definitions.
 */
app.get("/robots.txt", function (req, res) {
  app.logRequest(req);
  app.ok(res, templates.robotstxt(), CONTENT_TYPE_PLAIN_TEXT);
});

/**
 * Unique path to verify ownership of domain.
 */
app.get(`/${process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE}`, function (req, res) {
  log.info(`Domain verification request. Responding '${process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT}'.`);
  app.logRequest(req);
  app.ok(res, process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT, CONTENT_TYPE_PLAIN_TEXT);
});


/**
 * Error page for 502 Bad Gateway
 */
app.get("/error502.html", function (req, res) {
  app.logRequest(req, 502);
  app.badGateway(res, templates.error502());
});

/**
 * Default route, if no other route is matched.
 */
app.use(function (req, res) {
  app.logRequest(req, 404);
  app.notFound(res, templates.error404());
});

/************************************************* */

/**
 * Send status 200 with a body set to the content type.
 * Default content type is text/html.
 */
app.ok = function (res, body, contentType) {
  app.send(res, body, 200, contentType)
};

/**
 * Send status 404 with a body set to the content type.
 * Default content type is text/html.
 */
app.notFound = function (res, body, contentType) {
  app.send(res, body, 404, contentType)
};

/**
 * Send status 502 with a body set to the content type.
 * Default content type is text/html.
 */
app.badGateway = function (res, body, contentType) {
  app.send(res, body, 502, contentType)
};

/**
 * Send the content type with the passed status code.
 * Default content type is text/html.
 * Default status code is 200.
 */
app.send = function (res, body, status = 200, contentType = CONTENT_TYPE_HTML) {
  res.set("X-Frame-Options", "sameorigin");
  res.set("Content-Type", contentType);
  res.status(status).send(body);
};


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
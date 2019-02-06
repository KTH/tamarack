const appInsights = require("applicationinsights");
const express = require("express");
const app = express();
const log = require("kth-node-log");
const templates = require("./modules/templates");
const about = require("./config/version");
const os = require("os");
const packageFile = require("./package.json");
const path = require("path");

// Content types
const CONTENT_TYPE_PLAIN_TEXT = "text/plain";
const CONTENT_TYPE_HTML = "text/html";

// Response codes
const STATUS_CODE_OK = 200;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_BAD_GATEWAY = 502;

/**
 * Send status 200 with a body set to the content type.
 * Default content type is text/html.
 */
app.ok = function(request, response, body, contentType) {
  app.send(request, response, body, STATUS_CODE_OK, contentType);
};

/**
 * Send status 404 with a body set to the content type.
 * Default content type is text/html.
 */
app.notFound = function(request, response, body, contentType) {
  app.send(request, response, body, STATUS_CODE_NOT_FOUND, contentType);
};

/**
 * Send status 502 with a body set to the content type.
 * Default content type is text/html.
 */
app.badGateway = function(request, response, body, contentType) {
  app.send(request, response, body, STATUS_CODE_BAD_GATEWAY, contentType);
};

/**
 * Send the content type with the passed status code.
 * Default content type is text/html.
 * Default status code is 200.
 */
app.send = function(
  request,
  response,
  bodyContent,
  statusCode = STATUS_CODE_OK,
  contentType = CONTENT_TYPE_HTML
) {
  app.logRequest(request, statusCode);
  response.set("X-Frame-Options", "sameorigin");
  response.set("Content-Type", contentType);
  response.status(statusCode).send(bodyContent);
};

/**
 * Gets the value passed in env DOMAIN_OWNERSHIP_VERIFICATION_FILE
 * to use as path for ownership verification.
 *
 * Example: /97823o4i723bus6dtg34.txt
 */
app.getOwnershipVerificationPath = function() {
  let result = process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE;
  if (result == null) {
    result = "_DOMAIN_OWNERSHIP_VERIFICATION_FILE_not_defined";
  }
  return result;
};

/**
 * Gets the value passed in env DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT
 * to use as body for ownership verification.
 * Defaults to empty string.
 */
app.getOwnershipVerificationPathBodyContent = function() {
  let result = process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT;
  if (result == null) {
    result = "";
  }
  return result;
};

/**
 * Select the content type for the DOMAIN_OWNERSHIP_VERIFICATION_FILE.
 * Use plain text if its a text file, otherwise use html.
 */
app.getOwnershipVerificationPathMimeType = function() {
  result = CONTENT_TYPE_HTML;
  if (app.getOwnershipVerificationPath().endsWith(".txy")) {
    result = CONTENT_TYPE_PLAIN_TEXT;
  }
  return result;
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
 * log.debug({req: request, res: res}, 'log a request and response, basic dev log')
 * log.trace('granular logging, rarely used')
 */
app.getLogLevel = function() {
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
app.getRequestor = function(request) {
  let result = request.headers["x-forwarded-for"];

  if (result == null) {
    if (request.connection && request.connection.remoteAddress) {
      result = request.connection.remoteAddress;
    }
  }

  if (result == null) {
    result = request.ip;
  }

  if (result == null) {
    result = "missing remote ip";
  }

  return result;
};

/**
 * Log incomming request.
 * E.g:  http://localhost:3000/_about - Response Code: 200, Client IP: 127.0.0.1
 */
app.logRequest = function(request, statusCode = STATUS_CODE_OK) {
  log.info(
    `${request.protocol}://${request.get("Host")}${
      request.url
    } - Response Code: ${statusCode}, Client IP: ${app.getRequestor(request)}`
  );
};

/**
 * Init a Azure Application Insights if a key is passed as env APPINSIGHTS_INSTRUMENTATIONKEY
 */
app.initApplicationInsights = function() {
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
app.getListenPort = function() {
  return process.env.PORT ? process.env.PORT : 80;
};

/**
 * Start the server on configured port.
 */
app.listen(app.getListenPort(), function() {
  console.log(
    `Started ${packageFile.name} on ${os.hostname()}:${app.getListenPort()}`
  );
  app.initApplicationInsights();
});

/********************* routes **************************/

/**
 * Index page.
 */
app.get("/", function(request, response) {
  app.ok(request, response, templates.index());
});

/**
 * About page. Versions and such.
 */
app.get("/_about", function(request, response) {
  app.ok(request, response, templates._about());
});

/**
 * Health check route.
 */
app.get("/_monitor", function(request, response) {
  app.ok(request, response, templates._monitor(), CONTENT_TYPE_PLAIN_TEXT);
});

/**
 * Crawler access definitions.
 */
app.get("/robots.txt", function(request, response) {
  app.ok(request, response, templates.robotstxt(), CONTENT_TYPE_PLAIN_TEXT);
});

/**
 * Unique path to verify ownership of domain.
 */
app.get(`/${app.getOwnershipVerificationPath()}`, function(request, response) {
  log.info(
    `Domain verification response '${app.getOwnershipVerificationPathBodyContent()}'.`
  );
  app.ok(
    request,
    response,
    app.getOwnershipVerificationPathBodyContent(),
    app.getOwnershipVerificationPathMimeType()
  );
});

/**
 * Error page for 502 Bad Gateway
 */
app.get("/error502.html", function(request, response) {
  app.badGateway(request, response, templates.error502());
});

/**
 * Default route, if no other route is matched.
 */
app.use(function(request, response) {
  app.notFound(request, response, templates.error404());
});

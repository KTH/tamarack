const appInsights = require("applicationinsights");
const express = require("express");
const os = require("os");
const { templates } = require("@kth/basic-html-templates");
const httpResponse = require("@kth/http-responses");
const about = require("./config/version");
const logger = require("./modules/logger");
const cluster = require("./modules/cluster");
const badGateway = require("./modules/badGateway");
const app = express();
const started = new Date();

/**
 * Gets the value passed in env DOMAIN_OWNERSHIP_VERIFICATION_FILE
 * to use as path for ownership verification.
 * Example: /97823o4i723bus6dtg34.txt
 * Defaults to _DOMAIN_OWNERSHIP_VERIFICATION_FILE_not_defined.
 */
app.getOwnershipVerificationPath = function () {
  return process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE
    ? process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE
    : "_DOMAIN_OWNERSHIP_VERIFICATION_FILE_not_defined";
};

/**
 * Gets the value passed in env DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT
 * to use as body for ownership verification.
 * Defaults to empty string.
 */
app.getOwnershipVerificationPathBodyContent = function () {
  return process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT
    ? process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT
    : "";
};

/**
 * If env DOMAIN_OWNERSHIP_VERIFICATION_FILE ends with .txt mine type text/plain is used.
 * Defaults to text/html.
 */
app.getOwnershipVerificationPathMimeType = function () {
  return app.getOwnershipVerificationPath().endsWith(".txt")
    ? httpResponse.contentTypes.PLAIN_TEXT
    : httpResponse.contentTypes.HTML;
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
    logger.log.info(
      `Using Application Ingsights: '${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}'.`
    );
  } else {
    logger.log.info(`Application Ingsights not used.`);
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
  logger.log.info(
    `Started ${about.dockerName}:${
      about.dockerVersion
    } on ${os.hostname()}:${app.getListenPort()}`
  );
  app.initApplicationInsights();
});

/********************* routes **************************/

/**
 * Index page.
 */
app.get("/", function (request, response) {
  httpResponse.ok(request, response, templates.index((title = "Applications")));
});

/**
 * About page. Versions and such.
 */
app.get("/_about", function (request, response) {
  httpResponse.ok(request, response, templates._about(about, started));
});

/**
 * Health check route.
 */
app.get("/_monitor", function (request, response) {
  httpResponse.ok(
    request,
    response,
    templates._monitor(
      (status = "OK"),
      (extras = cluster.getMonitorClusterName())
    ),
    httpResponse.contentTypes.PLAIN_TEXT
  );
});

/**
 * Cluster IPs (ops)
 */
app.get("/_clusters", function (request, response) {
  httpResponse.ok(
    request,
    response,
    cluster.getAllClusterIps(),
    httpResponse.contentTypes.JSON
  );
});

/**
 * Crawler access definitions.
 */
app.get("/robots.txt", function (request, response) {
  httpResponse.ok(
    request,
    response,
    templates.robotstxt(),
    httpResponse.contentTypes.PLAIN_TEXT
  );
});

/**
 * Unique path to verify ownership of domain.
 */
app.get(`/${app.getOwnershipVerificationPath()}`, function (request, response) {
  logger.log.info(
    `Domain verification response '${app.getOwnershipVerificationPathBodyContent()}'.`
  );
  httpResponse.ok(
    request,
    response,
    app.getOwnershipVerificationPathBodyContent(),
    app.getOwnershipVerificationPathMimeType()
  );
});

/**
 * Unique path to verify ownership of domain.
 */
app.get(`/_${process.env.PORTILLO_CLUSTER}`, function (request, response) {
  httpResponse.ok(
    request,
    response,
    process.env.PORTILLO_CLUSTER,
    httpResponse.contentTypes.PLAIN_TEXT
  );
});

/**
 * Generic error page for 5xx response codes.
 * Includes application information from  /_application.
 */
app.get("/error5xx.html", function (request, response) {
  httpResponse.internalServerError(request, response, badGateway.error5xx());
});

/**
 * Ignore favicons.
 */
app.get("/favicon.ico", function (request, response) {
  httpResponse.noContent(request, response);
});

/**
 * Default route, if no other route is matched (404 Not Found).
 */
app.use(function (request, response) {
  httpResponse.notFound(request, response, templates.error404());
});

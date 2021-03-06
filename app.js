const appInsights = require("applicationinsights");
const express = require("express");
const os = require("os");
const { templates } = require("@kth/basic-html-templates");
const httpResponse = require("@kth/http-responses");
const about = require("./config/version");
const { log } = require("./modules/logger");
const cluster = require("./modules/cluster");
const error = require("./modules/errorPage");
const defaultEnvs = require("@kth/default-envs");
const applicationInsights = require("./modules/applicationInsights");
const domainVerification = require("./modules/domainVerification");
const app = express();
const started = new Date();

/**
 * Let the package @kth/http-responses use the Tamarack log.
 */
httpResponse.setLogger(log);

/**
 * Process env:s that are not configured on start up, but accessed
 * as envs in the application are added with there default values.
 *
 * They are also logged.
 *
 * This way you will always have a value for process.env.X
 */
defaultEnvs.set(require("./config/defaults"), log);

/**
 * Start the server on configured port.
 */
app.listen(process.env.PORT, function () {
  log.info(
    `Started '${about.dockerName}:${
      about.dockerVersion
    }' on '${os.hostname()}:${process.env.PORT}'`
  );
  applicationInsights.init();
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
app.get(`/${domainVerification.getPath()}`, function (request, response) {
  httpResponse.ok(
    request,
    response,
    domainVerification.getContent(),
    domainVerification.gethMimeType()
  );
});

/**
 * Unique path to identify the cluster name from PORTILLO_CLUSTER env.
 */
app.get(`/_${cluster.getClusterName()}`, function (request, response) {
  httpResponse.ok(
    request,
    response,
    cluster.getClusterName(),
    httpResponse.contentTypes.PLAIN_TEXT
  );
});

/**
 * Generic error page for 5xx response codes.
 * Includes application information from  /_application.
 */
app.get("/error5xx.html", function (request, response) {
  httpResponse.internalServerError(
    request,
    response,
    error.error5xx(httpResponse.statusCodes.BAD_GATEWAY)
  );
});

/**
 * Show a page with 403 Forbidden imformation.
 */
app.get("/forbidden.html", function (request, response) {
  httpResponse.forbidden(request, response, templates.forbidden());
});

/**
 * Dynamic error handling to match Traefik:s error handling middleware.
 * Handles 5xx, and serves 404 for anything else that matches get path.
 *
 * We treat all 500+ errors as internal server errors. They look the
 * same to the end user.
 *
 * Also there are no defined status codes above 600, so just treat
 * them also as internal server errors. If someone for some unknown
 * reason would sends such status.
 */
app.get("/error/:statusCode", function (request, response) {
  const statusCode = parseInt(request.params.statusCode);

  if (statusCode >= httpResponse.statusCodes.INTERNAL_SERVER_ERROR) {
    httpResponse.internalServerError(
      request,
      response,
      error.error5xx(statusCode)
    );
  } else {
    httpResponse.notFound(request, response, templates.error404());
  }
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

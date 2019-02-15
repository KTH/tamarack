"use strict";

const https = require('https');
const logger = require("./logger");
const httpResponse = require("./httpResponse");

let _getCluster = function getCluster() {
    return process.env.PORTILLO_CLUSTER ? process.env.PORTILLO_CLUSTER : "active";
};

let _applicationsApiHost = function applicationsApiHost() {
    return process.env.APPLICATIONS_API_HOST ?
        process.env.APPLICATIONS_API_HOST :
        "api.kth.se";
};

let _getSearchPath = function getSearchPath(uriQuery) {
    return `/api/pipeline/v1/search/${_getCluster()}/${encodeURIComponent(uriQuery)}`;
};

/**
 * Gets information about an application based on the uriQuery passed.
 * Ex:
 * For example.com/my-app/ the uri query '/my-app' will be sent to the api
 * which returns information about tha application.
 * 
 * Example result from API:
 * {
 *  "applicationName": "My Application",
 *  "created": 1548164635.178028,
 *  "clusterName": "active",
 *  "version": "1.2.701_a538576",
 *  "path": "/my-Application/",
 *  "slackChannels": "#team-developers",
 *  "importance": "high",
 *  "publicNameEnglish": "My Application,
 *  "publicNameSwedish": "Min application",
 *  "descriptionEnglish": "Reading the comments are you, go get a cup of coffee!",
 *  "descriptionSwedish": "Bra applikation som fixar saker.",
 *  "monitorUrl": "https://example.com/my-app/_monitor"
 * }
 *
 */
let _getApplication = function getApplications(request, response, uriQuery) {

    logger.log.debug(`Applications Uri: ${_applicationsApiHost(uriQuery)}`)

    const options = {
        hostname: _applicationsApiHost(),
        path: _getSearchPath(uriQuery),
        headers: {
            api_key: '1234'
        }
    }

    logger.log.debug(`Starting reading application information for query '${uriQuery}' from ${options.hostname}`);

    https.get(options, (api) => {

        var responseBody = ''

        // statuskod 404 ska särbehanlads
        api.on('data', function (chunk) {
            responseBody += chunk;
        });

        api.on('end', function () {
            httpResponse.ok(request, response, responseBody, httpResponse.contentTypes.JSON)
        });

        api.on('error', function (e) {
            httpResponse.notFound(request, response, {
                messsage: "Unable to retrieve data."
            }, httpResponse.contentTypes.JSON)
            logger.log.error(`Unable to read application information for query '${uriQuery}' from ${options.hostname}`);
        });

    });

};

/**
 * Module exports
 */
module.exports = {
    applications: _getApplication
};
/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const badGateway = require("../../modules/badGateway");

describe("Bad Gatway\n", function () {
  it("Path '/error5xx.html' should contain a error message.", function () {
    expect(badGateway.error5xx()).to.contain(
      "Sorry, the service is not working as intended"
    );
  });

  it("When env 'PORTILLO_CLUSTER' is set, return it´s value to for the query  'api.kth.se/api/pipeline/v1/search/[active|stage|integral]'.", function () {
    const stage = "stage";
    process.env.PORTILLO_CLUSTER = stage;
    expect(badGateway.privates.getCluster()).to.equal(stage);
    delete process.env.PORTILLO_CLUSTER;
  });

  it("When env 'PORTILLO_CLUSTER' is missing, return 'active' as default value for the api call to 'api.kth.se/api/pipeline/v1/search/active'.", function () {
    expect(badGateway.privates.getCluster()).to.equal("active");
    delete process.env.APPLICATIONS_API_HOST;
  });

  it("When env 'APPLICATIONS_API_HOST' is set, return its value", function () {
    const host = "api.example.com";
    process.env.APPLICATIONS_API_HOST = host;
    expect(badGateway.privates.getApiHost()).to.equal(host);
    delete process.env.APPLICATIONS_API_HOST;
  });

  it("When env 'APPLICATIONS_API_HOST' is missing, return 'api.kth.se' as default host", function () {
    const host = "api.kth.se";
    expect(badGateway.privates.getApiHost()).to.equal(host);
    delete process.env.APPLICATIONS_API_HOST;
  });

  it("The defined PORTILLO_CLUSTER is part of the search endpoint.", function () {
    process.env.APPLICATIONS_API_HOST = "api.example.com";
    process.env.PORTILLO_CLUSTER = "my-cluster";
    const expected = `https://api.example.com/api/pipeline/v1/search/my-cluster/`;
    expect(badGateway.privates.getSearchEndpoint()).to.equal(expected);
    delete process.env.APPLICATIONS_API_HOST;
    delete process.env.PORTILLO_CLUSTER;
  });
});

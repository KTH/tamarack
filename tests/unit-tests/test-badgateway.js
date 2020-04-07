/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const badGateway = require("../../modules/badGateway");
const defaultEnvs = require("../../modules/defaultEnvs");

describe("Bad Gatway\n", function () {
  it("Path '/error5xx.html' should contain a error message.", function () {
    process.env.APPLICATIONS_API_HOST =
      defaultEnvs.DEFAULTS.APPLICATIONS_API_HOST;
    process.env.PORTILLO_CLUSTER = defaultEnvs.DEFAULTS.PORTILLO_CLUSTER;

    expect(badGateway.error5xx()).to.contain(
      "Sorry, the service is not working as intended"
    );

    delete process.env.APPLICATIONS_API_HOST;
    delete process.env.PORTILLO_CLUSTER;
  });

  it("When env 'APPLICATIONS_API_HOST' is missing, return 'api.kth.se' as default host", function () {
    defaultEnvs.set();
    expect(badGateway.privates.getSearchEndpoint()).to.contain(
      defaultEnvs.DEFAULTS.APPLICATIONS_API_HOST
    );
    defaultEnvs.unset();
  });

  it("When env 'PORTILLO_CLUSTER' is missing, return 'active' as default host", function () {
    defaultEnvs.set();
    expect(badGateway.privates.getSearchEndpoint()).to.contain(
      defaultEnvs.DEFAULTS.PORTILLO_CLUSTER
    );
    defaultEnvs.unset();
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

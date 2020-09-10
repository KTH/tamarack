/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const badGateway = require("../../modules/badGateway");
const defaultEnvs = require("@kth/default-envs");
const DEFAULTS = require("../../app");

describe("Bad Gatway\n", function () {
  it("Path '/error5xx.html' should contain a error message.", function () {
    process.env.APPLICATIONS_API_HOST = DEFAULTS.APPLICATIONS_API_HOST;
    process.env.APPLICATIONS_RUNNING_IN = DEFAULTS.APPLICATIONS_RUNNING_IN;

    expect(badGateway.error5xx()).to.contain("Bad Gateway - Tamarack");

    delete process.env.APPLICATIONS_API_HOST;
    delete process.env.APPLICATIONS_RUNNING_IN;
  });

  it(`When env 'APPLICATIONS_API_HOST' is missing, return '${DEFAULTS.APPLICATIONS_API_HOST}' as default host`, function () {
    defaultEnvs.set(DEFAULTS);

    expect(badGateway.privates.getSearchEndpoint()).to.contain(
      DEFAULTS.APPLICATIONS_API_HOST
    );
    defaultEnvs.unset();
  });

  it(`When env 'APPLICATIONS_RUNNING_IN' is missing, return '${DEFAULTS.APPLICATIONS_API_RUNNING_IN}' as part of the search endpoint`, function () {
    defaultEnvs.set(DEFAULTS);
    console.error(badGateway.privates.getSearchEndpoint());
    expect(badGateway.privates.getSearchEndpoint()).to.contain(
      DEFAULTS.APPLICATIONS_API_RUNNING_IN
    );
    defaultEnvs.unset();
  });

  it("The defined APPLICATIONS_RUNNING_IN is part of the search endpoint.", function () {
    process.env.APPLICATIONS_API_HOST = "api.example.com";
    process.env.APPLICATIONS_API_RUNNING_IN = "my-cluster";
    const expected = `https://api.example.com/api/pipeline/v1/search/my-cluster/`;
    expect(badGateway.privates.getSearchEndpoint()).to.equal(expected);
    delete process.env.APPLICATIONS_API_HOST;
    delete process.env.APPLICATIONS_API_RUNNING_IN;
  });
});

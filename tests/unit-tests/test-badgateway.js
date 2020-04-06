/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const badGateway = require("../../modules/badGateway");

describe("Bad Gatway\n", function() {
  it("Path '/error5xx.html' should contain a error message.", function() {
    expect(badGateway.error5xx()).to.contain(
      "Sorry, the service is not working as intended"
    );
  });
});

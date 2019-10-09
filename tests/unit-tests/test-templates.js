/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const templates = require("../../modules/templates");

describe("Template handling", function() {
  it("Path '/' should contain a title.", function() {
    const result = templates.index();
    expect(result).to.contain("KTH Applications");
  });

  it("Path '/error5xx' should contain a message.", function() {
    const result = templates.error5xx();
    expect(result).to.contain("Sorry, the service is not working as intended");
  });

  it("Path '/error404' should contain a message.", function() {
    const result = templates.error404();
    expect(result).to.contain("Page not found");
  });

  it("The header should contain env Application Insights key 'APPINSIGHTS_INSTRUMENTATIONKEY' if set.", function() {
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY = "abcd-1234-efghi";
    const result0 = templates.index();
    expect(result0).to.contain("abcd-1234-efghi");
    const result1 = templates.error404();
    expect(result1).to.contain("abcd-1234-efghi");
    const result2 = templates.error5xx();
    expect(result2).to.contain("abcd-1234-efghi");
    delete process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
  });

  it("Path '/_monitor' should contain 'APPLICATION_STATUS: OK'.", function() {
    const result = templates._monitor();
    expect(result).to.contain("APPLICATION_STATUS: OK");
  });

  it("Path '/_monitor' should contain cluster name specified in env 'PORTILLO_CLUSTER' if set.", function() {
    process.env.PORTILLO_CLUSTER = "stage";
    const result = templates._monitor();
    expect(result).to.contain("stage");
    delete process.env.PORTILLO_CLUSTER;
  });

  it("Path '/_monitor' should contain 'No env PORTILLO_CLUSTER set.' when env 'PORTILLO_CLUSTER' is not set.", function() {
    const result = templates._monitor();
    expect(result).to.contain("No env PORTILLO_CLUSTER set.");
  });

  it("Path '/_clusters' should return 8 IP-numbers.", function() {
    const json = JSON.parse(templates._clusters());
    expect(Object.keys(json).length).to.equal(8);
  });
});

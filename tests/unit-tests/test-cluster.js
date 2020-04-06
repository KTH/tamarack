/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const cluster = require("../../modules/cluster");

describe("Cluster specifics\n", function() {
  it("Path '/_monitor' should contain cluster name specified in env 'PORTILLO_CLUSTER' if set.", function() {
    const stage = "stage";
    process.env.PORTILLO_CLUSTER = stage;
    expect(cluster.getMonitorClusterName()).to.equal("\nCLUSTER: stage");
    delete process.env.PORTILLO_CLUSTER;
  });

  it("Path '/_monitor' should contain 'No env PORTILLO_CLUSTER set.' when env 'PORTILLO_CLUSTER' is not set.", function() {
    expect(cluster.getMonitorClusterName()).to.equal(
      "\nCLUSTER: No env PORTILLO_CLUSTER set."
    );
  });

  it("Path '/_clusters' should return 8 IP-numbers.", function() {
    expect(Object.keys(cluster.getAllClusterIps()).length).to.equal(8);
  });
});

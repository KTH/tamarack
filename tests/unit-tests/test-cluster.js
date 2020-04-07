/* eslint-env mocha */
"use strict";

// Testing libraries
const expect = require("chai").expect;
const cluster = require("../../modules/cluster");
const defaultEnvs = require("../../modules/defaultEnvs");

describe("Cluster specifics\n", function () {
  it("Path '/_monitor' should contain cluster name specified in env 'PORTILLO_CLUSTER' if set.", function () {
    const clusterName = "stage";
    process.env.PORTILLO_CLUSTER = clusterName;
    expect(cluster.getMonitorClusterName()).to.equal(
      `\nCLUSTER: ${clusterName}`
    );
    delete process.env.PORTILLO_CLUSTER;
  });

  it("Path '/_monitor' should contain 'No env PORTILLO_CLUSTER set.' when env 'PORTILLO_CLUSTER' is not set.", function () {
    defaultEnvs.set();
    expect(cluster.getMonitorClusterName()).to.equal(
      `\nCLUSTER: ${defaultEnvs.DEFAULTS.PORTILLO_CLUSTER}`
    );
    defaultEnvs.unset();
  });

  it("When env 'PORTILLO_CLUSTER' is set, use it as cluster name.", function () {
    const clusterName = "stage";
    process.env.PORTILLO_CLUSTER = clusterName;
    expect(cluster.getClusterName()).to.equal(clusterName);
    delete process.env.PORTILLO_CLUSTER;
  });

  it("When env 'PORTILLO_CLUSTER' is missing, return 'active' as default value.", function () {
    defaultEnvs.set();
    expect(cluster.getClusterName()).to.equal(
      defaultEnvs.DEFAULTS.PORTILLO_CLUSTER
    );
    defaultEnvs.unset();
  });

  it("Path '/_clusters' should return 8 IP-numbers.", function () {
    expect(Object.keys(cluster.getAllClusterIps()).length).to.equal(8);
  });
});

/**
 * Get the cluster name that is set by deployment process Aspen as env PORTILLO_CLUSTER.
 * The string is read by NetScaler.
 */
const getClusterName = () => {
  return process.env.PORTILLO_CLUSTER
    ? process.env.PORTILLO_CLUSTER
    : "No env PORTILLO_CLUSTER set.";
};

/**
 * Get the cluster that is set by deployment process Aspen.
 * The string is read by NetScaler.
 */
const getMonitorClusterName = () => {
  return `\nCLUSTER: ${getClusterName()}`;
};

/**
 * Public cluster IP:s.
 */
const getAllClusterIps = () => {
  return {
    "everest-teal": "13.80.31.209",
    "everest-white": "104.46.44.26",
    "everest-yellow": "52.174.92.242",
    "everest-pink": "52.232.79.222",
    "everest-grey": "52.174.238.136",
    "everest-red": "52.166.33.229",
    "everest-blue": "13.81.219.131",
    "everest-black": "13.95.135.124"
  };
};

/**
 * Module exports
 */
module.exports = {
  getClusterName: getClusterName,
  getMonitorClusterName: getMonitorClusterName,
  getAllClusterIps: getAllClusterIps
};

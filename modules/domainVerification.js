const httpResponse = require("@kth/http-responses");

/**
 * If env DOMAIN_OWNERSHIP_VERIFICATION_FILE ends with .txt mine type text/plain is used.
 * Defaults to text/html.
 */
const gethMimeType = () => {
  return process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE.endsWith(".txt")
    ? httpResponse.contentTypes.PLAIN_TEXT
    : httpResponse.contentTypes.HTML;
};

/**
 * Gets the value passed in env DOMAIN_OWNERSHIP_VERIFICATION_FILE
 * to use as path for ownership verification.
 * Example: /97823o4i723bus6dtg34.txt
 */
const getPath = () => {
  return process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE;
};

/**
 * Gets the value passed in env DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT
 * to use as body for ownership verification.
 * Defaults to empty string.
 */
const getContent = () => {
  return process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT;
};

/**
 * Module exports
 */
module.exports = {
  getPath: getPath,
  getContent: getContent,
  gethMimeType: gethMimeType,
};

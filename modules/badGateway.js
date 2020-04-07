"use strict";

const { templates } = require("@kth/basic-html-templates");
const { statusCodes } = require("@kth/http-responses");
const cluster = require("./cluster");

/**
 * Gets the host that runs the api we are calling.
 * Defaults to api.kth.se
 */
const getSearchEndpoint = () => {
  return `https://${
    process.env.APPLICATIONS_API_HOST
  }/api/pipeline/v1/search/${cluster.getClusterName()}/`;
};

/**
 * 502 error page Bad Gateway
 */
const error5xx = function error5xx() {
  return `
    ${templates.header(`Sorry, the service is not working as intended`)}
            
            <script>
                /*
                Gets information from Flottsbro API (https://app.kth.se/pipeline/) to show if the 
                underlying service does not respone.

                The proxy will keep the url unchanged so we can look up what service failed by
                using the path (document.location.pathname). 

                Example:
                curl https://api.kth.se/api/pipeline/v1/search/active/%2Fkth-azure-app%2F

                Will return something like:

                {
                    "_id":"kth-azure-app",
                    "created":1584976202.438375,
                    "applicationName":"kth-azure-app",
                    "cluster":"active",
                    "type":"production",
                    "version":"3.0.471_599381d",
                    "imageName":"kth-azure-app",
                    "applicationUrl":"https://app.kth.se/kth-azure-app/",
                    "applicationPath":"/kth-azure-app/",
                    "monitorUrl":"https://app.kth.se/kth-azure-app/_monitor",
                    "monitorPattern":"active",
                    "importance":"medium",
                    "publicNameSwedish":"Continuous delivery referens applikation",
                    "publicNameEnglish":"Continuous Delivery Reference Application",
                    "descriptionSwedish":"Referens applikation för KTH:s Docker kluster i Azure. Om denna tjänst har diftsörning har hela klustret problem.",
                    "descriptionEnglish":"Reference application for KTHs Docker clusters.",
                    "team":"team-pipeline",
                    "friendlyName":"Continuous Delivery Reference Application",
                    "publicUserDocumentationUrl":"https://confluence.sys.kth.se/confluence/display/EV/Continuous+Delivery+Pipeline+med+Docker"}
                */

                const pathFromProxy = encodeURIComponent(document.location.pathname);
                const url = "${getSearchEndpoint()}" + pathFromProxy;

                fetch(url).then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Could not get application information. Status Code: ' + response.status);
                            return;
                        }

                        response.json().then(function (data) {
                            let importance = data.importance;
                            if (importance != null) {
                                document.getElementById('importance').classList.add("alert-info");

                                let elements = document.getElementsByClassName('publicName');
                                [].slice.call(elements).forEach(function (element) {
                                    element.innerHTML = data.publicNameEnglish;
                                });
                                document.getElementById('importance-' + importance).style.display = "block";
                            }
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Error when getting application information.', err);
                });
            </script>

            <h1><span class="publicName">The service</span> does not work at the moment!</h1>
            
            <div aria-live="polite" role="alert" id="importance" class="alert">

                <div id="importance-high" class="importance">
                <h3>Expect <span class="publicName">the service</span> to be back soon</h3>
                    <span class="importance-marker high"></span> <span class="publicName">This application</span> is classified as beeing of <strong>high importance</strong>.
                    This means that it is actively monitored by operations personal during office hours.
                    Operations are on call until midnight. Action to bring back the service is
                    normally taken within 15 minutes during office hours, and within one hour during On call hours.
                    <br /><br />
                    We are sorry for the inconvenience this might cause you!

                </div>

                <div id="importance-medium" class="importance">
                    <h3>Expect <span class="publicName">the service</span> to be back within 2 hours</h3>
                    <span class="importance-marker medium"></span> <span class="publicName">This service</span> is actively monitored by operations
                    personal during office hours. Action to bring back the service is normally taken within 2 hours. Outages outside
                    office hours are handled the following morning.
                    <br /><br />
                    We are sorry for the inconvenience this might cause you!
                </div>

                <div id="importance-low" class="importance">
                    <h3><span class="publicName">The service</span> should be back within a day</h3>
                    <span class="importance-marker low"></span> Unfortunatelly this service is classified as having a low impact, compared to other services. 
                    There for you can only expect <span class="publicName">the service</span> to work normally within a day.
                    <br><br>
                    Hopefully it will be back sooner :)
                </div>

            </div>

            <div class="team-alerted">
                The team responsible for the service have been alerted.
                For current application status, please see our <a href="https://www.kthstatus.se/">status page</a>.
            </div>

        ${templates.footer(statusCodes.INTERNAL_SERVER_ERROR)}
    `;
};

/**
 * Module exports
 */
module.exports = {
  error5xx: error5xx,
  privates: {
    getSearchEndpoint: getSearchEndpoint,
  },
};

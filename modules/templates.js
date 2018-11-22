"use strict";

const os = require("os");
const about = require("./../config/version");

/**
 * Header html
 */
let header = function header(title) {
    return `<!DOCTYPE html>
    <!-- Served by Tamarack -->
    <html lang="en">
    <title>${title}</title>
    <script>
    var appInsights=window.appInsights||function(a){
        function b(a){c[a]=function(){var b=arguments;c.queue.push(function(){c[a].apply(c,b)})}}var c={config:a},d=document,e=window;setTimeout(function(){var b=d.createElement("script");b.src=a.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",d.getElementsByTagName("script")[0].parentNode.appendChild(b)});try{c.cookie=d.cookie}catch(a){}c.queue=[];for(var f=["Event","Exception","Metric","PageView","Trace","Dependency"];f.length;)b("track"+f.pop());if(b("setAuthenticatedUserContext"),b("clearAuthenticatedUserContext"),b("startTrackEvent"),b("stopTrackEvent"),b("startTrackPage"),b("stopTrackPage"),b("flush"),!a.disableExceptionTracking){f="onerror",b("_"+f);var g=e[f];e[f]=function(a,b,d,e,h){var i=g&&g(a,b,d,e,h);return!0!==i&&c["_"+f](a,b,d,e,h),i}}return c
    }({
        instrumentationKey: "${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}"
    });
    
    window.appInsights=appInsights,appInsights.queue&&0===appInsights.queue.length&&appInsights.trackPageView();
    </script>
    <script src="https://www.kth.se/script/core.js?v=9.4.2"></script>

    <script>
        $(function() {
            var KthToolbarConfig = { locale : "sv_SE" }; (function() { var se = document.createElement('script'); se.type = 'text/javascript'; se.async = true; se.src = 'https://www.kth.se/social/toolbar/widget.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s); })();    
        });
    </script>
    <style>
        body {
            background-color: #e3e5e3;
            margin: 0;
        }
        .wrapper {
            padding: 40px;
            font-family: arial, helvetica;
            box-shadow: 0 0 5px 5px #aeb4ae;
            background-color: #fff;
            transform: rotate(-5deg);
            -moz-transform: rotate(-5deg);
            -webkit-transform: rotate(-5deg);
            padding: 30px 40px 40px;
            max-width: 550px;
            margin: 30px auto;
        }
        h1 {
            font-size: 1.8rem;
            font-family: Georgia Regular, Georgia, garamond pro, garamond, times new roman, times,serif;
            font-weight: 400;
        }
        p {} 
        p.small {
            font-size: 0.6rem;
            color: #666;
        }
    </style>
    </head>
    <body>

    <div class="wrapper">
        <a href="https://www.kth.se/"><img src="https://www.kth.se/polopoly_fs/1.77257!/KTH_Logotyp_RGB_2013-2.svg" alt="KTH Logotype"></a>
        <div id="flottsbro-error-message"></div>
        <div id="flottsbro-info-message"></div>
`;
};

/**
 * Footer html
 */
let footer = function footer(code) {
    return `
            <p>For current application status, please see our <a href="https://www.kthstatus.se/">status page</a>.</p>
            <p class="small">Page served by: Tamarack</p>
            <p class="small">For all you techies, yes that means response code ${code}</p>
        </div>

    </body>
    </html>
`;
};

/**
 * 404 error page
 */
let error404 = function error404() {
    return `
    ${header("404 - Page not found")}
    <h1>No service matched your requested page</h1>
    <p>The service may have been moved or deleted. Please also check the web address for proper spelling and capitalization.</p>
    ${footer("404")}
    `;
};

/**
 * 502 error page Bad Gateway
 */
let error502 = function error502() {
    return `
    ${header("502 - Service did not respond")}
    <h1>The service you requested did not respond!</h1>
    <h2>Big fail. Such sorry. Much sad.</a>
    <p>Tthe service you requested does not work at the moment. </p>
    <p>Please try again later.</p>
    ${footer("502 Bad Gateway")}
    `;
};

/**
 * Index page.
 */
let index = function index() {
    return `
    ${header("KTH Applications")}
    <h1>KTH Applications</h1>
    ${footer("404 Not Found")}
    `;
};

/**
 * robots.txt
 */
let _robotstxt = function robotstxt() {
    return `User-agent: *\nDisallow: /`;
};

/**
 * Monitor page
 */
let _monitor = function _monitor() {
    return `APPLICATION_STATUS: OK\nCLUSTER: ${
    process.env.PORTILLO_CLUSTER ? process.env.PORTILLO_CLUSTER : "No env PORTILLO_CLUSTER set."
  }`;
};

/**
 * About page
 */
let _about = function _about() {
    return `
    ${header("KTH Applications")}
            <p><strong>Docker image:</strong> ${about.dockerName}:${
    about.dockerVersion
  }</p>
            <p><strong>Hostname:</strong> ${os.hostname()}</p>
            <p><strong>Build date:</strong> ${about.jenkinsBuildDate}</p>
        </div>
    </body>
    </html>
    `;
};

/**
 * Module exports
 */
module.exports = {
    index: index,
    error404: error404,
    error502: error502,
    _monitor: _monitor,
    _about: _about,
    robotstxt: _robotstxt
};
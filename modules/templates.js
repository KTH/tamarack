'use strict'

const os = require('os');
const about = require('./../config/version');

/**
 * Header html
 */
let header = function header(title) {
    return `
    
    <!DOCTYPE html>
    <html>
    <meta http-equiv="content-type" content="text/html; charset=windows-1252">
    <title>${title}</title>
    <script type="text/javascript" src="https://www.kth.se/script/core.js?v=9.4.2"></script>

    <script type="text/javascript">
        $(function() {
            var KthToolbarConfig = { locale : "sv_SE" }; (function() { var se = document.createElement('script'); se.type = 'text/javascript'; se.async = true; se.src = 'https://www.kth.se/social/toolbar/widget.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s); })();    
        });
    </script>   
    </head>
    <body style="background-color: #e3e5e3; margin: 0;">

    <div style="padding: 40px; font-family: arial, helvetica; box-shadow: 0 0 5px 5px #aeb4ae;background-color: #fff; transform: rotate(-5deg); -moz-transform: rotate(-5deg); -webkit-transform: rotate(-5deg); padding: 30px 40px 40px; max-width: 550px; margin: 30px auto;">
        <a href="https://www.kth.se/"><img src="https://www.kth.se/polopoly_fs/1.77257!/KTH_Logotyp_RGB_2013-2.svg" border="0"></a>

        <div id="dizin-error-message"></div>
        <div id="dizin-info-message"></div>
`
}

/**
 * Footer html
 */
let footer = function footer(code) {
    return `
            <p>You probably want to go to <a href="https://www.kth.se">www.kth.se</a>.</p>
            <p>For current application status, please see our <a href="https://www.kthstatus.se/">status page</a>.</p>
            <p style="font-size: 0.6rem; color: #666">Page served by: Tamarack</p>
            <p style="font-size: 0.6rem; color: #666">For all you techies, yes that means response code ${code}</p>
        </div>

    </body>
    </html>
`
}

/**
 * 404 error page
 */
let error404 = function error404() {
    return `
    ${header("404 - Page not found")}
    <h1 style="font-size: 1.8rem; font-family: Georgia Regular,Georgia,garamond pro,garamond,times new roman,times,serif; font-weight: 400;">No service matchted your requested page</h1>
    <p>The service may have been moved or deleted. Please also check the web address for proper spelling and capitalization.</p>
    ${footer("404")}
    `;
}

/**
 * Index page.
 */
let index = function index() {
    return `
    ${header("KTH Applications")}
            <h1 style="font-size: 1.8rem; font-family: Georgia Regular,Georgia,garamond pro,garamond,times new roman,times,serif; font-weight: 400;">KTH Applications </h1>
            <p>You probably want to go to <a href="https://www.kth.se">www.kth.se</a>.</p>
            <p>For current application status, please see our <a href="https://www.kthstatus.se/">status page</a>.</p>
            <p style="font-size: 0.6rem; color: #666">Page served by: Tamarack</p>
        </div>

    </body>
    </html>
    `;

}

/**
 * Monitor page
 */
let _monitor = function _monitor() {
    return `APPLICATION_STATUS: OK
CLUSTER: ${(process.env.PORTILLO_CLUSTER ? process.env.PORTILLO_CLUSTER : "")} 
            `
}

/**
 * About page
 */
let _about = function _about() {
    return `
    ${header("KTH Applications")}
            <p><strong>Docker version:</strong> ${about.dockerVersion}</p></
            <p><strong>Docker name:</strong> ${about.dockerName}</p>
            <p><strong>Jenkins build:</strong> ${about.jenkinsBuild}</p>
            <p><strong>Jenkins build date:</strong> ${about.jenkinsBuildDate}</p>
            <p><strong>Git branch:</strong> ${about.gitBranch}</p>
            <p><strong>Git commit:</strong> ${about.gitCommit}</p>
            <p><strong>hostname:</strong> ${os.hostname()}</p>
        </div>
    </body>
    </html>
    `
}

/**
 * Module exports
 */
module.exports = {
    index: index,
    error404: error404,
    _monitor: _monitor,
    _about: _about
  }
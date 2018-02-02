const express = require('express');
const app = express();
const log = require('kth-node-log')
const templates = require('./modules/templates')
const about = require('./config/version');
const os = require('os');
const packageFile = require('./package.json')

log.init({
    name: packageFile.name,
    app: packageFile.name,
    env: 'dev',
    level: 'DEBUG',
    console: false,
    stdout: true,
    src: true
})

app.get('/', function (req, res) {
    res.status(200).send(templates.index())
});

app.get('/_about', function (req, res) {
    res.status(200).send(templates._about())
});

app.get('/_monitor', function (req, res) {
    res.set("Content-Type", "text/plain");
    res.status(200).send(templates._monitor())
});

app.use(function (req, res) {
    res.status(404).send(templates.error404())
});

/**
 * Start server on package.json port or default to 3000.
 */
const port = (packageFile.port ? packageFile.port : 80)
app.listen(port, function () {
    console.log(`${packageFile.name} running on port ${port} on ${os.hostname()}`);
});

/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path");
var express = require("express");
var app = express();
var pkg = require('../package.json');

app.use(express.compress());
// Render views with Jade
app.set('views', __dirname + '/assets/views');
app.set('view engine', 'jade');

// Base path goes to the list of tools
app.get("/", function (req, res) {
    res.sendfile(__dirname + "/index.html");
});
// Configure the options for Aria Tester
app.get("/test/options", function (req, res) {
    res.sendfile(path.normalize(__dirname + "/../test/options.html"));
});
// Aria Tester - minified
app.get("/test", function (req, res) {
    res.render('test', {
        urls : {
            framework : "/aria-templates/aria/ariatemplates-" + pkg.version + ".js",
            skin : "/aria-templates/aria/css/atskin-" + pkg.version + ".js"
        },
        dev : false
    });
});
// Aria Tester - non minified
app.get("/test/dev", function (req, res) {
    res.render('test', {
        urls : {
            framework : "/aria-templates/dev/aria/ariatemplates-bootstrap.js",
            skin : "/aria-templates/dev/aria/css/atskin.js"
        },
        dev : true
    });
});
// Playground area
app.get("/playground/options", function (req, res) {
    res.sendfile(path.normalize(__dirname + "/assets/playground.html"));
});
app.get("/playground", function (req, res) {
    res.render('playground', {
        urls : {
            framework : "/aria-templates/aria/ariatemplates-" + pkg.version + ".js",
            skin : "/aria-templates/aria/css/atskin-" + pkg.version + ".js"
        },
        dev : false,
        path : req.query.path,
        model : req.query.model
    });
});
app.get("/playground/dev", function (req, res) {
    res.render('playground', {
        urls : {
            framework : "/aria-templates/dev/aria/ariatemplates-bootstrap.js",
            skin : "/aria-templates/dev/aria/css/atskin.js"
        },
        dev : true,
        path : req.query.path,
        model : req.query.model
    });
});
app.get("/aria-templates/dev/aria/ariatemplates-bootstrap.js", function (req, res) {
    res.sendfile(path.normalize(__dirname + "/../build/target/bootstrap/aria/ariatemplates-" + pkg.version + ".js"));
});
app.get("/aria-templates/dev/aria/css/atskin.js", function (req, res) {
    res.sendfile(path.normalize(__dirname + "/../build/target/bootstrap/aria/css/atskin-" + pkg.version + ".js"));
});
// Static CSS files for views and tools
app.use("/css", express.static(__dirname + "/assets/css"));
// Non minified version points to bootstrap folder
app.use("/aria-templates/dev", express.static(__dirname + "/../build/target/bootstrap"));
// Minified version points to standard build (npm install)
app.use("/aria-templates", express.static(__dirname + "/../build/target/production"));
// Test classpath redirects to test folder
app.all(/^\/aria-templates\/test\/(.*)$/, function (req, res, next) {
    var file = path.normalize(__dirname + "/../test/" + req.params[0]);
    res.sendfile(file);
});

// Default to 8080 if we're not using npm
var port = process.env.npm_package_config_port || 8080;
var server = app.listen(port);

server.on("listening", serverStarted);
server.on("error", function () {
    // Retry on a random port
    console.error("Configured port is not available, using a random address");
    server = app.listen(0);
    server.on("listening", serverStarted);
});

function serverStarted () {
    console.log("Server started on http://localhost:" + server.address().port);
}

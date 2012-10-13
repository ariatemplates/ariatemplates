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
			framework : "/aria-templates/aria/ariatemplates-" + process.env.npm_package_version + ".js",
			skin : "/aria-templates/aria/css/atskin-" + process.env.npm_package_version + ".js"
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
// Rename bootstrap prefixing with ariatemplates- this fixes runIsolated in dev mode
app.get("/aria-templates/dev/aria/ariatemplates-bootstrap.js", function (req, res) {
    res.sendfile(path.normalize(__dirname + "/../src/aria/bootstrap.js"));
});
// Static CSS files for views and tools
app.use("/css", express.static(__dirname + "/assets/css"));
// Non minified version points to src folder
app.use("/aria-templates/dev", express.static(__dirname + "/../src"));
// Minified version points to standard build (npm install)
app.use("/aria-templates", express.static(__dirname + "/../build/releases/standard/target"));
// Test classpath redirects to test folder
app.all(/^\/aria-templates\/test\/(.*)$/, function (req, res, next) {
    var file = path.normalize(__dirname + "/../test/" + req.params[0]);
    res.sendfile(file);
});

console.log("Server started on http://localhost:" + process.env.npm_package_config_port);
app.listen(process.env.npm_package_config_port);
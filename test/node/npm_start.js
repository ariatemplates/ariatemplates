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

var spawn = require("child_process").spawn;
var path = require("path");
var assert = require("assert");
var http = require("http");

// This test check that npm start loads correctly a web server configured to serve Aria Tests
// It just checks that some files are served properly, hopefully the tester then works
// This test must run after the build
describe("npm start", function () {
    var npm, port;

    function get (url, callback) {
        var response = "";

        http.get(url, function (res) {
            if (res.statusCode === 200) {
                res.on("data", function (chunk) {
                    response += chunk;
                });
                res.on("end", function () {
                    process.nextTick(callback.bind(null, response));
                });
            } else {
                response = false;
                process.nextTick(callback.bind(null, response));
            }
        }).on("error", function (error) {
            response = false;
            process.nextTick(callback.bind(null, response));
        });
    }

    before(function (callback) {
        npm = spawn("node", ["scripts/server.js"], {
            cwd : path.join(__dirname, "../../"),
            stdio : "pipe"
        });
        npm.stdout.on("data", function (data) {
            var info = data.toString().match(/Server started on \S+:(\d+)/i);
            if (info) {
                port = parseInt(info[1], 10);
                callback();
            }
        });
    });

    it("should start the server", function (callback) {
        assert.ok(port);

        get("http://localhost:" + port, function (response) {
            assert.ok(response, "Expecting to have a server response");
            assert.ok(/run unit tests/gi.test(response), "Expecting to have a run test button");
            callback();
        });
    });


    it("should serve the test runner", function (callback) {
        get("http://localhost:" + port + "/test", function (response) {
            assert.ok(response, "Expecting to have a server response");
            assert.ok(/Aria\.loadTemplate/gi.test(response), "Expecting to load a template");
            callback();
        });
    });

    it("should serve Aria Templates bootstrap file", function (callback) {
        var url = "http://localhost:" + port + "/aria-templates/dev/aria/ariatemplates-bootstrap.js";
        get(url, function (response) {
            assert.ok(response, "Expecting to have a server response");
            assert.ok(/rootFolderPath/gi.test(response), "Expecting to receive the bootstrap");
            callback();
        });
    });

    it("should serve Aria Templates bootstrap file", function (callback) {
        var url = "http://localhost:" + port + "/aria-templates/aria/ariatemplates-" + process.env.npm_package_version + ".js";
        get(url, function (response) {
            assert.ok(response, "Expecting to have a server response");
            assert.ok(/rootFolderPath/gi.test(response), "Expecting to receive the bootstrap");
            callback();
        });
    });

    after(function (callback) {
        npm.on("exit", function () {
            callback();
        });
        npm.kill();
    });
});

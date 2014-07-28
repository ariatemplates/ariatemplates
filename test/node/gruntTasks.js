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
var assert = require("assert");
var path = require("path");
var spawn = require("child_process").spawn;
var fs = require("fs");

var getPath = function (end) {
    return path.join(__dirname, end);
};

var testProjectPath = getPath("../nodeTestResources/testProject/");

var testBuild = function (index, callback) {
    var gruntBuild = spawn("node", [getPath("../../build/grunt-cli.js"), "--gruntfile",
            testProjectPath + "gruntfiles/Gruntfile" + index + ".js"]);

    gruntBuild.on("exit", function (exitCode) {
        assert.strictEqual(exitCode, 0, "The packaging failed");
        var attesterProcess = spawn("node", [getPath("../../node_modules/attester/bin/attester.js"),
                testProjectPath + "attester/attester" + index + ".yml", "--phantomjs-instances", "1"]);

        attesterProcess.on("exit", function (exitCode) {
            assert.strictEqual(exitCode, 0, "The test campaign on the packaged code failed");
            callback();
        });

    });

};

describe("easypackage grunt task", function () {
    this.timeout(40000);
    it("should re-package Aria Templates correcly", function (callback) {
        var gruntBuild = spawn("node", [getPath("../../build/grunt-cli.js"), "--gruntfile",
                testProjectPath + "gruntfiles/Gruntfile.js"]);

        gruntBuild.on("exit", function (exitCode) {
            assert.strictEqual(exitCode, 0, "The re-packaging of the framework failed");
            // test that the custom packages (in which there is nothing for aria/html/*) have been taken into account
            try {
                assert.ok(fs.statSync(testProjectPath + "target/fwk/aria/html").isDirectory(), "Custom packaging has not been taken into account");
            } catch (ex) {
                assert.ok(false, "Custom packaging has not been taken into account");
            }
            callback();
        });

    });

    it("should package the application correctly - first config", function (callback) {
        testBuild(1, function () {
            var directory = fs.readdirSync(testProjectPath + "target/one");
            var packageName = "plugins-";
            for (var i = 0; i < directory.length; i++) {
                if (directory[i].indexOf(packageName) != -1) {
                    packageName = directory[i];
                    break;
                }
            }

            var packageContent = fs.readFileSync(testProjectPath + "target/one/" + packageName, 'utf8');
            assert.ok(/abcdefg/.test(packageContent), "License has not been added");
            assert.ok(/require\("ariatemplates\/Aria"\)/.test(packageContent), "Conversion to noderJS syntax missing");
            assert.ok(!/\{Template/.test(packageContent), "Template compilation missing");
            callback();
        });
    });
    it("should package the application correctly - second config", function (callback) {
        testBuild(2, function () {

            // Retrieving this file without error implictly checks that the hash:false has been taken into account
            var packageContent = fs.readFileSync(testProjectPath + "target/two/plugins.js", 'utf8');
            assert.ok(!/require\("ariatemplates\/Aria"\)/.test(packageContent), "Conversion to noderJS syntax has been done");
            assert.ok(/\{Template/.test(packageContent), "Template compilation has been done");
            assert.ok(!/Apache\sLicense/.test(packageContent), "stripBanner option didn't work");

            var flag;
            try {
                fs.readFileSync(testProjectPath + "target/two/atplugins/lightWidgets/DropDown.js", 'utf8');
                flag = false;
            } catch (ex) {
                flag = true;
            }
            assert.ok(flag, "Automatic dependency inclusion did not work");

            try {
                fs.readFileSync(testProjectPath + "target/two/app.js", 'utf8');
                flag = true;
            } catch (ex) {
                flag = false;
            }
            assert.ok(flag, "The second target of the task was not executed correctly");
            callback();
        });
    });

});

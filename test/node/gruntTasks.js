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
var fs = require("fs");
var vm = require("vm");
var fork = require("./util/fork");

var getPath = function (end) {
    return path.join(__dirname, end);
};

var testProjectPath = getPath("../nodeTestResources/testProject/");
var srcPath = getPath("../../src/");

var testBuild = function (index, callback) {
    var gruntBuild = fork(getPath("../../build/grunt-cli.js"), ["--color", "--gruntfile", testProjectPath + "gruntfiles/Gruntfile" + index + ".js"]);

    gruntBuild.on("exit", function (exitCode) {
        assert.strictEqual(exitCode, 0, "The packaging failed");
        var attesterProcess = fork(getPath("../../node_modules/attester/bin/attester.js"), ["--colors", testProjectPath + "attester/attester" + index + ".yml", "--launcher-config", getPath("../../test/ciLauncher.yml")]);

        attesterProcess.on("exit", function (exitCode) {
            assert.strictEqual(exitCode, 0, "The test campaign on the packaged code failed");
            callback();
        });

    });

};

var verifyIOswfFile = function () {
    var originalFile = fs.readFileSync(srcPath + "aria/resources/handlers/IO.swf", "hex");
    var outputFile, outputFolderPath = testProjectPath + "target/fwk/aria/resources/handlers";
    var containerDir = fs.readdirSync(outputFolderPath);
    containerDir.forEach(function (fileName) {
        if (/\.swf$/.test(fileName)) {
            outputFile = fs.readFileSync(outputFolderPath + "/" + fileName, "hex");
        }
    });

    return originalFile == outputFile;

};

var verifyImgFiles = function (outputFolder) {
    var outputFolderPath = testProjectPath + "target/" + outputFolder + "/app/css/img";
    var containerDir = fs.readdirSync(outputFolderPath);
    var checks = 0;
    containerDir.forEach(function (fileName) {
        checks++;
        var outputFile = fs.readFileSync(outputFolderPath + "/" + fileName, "hex");
        var originalFile = fs.readFileSync(testProjectPath + "src/app/css/img/" + fileName, "hex");
        assert.strictEqual(outputFile, originalFile, fileName + " was modified by the build.");
    });
    assert.strictEqual(checks, 2, "Wrong number of files in app/css/img");
};

var verifyBeanFile = function (outputFolder, expectsCompiled) {
    try {
        var fileName = testProjectPath + "target/" + outputFolder + "/app/SampleBean.js";
        var fileContent = fs.readFileSync(fileName, 'utf8');
        var beanDefinition = null;
        var beanDefinitionsCalls = 0;
        var definedModule = {};
        var beanDefinitionsResult = {};
        var Aria = {
            beanDefinitions: function (arg) {
                beanDefinitionsCalls++;
                beanDefinition = arg;
                return beanDefinitionsResult;
            }
        };
        vm.runInNewContext(fileContent, {
            Aria: Aria,
            module: definedModule,
            require: function (file) {
                return Aria;
            }
        }, {
            filename: fileName
        });
        assert.equal(beanDefinitionsCalls, 1, "SampleBean.js should have called Aria.beanDefinitions once.");
        if (expectsCompiled) {
            assert.strictEqual(beanDefinition.$beans, undefined, "SampleBean.js is not compiled correctly: $beans is present.");
            assert.strictEqual(definedModule.exports, beanDefinitionsResult, "SampleBean.js is not compiled correctly: module.exports is not defined correctly.");
            assert.notStrictEqual(beanDefinition.$compiled, undefined, "SampleBean.js is not compiled correctly: $compiled is undefined.");
        } else {
            assert.notStrictEqual(beanDefinition.$beans, undefined, "SampleBean.js problem: $beans is undefined.");
            assert.strictEqual(beanDefinition.$compiled, undefined, "SampleBean.js problem: $compiled is defined.");
        }
    } catch (ex) {
        assert.ok(false, "Failed to execute SampleBean.js: " + ex);
    }
};

describe("easypackage grunt task", function () {
    this.timeout(120000);
    it("should re-package Aria Templates correcly", function (callback) {
        var gruntBuild = fork(getPath("../../build/grunt-cli.js"), ["--color", "--gruntfile", testProjectPath + "gruntfiles/Gruntfile.js"]);

        gruntBuild.on("exit", function (exitCode) {
            assert.strictEqual(exitCode, 0, "The re-packaging of the framework failed");
            // test that the custom packages (in which there is nothing for aria/html/*) have been taken into account
            try {
                assert.ok(fs.statSync(testProjectPath + "target/fwk/aria/html").isDirectory(), "Custom packaging has not been taken into account");
            } catch (ex) {
                assert.ok(false, "Custom packaging has not been taken into account");
            }

            try {
                assert.ok(verifyIOswfFile(), "IO.swf file has been modified by the build");
            } catch (ex) {
                assert.ok(false, "IO.swf file has been modified by the build");
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
            assert.ok(/require\(\\"ariatemplates\/Aria\\"\)/.test(packageContent), "Conversion to noderJS syntax missing");
            assert.ok(!/\{Template/.test(packageContent), "Template compilation missing");

            verifyImgFiles("one");

            callback();
        });
    });
    it("should package the application correctly - second config", function (callback) {
        testBuild(2, function () {

            // Retrieving this file without error implictly checks that the hash:false has been taken into account
            var packageContent = fs.readFileSync(testProjectPath + "target/two/plugins.js", 'utf8');
            assert.ok(!/require\(\\"ariatemplates\/Aria\\"\)/.test(packageContent), "Conversion to noderJS syntax has been done");
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

            verifyImgFiles("two");

            callback();
        });
    });
    it("should build the application correctly - third config", function (callback) {
        testBuild(3, function () {
            // Checks that the .tpl.css file is present and was compiled
            var AutocompleteStyleTplCss = fs.readFileSync(testProjectPath + "target/three/app/css/AutocompleteStyle.tpl.css", 'utf8');
            assert.ok(/abcdefg-license/.test(AutocompleteStyleTplCss), "License has not been added");
            assert.ok(!/\{Template/.test(AutocompleteStyleTplCss), "Template compilation has not been done");

            var flag;
            try {
                fs.readFileSync(testProjectPath + "target/three/app/css/CalendarSkin.js", 'utf8');
                flag = false;
            } catch (ex) {
                flag = true;
            }
            assert.ok(flag, "Automatic dependency inclusion did not work");

            var calendarPkg = fs.readFileSync(testProjectPath + "target/three/app/css/calendar.js", 'utf8');
            assert.ok(/loadFileContent\("app\/css\/CalendarSkin\.js","/.test(calendarPkg), "Package app/css/calendar.js does not include CalendarSkin.js");
            assert.ok(/loadFileContent\("app\/css\/CalendarStyle\.tpl\.css","/.test(calendarPkg), "Package app/css/calendar.js does not include CalendarStyle.tpl.css");
            verifyImgFiles("three");
            verifyBeanFile("three", false);
            callback();
        });
    });
    it("should compile beans correctly - fourth config", function (callback) {
        testBuild(4, function () {
            verifyBeanFile("beans/app", true);
            callback();
        });
    });
});

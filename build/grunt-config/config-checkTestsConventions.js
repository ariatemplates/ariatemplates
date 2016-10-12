/*
 * Copyright 2016 Amadeus s.a.s.
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

/**
 * Configuration for at-diff to check test files.
 * @param {Object} grunt
 */
module.exports = function (grunt) {
    var jsonFilePath = "test/target/jsfiles.json";

    var knownSimpleTestCases = [
        // Those are tests which are known to be test cases but cannot be detected as such automatically
        // by just looking at the parent class:
        "aria/jsunit/TestCase.js", // the root test case
        "test/aria/core/prototypefn/PrototypeFnTestCase.js" // has its prototype defined as a function (not supported by at-diff)
    ];
    var knownJawsTestCases = [
        // Those are tests which are known to be Jaws test cases but cannot be detected as such automatically
        // by just looking at the parent class:
        "aria/jsunit/JawsTestCase.js" // the root Jaws test case
    ];
    var knownRobotTestCases = [
        // Those are tests which are known to be robot test cases but cannot be detected as such automatically
        // by just looking at the parent class:
        "aria/jsunit/RobotTestCase.js", // the root robot test case
        "test/EnhancedRobotBase.js" // has its prototype defined outside of Aria.classDefinition (in a variable)
    ];
    var allowedParseError = [
        // Those are files which are allowed not to be parsed successfully by at-diff:
        "aria/core/log/DefaultAppender.js", // prototype defined as an expression (not supported by at-diff)
        "aria/utils/json/JsonSerializer.js", // prototype defined as a function (not supported by at-diff)
        "test/aria/core/prototypefn/*.js", // prototype defined as a function (not supported by at-diff)
        "test/EnhancedRobotBase.js", // has its prototype defined as a variable outside of Aria.classDefinition
        "test/aria/templates/issue400/AlreadyCompiledTpl*.tpl", // already compiled templates are not supported by at-diff
        "test/aria/widgetLibs/sampleWidget/WidgetLibsTestCaseTpl.tpl", // uses the libB widget library which is expected to be defined globally

        // those files have syntax errors (for test purposes):
        "test/aria/templates/templateSyntaxError/*.tpl",
        "test/aria/templates/mock/CSSTemplate.tpl",
        "test/aria/templates/mock/CSSTemplateIssue721.tpl",
        "test/aria/templates/mock/CSSTemplatePrefixed.tpl",
        "test/aria/templates/reloadResources/ExternalResourceErr.js",
        "test/aria/templates/section/asContainer/SimpleTemplateForErrorLogging.tpl",
        "test/aria/templates/section/asContainer/TestMacro.tml",
        "test/aria/templates/section/asContainer/TestTemplate.tpl",
        "test/aria/templates/test/TemplateKO_Runtime.tpl",
        "test/aria/templates/test/UnloadTplError.tpl",
        "test/aria/templates/test/error/Resource.js",
        "test/aria/test/ClassAbis.js",
        "test/aria/widgets/container/dialog/configContainer/DialogTestCaseTpl.tpl"
    ];

    grunt.config.set('at-diff-parse.test', {
        options: {
            jsonOutput: jsonFilePath
        },
        files: [
            {src: ["aria/**", "!aria/node.js"], cwd: "src", filter: 'isFile'},
            {src: ["test/**", "!test/target/**", "!test/nodeTestResources/**"], cwd: "", filter: 'isFile'}
        ]
    });

    grunt.registerTask('check-test-conventions-postprocess', function () {
        var files = JSON.parse(grunt.file.read(jsonFilePath)).files;
        var fileNames = Object.keys(files);
        var processedFiles = Object.create(null);
        var inTestFolderRegExp = /^test\//;

        function processFile(fileName) {
            fileName = fileName.replace(/^ariatemplates\//, "aria/");
            var response = processedFiles[fileName];
            if (!response) {
                processedFiles[fileName] = response = {
                    fileName: fileName,
                    processing: true,
                    isSimpleTestCase: false,
                    isJawsTestCase: false,
                    isRobotTestCase: false,
                    isTestSuite: false,
                    childClasses: []
                };
                var parseInfo = response.parseInfo = files[fileName];
                if (parseInfo && parseInfo.type == "error" && !grunt.file.isMatch(allowedParseError, [fileName])) {
                    grunt.log.error(fileName.yellow + " could not be properly parsed by at-diff: " + parseInfo.content.error.yellow);
                }
                if (knownSimpleTestCases.indexOf(fileName) > -1) {
                    response.isSimpleTestCase = true;
                } else if (knownJawsTestCases.indexOf(fileName) > -1) {
                    response.isJawsTestCase = true;
                } else if (knownRobotTestCases.indexOf(fileName) > -1) {
                    response.isRobotTestCase = true;
                } else if (fileName == "aria/jsunit/TestSuite.js") {
                    response.isTestSuite = true;
                } else if (parseInfo && parseInfo.type == "classDefinition" && parseInfo.content.parent) {
                    var parentResponse = processFile(parseInfo.content.parent);
                    if (parentResponse.processing) {
                        grunt.log.error(fileName.yellow + " contains recursion in the hierarchy of parents.");
                    }
                    response.parent = parentResponse;
                    if (!response.parent.parseInfo) {
                        grunt.log.error(parseInfo.content.parent.yellow + " parent of " + fileName.yellow + " could not be found!");
                    }
                    parentResponse.childClasses.push(response);
                    response.isSimpleTestCase = parentResponse.isSimpleTestCase;
                    response.isJawsTestCase = parentResponse.isJawsTestCase;
                    response.isRobotTestCase = parentResponse.isRobotTestCase;
                    response.isTestSuite = parentResponse.isTestSuite;
                }
                response.processing = false;
            }
            return response;
        }

        var nameRegExp = /(Jaws|Robot)?(TestCase|Base|Suite)\.js$/;
        function inferInfoFromFileName(fileName) {
            var match = nameRegExp.exec(fileName);
            if (match) {
                var isTestSuite = match[2] == "Suite";
                var isTestCase = !isTestSuite;
                return {
                    isSimpleTestCase: isTestCase && !match[1],
                    isJawsTestCase: isTestCase && match[1] == "Jaws",
                    isRobotTestCase: isTestCase && match[1] == "Robot",
                    isTestSuite: isTestSuite,
                    hasChildClasses: match[2] == "Base"
                };
            } else {
                return {
                    isSimpleTestCase: false,
                    isJawsTestCase: false,
                    isRobotTestCase: false,
                    isTestSuite: false
                };
            }
        }

        function checkProperty(propertyName, realInfo, infoFromName) {
            var realInfoValue = realInfo[propertyName];
            var infoFromNameValue = infoFromName[propertyName];
            if (realInfoValue !== infoFromNameValue) {
                grunt.log.error(realInfo.fileName.yellow + " does not respect the naming convention: " + (realInfoValue ? "" : "!") + propertyName.yellow);
            }
        }

        function checkName(fileInfo) {
            var infoFromName = inferInfoFromFileName(fileInfo.fileName);
            fileInfo.hasChildClasses = fileInfo.childClasses.length > 0;
            checkProperty("isSimpleTestCase", fileInfo, infoFromName);
            checkProperty("isJawsTestCase", fileInfo, infoFromName);
            checkProperty("isRobotTestCase", fileInfo, infoFromName);
            checkProperty("isTestSuite", fileInfo, infoFromName);
            if (infoFromName.hasChildClasses != null) {
                checkProperty("hasChildClasses", fileInfo, infoFromName);
            }
        }

        fileNames.forEach(processFile);
        fileNames.forEach(function (fileName) {
            if (!inTestFolderRegExp.test(fileName)) {
                return;
            }
            checkName(processedFiles[fileName]);
        });

        if (this.errorCount > 0) {
            throw new Error(this.errorCount + " error(s) while checking tests conventions.");
        }
    });

    grunt.registerTask('checkTestsConventions', ['at-diff-parse:test', 'check-test-conventions-postprocess']);
};

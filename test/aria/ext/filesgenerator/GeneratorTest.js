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
var Aria = require("ariatemplates/Aria");
var generator = require("ariatemplates/ext/filesgenerator/Generator");
var ariaUtilsType = require("ariatemplates/utils/Type");
require("ariatemplates/modules/urlService/IUrlService");
var ariaTemplatesModuleCtrlFactory = require("ariatemplates/templates/ModuleCtrlFactory");
var ariaCoreDownloadMgr = require("ariatemplates/core/DownloadMgr");

/**
 * Test case for aria.ext.filesgenerator.Generator
 */
module.exports = Aria.classDefinition({
    $classpath : "test.aria.ext.filesgenerator.GeneratorTest",
    $extends : require("ariatemplates/jsunit/TestCase"),
    $prototype : {
        /**
         * Test that a generated class indeed can be evaluated as such and instantiated
         */
        testGenerateEvalAndInstantiateClass : function () {
            var fileInfo = generator.generateFile(generator.TYPE_CLASS, {
                $classpath : "test.my.great.test.ClassDefinition"
            });

            this.assertEquals(fileInfo.type, "class", "Wrong type of file was generated");
            this.assertEquals(fileInfo.classpath, "test.my.great.test.ClassDefinition", "Incorrect classpath parsed");

            try {
                eval(fileInfo.content);
            } catch (e) {
                this.assertTrue(false, "Eval'ing the generated class failed");
            }

            var o = new test.my.great.test.ClassDefinition();

            this.assertTrue(typeof o == "object", "Instantiating generated class didn't produce an object");
            this.assertTrue(ariaUtilsType.isInstanceOf(o, "test.my.great.test.ClassDefinition"), "Instantiated object is not of the correct type");

            Aria.dispose("test.my.great.test.ClassDefinition");
            o.$dispose();
        },

        /**
         * Test that an interface can be generated and evaluated
         */
        testGenerateAndEvalInterface : function () {
            var fileInfo = generator.generateFile(generator.TYPE_INTERFACE, {
                $classpath : "my.great.test.InterfaceDefinition",
                $extends : "aria.modules.urlService.IUrlService"
            });

            this.assertEquals(fileInfo.type, "interface", "Wrong type of file was generated");
            this.assertEquals(fileInfo.classpath, "my.great.test.InterfaceDefinition", "Incorrect classpath parsed");

            var logicalPath = Aria.getLogicalPath(fileInfo.classpath, ".js", true);
            ariaCoreDownloadMgr.loadFileContent(logicalPath, fileInfo.content);
            try {
                require(logicalPath);
            } catch (e) {
                this.assertTrue(false, "Eval'ing the generated interface failed");
            }

            Aria.dispose("my.great.test.InterfaceDefinition");
        },

        /**
         * Test and instantiate a module controller class
         */
        testAsyncModuleControllerClass : function () {
            var test = [{
                        "type" : "moduleControllerInterface",
                        "classpath" : "aria.my.great.test.IModuleDefinition",
                        "logicalpath" : "aria/my/great/test/IModuleDefinition.js"
                    }, {
                        "type" : "moduleController",
                        "classpath" : "aria.my.great.test.ModuleDefinition",
                        "logicalpath" : "aria/my/great/test/ModuleDefinition.js"
                    }, {
                        "type" : "flowControllerInterface",
                        "classpath" : "aria.my.great.test.IModuleDefinitionFlow",
                        "logicalpath" : "aria/my/great/test/IModuleDefinitionFlow.js"
                    }, {
                        "type" : "flowController",
                        "classpath" : "aria.my.great.test.ModuleDefinitionFlow",
                        "logicalpath" : "aria/my/great/test/ModuleDefinitionFlow.js"
                    }];

            var fileInfo = generator.generateModuleCtrl("aria.my.great.test.ModuleDefinition", true);
            for (var i = 0; i < fileInfo.length; i++) {
                this.assertEquals(fileInfo[i].type, test[i].type, "Incorrect type of file was generated.");
                this.assertEquals(fileInfo[i].classpath, test[i].classpath, "Incorrect classpath parsed");
                ariaCoreDownloadMgr.loadFileContent(test[i].logicalpath, fileInfo[i].content);
            }

            ariaTemplatesModuleCtrlFactory.createModuleCtrl({
                classpath : "aria.my.great.test.ModuleDefinition"
            }, {
                fn : this.moduleControllerLoaded,
                scope : this
            }, false);
        },

        moduleControllerLoaded : function (res) {
            this.assertTrue(ariaUtilsType.isFunction(aria.my.great.test.IModuleDefinition));
            this.assertTrue(ariaUtilsType.isFunction(aria.my.great.test.IModuleDefinitionFlow));
            this.assertTrue(ariaUtilsType.isFunction(aria.my.great.test.ModuleDefinitionFlow));
            this.assertTrue(ariaUtilsType.isFunction(aria.my.great.test.ModuleDefinition));
            this.assertTrue(typeof res.moduleCtrl == "object", "Instantiating generated Module didn't produce an object");
            this.assertTrue(ariaUtilsType.isInstanceOf(res.moduleCtrlPrivate, "aria.my.great.test.ModuleDefinition"), "Instantiated object is not of the correct type");
            this.assertTrue(ariaUtilsType.isInstanceOf(res.moduleCtrl, "aria.my.great.test.IModuleDefinition"), "Instantiated object is not of the correct type");
            res.moduleCtrlPrivate.$dispose();
            Aria.dispose("aria.my.great.test.ModuleDefinition");
            Aria.dispose("aria.my.great.test.IModuleDefinition");
            Aria.dispose("aria.my.great.test.IModuleDefinitionFlow");
            Aria.dispose("aria.my.great.test.ModuleDefinitionFlow");
            this.notifyTestEnd("testAsyncModuleControllerClass");
        },

        /**
         * Test that a module controller can be generated correctly, with flow and interfaces, with right names
         */
        testModuleControllerGeneratedWithFlowWithRightNames : function () {
            var fileInfo = generator.generateModuleCtrl("amadeus.booking.hotel.HotelModule", true);

            this.assertEquals(fileInfo.length, 4, "The incorrect number of files were generated. There should be the Ctrl, ICtrl, Flow, IFlow");

            var idx = 0;
            for (var i = 0; i < 4; i++) {
                if (fileInfo[i].type == generator.TYPE_FLOWCONTROLLERINTERFACE) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.IHotelModuleFlow");
                }
                if (fileInfo[i].type == generator.TYPE_MODULECONTROLLERINTERFACE) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.IHotelModule");
                }
                if (fileInfo[i].type == generator.TYPE_MODULECONTROLLER) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.HotelModule");
                }
                if (fileInfo[i].type == generator.TYPE_FLOWCONTROLLER) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.HotelModuleFlow");
                }
            }

            this.assertEquals(idx, 4, "The right number of files were generated, but not the right type of files. There should be the Ctrl, ICtrl, Flow, IFlow");
        },

        /**
         * Test that a template can be generated correctly, with script and style, with the right names
         */
        testHtmlTemplateGeneratedWithScriptWithRightNames : function () {
            var fileInfo = generator.generateHtmlTemplate("amadeus.booking.hotel.Search", true, true);

            this.assertEquals(fileInfo.length, 3, "The incorrect number of files were generated. There should be the template, script, css");

            var idx = 0;
            for (var i = 0; i < 3; i++) {
                if (fileInfo[i].type == generator.TYPE_HTMLTEMPLATE) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.Search");
                }
                if (fileInfo[i].type == generator.TYPE_CSSTEMPLATE) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.SearchStyle");
                }
                if (fileInfo[i].type == generator.TYPE_TEMPLATESCRIPT) {
                    idx++;
                    this.assertEquals(fileInfo[i].classpath, "amadeus.booking.hotel.SearchScript");
                }
            }

            this.assertEquals(idx, 3, "The right number of files were generated, but not the right type of files. There should be the template, script, css");
        },

        /**
         * Test content feature for generateHtmlTemplate method
         */
        testHtmlTemplateGeneratedWithContent : function () {
            var myClasspath = generator.getUniqueClasspathIn("my.package");
            var strPackage = myClasspath.substr(0, 10);
            var className = myClasspath.substr(11);
            var content = "{macro main()}my content{/macro}";

            this.assertTrue(strPackage === "my.package", "Generated classpath is in wrong package");
            this.assertTrue(/^[A-Z]\w*$/.test(className) === true, "Generated class name is not a class name.");
            var fileInfo = generator.generateHtmlTemplate(myClasspath, false, false, content);

            this.assertEquals(fileInfo.length, 1, "The incorrect number of files were generated. There should be only the template");

            // content should be available in result template
            this.assertTrue(/\{macro main\(\)\}my content\{\/macro\}/.test(fileInfo[0].content), "Content is not available in generated template");
            // there should be only one main macro
            this.assertTrue(fileInfo[0].content.match(/\{macro main\(/).length == 1, "There can be only one ... macro main");
        },

        /**
         * Test content feature
         */
        testHmlTemplateWithContent : function () {
            var myClasspath = generator.getUniqueClasspathIn("my.package");
            var strPackage = myClasspath.substr(0, 10);
            var className = myClasspath.substr(11);
            this.assertTrue(strPackage === "my.package", "Generated classpath is in wrong package");
            this.assertTrue(/^[A-Z]\w*$/.test(className) === true, "Generated class name is not a class name.");
            var finalTemplate = generator.generateFile(generator.TYPE_HTMLTEMPLATE, {
                $classpath : myClasspath,
                content : "{macro main()}my content{/macro}"
            });
            // content should be available in result template
            this.assertTrue(/\{macro main\(\)\}my content\{\/macro\}/.test(finalTemplate.content), "Content is not available in generated template");
            // there should be only one main macro
            this.assertTrue(finalTemplate.content.match(/\{macro main\(/).length == 1, "There can be only one ... macro main");
        }
    }
});

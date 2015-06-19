/*
 * Copyright 2015 Amadeus s.a.s.
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
var IOFiltersMgr = require("ariatemplates/core/IOFiltersMgr");
var IOFilter = require("ariatemplates/core/IOFilter");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.templates.resources.TemplateWithResourcesTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.resources.TemplateWithResources"
        });
    },
    $prototype : {
        run : function () {
            var self = this;
            self.redirectedResources = 0;
            this.myFilter = new IOFilter();
            this.myFilter.onRequest = function (req) {
                var url = req.url.replace(/(\?|&)timestamp=[0-9]+$/, "");
                if (url == "/myResourcesServer?language=en_US&moduleName=resources") {
                    self.redirectedResources++;
                    this.redirectToFile(req, "test/aria/templates/resources/Res.js");
                }
            };
            IOFiltersMgr.addFilter(this.myFilter);
            AppEnvironment.setEnvironment({
                urlService : {
                    "implementation": "aria.modules.urlService.PatternURLCreationImpl",
                    "args": [
                        "${moduleName}/${actionName}",
                        "/myResourcesServer?language=${locale}&moduleName=${moduleName}"
                    ]
                }
            }, {
                fn : this.$TemplateTestCase.run,
                scope : this
            });
        },

        runTemplateTest : function () {
            var content = (this.testDiv.textContent || this.testDiv.innerText).replace(/^\s*(.*?)\s*$/, "$1");
            this.assertEquals(content, "IT IS WORKING!");
            this.assertEquals(this.redirectedResources, 1);
            IOFiltersMgr.removeFilter(this.myFilter);
            this.myFilter.$dispose();
            this.myFilter = null;
            this.notifyTemplateTestEnd();
        }
    }
});

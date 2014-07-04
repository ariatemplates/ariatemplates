/*
 * Copyright 2013 Amadeus s.a.s.
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
var ariaCoreDownloadMgr = require("ariatemplates/core/DownloadMgr");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.templates.css.cssFolderPath.CSSFolderPathTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        var xRoot = ariaCoreDownloadMgr.resolveURL(__filename, true).replace(/CSSFolderPathTestCase\.js$/, "")
                + "root/";
        ariaCoreDownloadMgr.updateRootMap({
            "x" : {
                "*" : xRoot
            }
        });
        this.xRoot = xRoot;

        this.setTestEnv({
            template : "x.CSSFolderPathTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var info = Aria.$global.x.CSSFolderPathStyleScript.info;
            this.assertEquals(info.calls, 1, "x.CSSFolderPathStyleScript.$constructor was not called.");
            this.assertEquals(info.cssFolderPath, this.xRoot + "x", "Invalid cssFolderPath: " + info.cssFolderPath);
            this.end();
        }
    }
});

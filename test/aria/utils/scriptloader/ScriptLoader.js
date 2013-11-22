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

Aria.classDefinition({
    $classpath : "test.aria.utils.scriptloader.ScriptLoader",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.ScriptLoader", "aria.core.DownloadMgr"],
    $prototype : {
        testAsyncMain : function () {
            var baseUrl = aria.core.DownloadMgr.resolveURL("test/aria/utils/scriptloader");

            this.url1 = baseUrl + "/script1.js";
            this.url2 = baseUrl + "/script2.js";
            this.url3 = baseUrl + "/script3.js";
            this.url4 = baseUrl + "/script4.js";
            this.url5 = baseUrl + "/script5.js";

            var that = this;
            aria.utils.ScriptLoader.load([this.url1, this.url2], {
                fn : this.checkFirstLoad,
                scope : this
            });
        },

        checkFirstLoad : function () {
            this.assertTrue(Aria.$frameworkWindow.script1 && Aria.$frameworkWindow.script2, "The first callback has been called before all the scripts are loaded");

            // Now check if the callback is always called, without loading the scripts again
            Aria.$frameworkWindow.script1 = false;
            Aria.$frameworkWindow.script2 = false;
            var that = this;
            aria.utils.ScriptLoader.load([this.url1, this.url2], {
                fn : this.checkSecondLoad,
                scope : this
            });
        },

        checkSecondLoad : function () {
            this.assertTrue(!Aria.$frameworkWindow.script1 || !Aria.$frameworkWindow.script2, "The scripts shouldn't be run again.");

            // Test partial load
            var that = this;
            aria.utils.ScriptLoader.load([this.url1, this.url3], {
                fn : this.checkPartialLoad,
                scope : this
            });

        },

        checkPartialLoad : function () {

            this.assertFalse(Aria.$frameworkWindow.script1, "The script 1 shouldn't have been run again");
            this.assertTrue(Aria.$frameworkWindow.script3, "The script 3 should have been run");

            // check for separate load
            aria.utils.ScriptLoader.load([this.url4], this._script4Callback);
            aria.utils.ScriptLoader.load([this.url5], this._script5Callback);

            this.waitFor({
                condition : function () {
                    return Aria.$frameworkWindow.script4Callback && Aria.$frameworkWindow.script5Callback;
                },
                callback : {
                    fn : this.endTest,
                    scope : this
                }
            });
        },

        endTest : function () {
            this.notifyTestEnd();
        },

        _script4Callback : function () {
            Aria.$frameworkWindow.script4Callback = true;

        },

        _script5Callback : function () {
            Aria.$frameworkWindow.script5Callback = true;
        }

    }
});

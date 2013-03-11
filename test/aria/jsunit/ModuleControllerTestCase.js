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
    $classpath : "test.aria.jsunit.ModuleControllerTestCase",
    $extends : "aria.jsunit.ModuleCtrlTestCase",
    $dependencies : ["test.aria.jsunit.mock.RedirectToFile"],
    $prototype : {
        $controller : "test.aria.jsunit.mock.SimpleController",

        setUp : function () {
            aria.core.IOFiltersMgr.addFilter("test.aria.jsunit.mock.RedirectToFile");
        },

        tearDown : function () {
            aria.core.IOFiltersMgr.removeFilter("test.aria.jsunit.mock.RedirectToFile");
        },

        testAsyncCallTheServer : function () {
            this.$moduleCtrl.processCommand({
                fn : this.after,
                scope : this
            });
        },

        after : function () {
            this.assertEventFired("responseReceived");
            // This checks that there are no response error
            this.assertLogsClean();
            var data = this.$moduleCtrl.getData();
            this.assertJsonEquals(data, {
                response : {
                    one : 1
                }
            });
            this.notifyTestEnd("testAsyncCallTheServer");
        }
    }
});

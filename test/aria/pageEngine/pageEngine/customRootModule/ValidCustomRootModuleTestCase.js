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
    $classpath : "test.aria.pageEngine.pageEngine.customRootModule.ValidCustomRootModuleTest",
    $extends : "test.aria.pageEngine.pageEngine.customRootModule.CustomRootModuleBaseTestCase",
    $constructor : function () {
        this._testData = {
            eventLogs : [],
            receivedInitArgs : {}
        };
        this.rootModuleCfg = {
            classpath : "test.aria.pageEngine.pageEngine.customRootModule.modules.CustomRootModule",
            constructorArgs : {
                testData : this._testData
            },
            initArgs : {
                further : "args",
                appData : {
                    message : "wrongAppData"
                }
            }
        };
        this.$CustomRootModuleBaseTestCase.constructor.call(this);
    },
    $prototype : {

        _afterPageEngineStart : function () {
            this.assertJsonEquals(this._testData.eventLogs, ["m1", "m2"], "Custom root module not able to listen to submodule's events.");
            this.assertEquals(this._testData.receivedInitArgs.further, "args", "Extra initArgs not correctly passed to the custom root module.");
            this.assertEquals(this._testData.receivedInitArgs.message, "realAppData", "appData in site configuration have been overridden by extra initArgs parameters.");
            this.end();
        }
    }
});

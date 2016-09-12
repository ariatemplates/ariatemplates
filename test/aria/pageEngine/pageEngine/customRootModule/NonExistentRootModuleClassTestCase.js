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
    $classpath : "test.aria.pageEngine.pageEngine.customRootModule.NonExistentRootModuleClassTest",
    $extends : "test.aria.pageEngine.pageEngine.customRootModule.CustomRootModuleBaseTestCase",
    $constructor : function () {
        this.rootModuleCfg = {
            classpath : "a.class.that.does.not.Exist"
        };
        this.$CustomRootModuleBaseTestCase.constructor.call(this);
    },
    $prototype : {

        _afterPageEngineStart : function () {
            this.assertErrorInLogs(this._testWindow.aria.pageEngine.PageEngine.MISSING_DEPENDENCIES);
            this.assertErrorInLogs(aria.core.ClassLoader.CLASS_LOAD_FAILURE);
            this.end();
        }
    }
});

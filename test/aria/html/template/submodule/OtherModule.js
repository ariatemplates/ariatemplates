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

Aria.classDefinition({
    $classpath : "test.aria.html.template.submodule.OtherModule",
    $dependencies : ["test.aria.html.template.submodule.IOtherModule"],
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.html.template.submodule.IOtherModule"],
    $prototype : {

        $publicInterfaceName : "test.aria.html.template.submodule.IOtherModule",

        init : function (initArgs, cb) {
            this._sharedTestData = initArgs;
            this._data = {
                fakeData : "Sub module"
            };
            this.$callback(cb);
        },

        setTestData : function (input) {
            this._sharedTestData.callCheck = true;
            this._sharedTestData.value = input;
        }

    }
});
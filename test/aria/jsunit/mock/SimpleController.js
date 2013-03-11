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
    $classpath : "test.aria.jsunit.mock.SimpleController",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.jsunit.mock.IMockModule"],
    $dependencies : ["aria.modules.requestHandler.JSONRequestHandler"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.apply(this, arguments);

        this.$requestHandler = new aria.modules.requestHandler.JSONRequestHandler();
    },
    $destructor : function () {
        this.$requestHandler.$dispose();

        this.$ModuleCtrl.$destructor.apply(this, arguments);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.jsunit.mock.IMockModule",

        processCommand : function (callback) {
            this.submitJsonRequest("processCommand", null, {
                fn : this.onResponse,
                scope : this,
                args : callback
            });
        },

        onResponse : function (response, callback) {
            this.setData(response);
            this.$raiseEvent("responseReceived");
            this.$callback(callback);
        }
    }
});

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

/**
 * Sample class used to test EnableMethodEvents for Module Controller
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.test.EnableMethodEventsModuleCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.templates.test.IEnableMethodEventsModuleCtrl"],
    $constructor : function (args) {
        this._enableMethodEvents = true;
        this.$ModuleCtrl.constructor.call(this);
        this.$on({
            "methodCallBegin" : this.onMethodCallBegin,
            scope : this
        });
        this.$on({
            "methodCallEnd" : this.onMethodCallEnd,
            scope : this
        });
        this.eventCallBeginRaised = false;
    },
    $destructor : function () {
        this.$publicInterface().EnableMethodEventsModuleCtrDisposed = true;
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.templates.test.IEnableMethodEventsModuleCtrl",

        /**
         * Sample method to test method events
         */
        testMethod : function () {
            this.eventCallEndRaised = false;
        },
        onMethodCallBegin : function () {
            this.eventCallBeginRaised = true;
        },
        onMethodCallEnd : function () {
            this.eventCallEndRaised = true;
        }
    }
});

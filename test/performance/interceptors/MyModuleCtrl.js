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
    $classpath : "test.performance.interceptors.MyModuleCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.templateTests.tests.performance.disableInterceptorTests.IMyModuleCtrl"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this.$on({
            "methodCallBegin" : this.onMethodCallBegin,
            scope : this
        });
        this.$on({
            "methodCallEnd" : this.onMethodCallEnd,
            scope : this
        });
    },
    $prototype : {
        $publicInterfaceName : 'test.templateTests.tests.performance.disableInterceptorTests.IMyModuleCtrl',
        init : function (initArgs, cb) {
            this.$callback(cb);
        },

        $call : function () {
            if (!this._data.calls) {
                this.setData({
                    nbTemplates : 140,
                    callBegin : 0,
                    calls : 0,
                    callEnd : 0
                });
            }
            this.json.setValue(this._data, "calls", this._data.calls + 1);
            return this.$ModuleCtrl.$call.apply(this, arguments);
        },

        myMethodCallFromTpl : function () {
            return "T";
        },
        onMethodCallBegin : function () {
            this.json.setValue(this._data, "callBegin", this._data.callBegin + 1);
        },
        onMethodCallEnd : function () {
            this.json.setValue(this._data, "callEnd", this._data.callEnd + 1);
        }
    }
});
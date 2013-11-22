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
    $classpath : "test.performance.subTemplateLoop.PerfTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.ModuleCtrlFactory", "test.performance.subTemplateLoop.Module"],
    $templates : ["test.performance.subTemplateLoop.Main", "test.performance.subTemplateLoop.Sub"],
    $prototype : {
        /**
         * Test with a lot of sub template. Without PTR05228660, this should go into script too slow with IE
         */
        testAsyncTemplatePerf : function () {
            // hijack $callback to measure usage
            this.oldCb = aria.core.JsObject.prototype.$callback;
            this.nbCallbackCall = 0;
            var oSelf = this;
            aria.core.JsObject.prototype.$callback = function () {
                oSelf.nbCallbackCall++;
                oSelf.oldCb.apply(this, arguments);
            };

            try {
                aria.templates.ModuleCtrlFactory.createModuleCtrl({
                    classpath : "test.performance.subTemplateLoop.Module"
                }, {
                    fn : this._afterModuleCtrlCreated,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
                this._finishHim();
            }
        },

        /**
         * Create container, set module data, load template
         * @protected
         * @param {Object} res
         */
        _afterModuleCtrlCreated : function (res) {
            try {
                var moduleCtrl = res.moduleCtrl;
                this.moduleCtrlPrivate = res.moduleCtrlPrivate;

                moduleCtrl.setData({
                    test : "test"
                });
                var document = Aria.$window.document;
                var container = document.createElement("div");
                container.id = "test_perf_container";
                document.body.appendChild(container);
                Aria.loadTemplate({
                    classpath : "test.performance.subTemplateLoop.Main",
                    moduleCtrl : moduleCtrl,
                    div : "test_perf_container"
                }, {
                    fn : this._finishHim,
                    scope : this
                });
            } catch (e) {
                this.handleAsyncTestError(e);
                this._finishHim();
            }
        },

        _finishHim : function () {
            var document = Aria.$window.document;

            aria.core.JsObject.prototype.$callback = this.oldCb;
            this.oldCb = null;

            try {
                this.assertTrue(this.nbCallbackCall < 600, "Too much callback call !");
            } catch (ex) {}

            // do some cleaning
            var container = document.getElementById("test_perf_container");
            Aria.disposeTemplate(container);
            document.body.removeChild(container);
            this.moduleCtrlPrivate.$dispose();
            this.moduleCtrlPrivate = null;

            this.notifyTestEnd("testAsyncTemplatePerf");
        }
    }
});

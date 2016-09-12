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
    $classpath : "test.aria.widgets.form.multiselect.issue312.Common",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $prototype : {

        // Those properties are defined in sub-classes:
        innerWidgetClasspath : "",
        innerWidgetName : "",
        outerWidgetName : "",

        testAsyncStartTemplateTest : function () {
            var self = this;
            var OriginalInnerWidget = Aria.getClassRef(this.innerWidgetClasspath);
            var MockInnerWidget = function (cfg, context, lineNbr) {
                var innerSclasses = self.innerSclasses;
                if (innerSclasses) {
                    if (innerSclasses.length === 0 || innerSclasses[innerSclasses.length - 1] !== cfg.sclass) {
                        // Only keep an sclass if it's different from the previous one.
                        // This makes it possible for the popup to be refreshed (with the same sclass) in some cases.
                        // (this happens in PhantomJS which triggers a viewport resized event)
                        innerSclasses.push(cfg.sclass);
                    }
                }
                var callback = self.callback;
                if (callback) {
                    self.callback = null;
                    aria.core.Timer.addCallback(callback);
                }
                return new OriginalInnerWidget(cfg, context, lineNbr);
            };
            this.overrideClass(this.innerWidgetClasspath, MockInnerWidget);
            this.$TemplateTestCase.testAsyncStartTemplateTest.call(this);
        },

        runTemplateTest : function () {
            this.checkInnerSclass("dropdown", this._step1);
        },

        _step1 : function () {
            this.setWidgetProperties(undefined, "std");
            this.checkInnerSclass("std", this._step2);
        },

        _step2 : function () {
            // creates the testIssue312I skin class for the inner widget:
            aria.widgets.AriaSkin.skinObject[this.innerWidgetName].testIssue312I = aria.widgets.AriaSkin.skinObject[this.innerWidgetName].std;
            // creates the testIssue312O skin class for the outer widget:
            var newOuterWidgetSkin = aria.utils.Json.copy(aria.widgets.AriaSkin.skinObject[this.outerWidgetName].std, false, null, true);
            this._setOuterWidgetSkinProperty(newOuterWidgetSkin, "testIssue312I");
            aria.widgets.AriaSkin.skinObject[this.outerWidgetName].testIssue312O = newOuterWidgetSkin;
            // Note that those new skin classes were not present when the CSS for the corresponding widgets were
            // generated so the display will not be correct, but this is not what we are checking here.

            this.setWidgetProperties("testIssue312O", undefined);
            this.checkInnerSclass("testIssue312I", this._step3);
        },

        _setOuterWidgetSkinProperty : function (skin, innerWidgetSkinClass) {
            // to be overridden in sub-classes
        },

        _step3 : function () {
            // Removes the new skin classes:
            delete aria.widgets.AriaSkin.skinObject[this.innerWidgetName].testIssue312I;
            delete aria.widgets.AriaSkin.skinObject[this.outerWidgetName].testIssue312O;

            this.end();
        },

        setWidgetProperties : function (outerSclass, innerSclass) {
            var tplCtxt = this.templateCtxt;
            var data = tplCtxt.data;
            data.outerSclass = outerSclass;
            data.innerSclass = innerSclass;
            tplCtxt.$refresh();
        },

        checkInnerSclass : function (expected, cb) {
            this.innerSclasses = [];
            this.callback = {
                delay : 100,
                fn : this._checkInnerSclassCb,
                scope : this,
                args : {
                    expected : expected,
                    cb : cb
                }
            };
            var outerWidget = this.getWidgetInstance("widget");
            outerWidget.focus();
            this.waitForWidgetFocus("widget", function () {
                aria.core.Timer.addCallback({
                    fn : function () {
                        outerWidget._toggleDropdown();
                    },
                    scope : this,
                    delay : 25
                });
            });
        },

        _checkInnerSclassCb : function (args) {
            this.assertJsonEquals([args.expected], this.innerSclasses, "Expected sclass '" + args.expected
                    + "' but got '" + this.innerSclasses + "'.");
            this.$callback(args.cb);
        }

    }
});

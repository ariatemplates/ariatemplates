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
    $classpath : "test.aria.widgets.form.multiselect.focusIssue.MultiSelect",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.jsunit.MultiSelectTemplateTestCase"],

    $prototype : {

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = aria.jsunit.MultiSelectTemplateTestCase.prototype;
            for (var key in src) {

                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }

        },

        /**
         * This method is always the first entry point to a template test Start the test by opening the first
         * MultiSelect popup.
         */
        runTemplateTest : function () {
            this.ms1 = this.getInputField("ms1");
            this.ms2 = this.getInputField("ms2");
            this.synEvent.type(this.ms1, "[down]", {
                fn : this._onTestMS1,
                scope : this
            });
        },

        _onTestMS1 : function () {
            this.waitUntilMsOpened('ms1', this._onTestMS2);
        },

        /**
         * Click on the second multiselect input.
         */
        _onTestMS2 : function () {
            this.synEvent.click(this.ms2, {
                fn : this._onTestMS3,
                scope : this
            });
        },

        /**
         * Open the second multiselect popup.
         */
        _onTestMS3 : function () {
            this.assertEquals(Aria.$window.document.activeElement.value, "AF1");
            this.synEvent.type(this.ms2, "[down]", {
                fn : this._onTestMS4,
                scope : this
            });
        },

        _onTestMS4 : function () {
            this.waitUntilMsOpened('ms2', this._onTestMS5);
        },

        _onTestMS5 : function () {
            this.synEvent.click(Aria.$window.document.activeElement, {
                fn : this._onTestMS6,
                scope : this
            });
        },

        _onTestMS6 : function () {
            this.synEvent.click(this.ms2, {
                fn : this.finishTest,
                scope : this
            });
        },

        finishTest : function () {
            this.assertEquals(this.ms2.value, "AC1,AF1");
            this.notifyTemplateTestEnd();
        }
    }
});

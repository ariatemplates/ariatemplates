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
    $classpath : "test.aria.widgets.form.multiselect.longlist.test2.MsLongListRobotTestCase",
    $extends : "test.aria.widgets.form.multiselect.MultiSelectRobotBase",
    $constructor : function () {
        this.$MultiSelectRobotBase.constructor.call(this);
        this.inputField = null;
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {
            this.inputField = this.getInputField("ms1");
            this._MSClick(this.inputField, this._onTestMS, this);
        },

        _onTestMS : function () {
            this.assertTrue(this.inputField.value === "ITN;ETR;ITL;ETA");
            this._onTestKD();
        },

        _onTestKD : function () {
            this._MSType(this.inputField, "[down]", this._waitOpened, this);
        },

        _waitOpened : function () {
            this.waitUntilMsOpened('ms1', this._closeMS);
        },

        _closeMS : function () {
            this.synEvent.type(null, "[space][up]", {
                fn : this._onMsFocus,
                scope : this
            });
        },

        _onMsFocus : function () {
            this.assertTrue(this.inputField.value === "ETR;ITL;ETA");
            this.endTest();
        },

        endTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

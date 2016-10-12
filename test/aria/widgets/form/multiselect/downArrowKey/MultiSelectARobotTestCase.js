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
    $classpath : "test.aria.widgets.form.multiselect.downArrowKey.MultiSelectARobotTestCase",
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
            this._MSClick(this.inputField, this._onTestMS0, this);
        },

        /**
         * Open popup.
         */
        _onTestMS0 : function () {
            this._MSType(this.inputField, "[down]", this._onTestMS1, this);
        },
        _onTestMS1 : function () {
            this.waitUntilMsOpened('ms1', this._onTestMS2);
        },

        /**
         * Tick first checkbox.
         */
        _onTestMS2 : function () {
            var ms = this.getWidgetInstance("ms1"), list = ms.controller.getListWidget();
            var checkBox = list._tplWidget.subTplCtxt._mainSection._content[1]._content[0].section._content[0].behavior.getDom();
            this._MSClick(this.inputField, this._onTestMS3, this);
        },

        /**
         * Focus on textfield.
         */
        _onTestMS3 : function () {
            this._MSClick(this.inputField, this._onTestMS4, this);
        },

        /**
         * Change display value, open popup using key down.
         */
        _onTestMS4 : function () {
            this._MSType(this.inputField, "d[down]", this._onTestMS5, this);
        },

        /**
         * Click on icon to close popup.
         */
        _onTestMS5 : function () {
            var msIcon = this.getMultiSelectIcon("ms1");
            this._MSClick(msIcon, this._onTestMS6, this);
        },

        /**
         * Open popup using key down.
         */
        _onTestMS6 : function () {
            this._MSType(this.inputField, "[down]", this.finishTest, this);
        },

        finishTest : function () {
            var ms = this.getWidgetInstance("ms1"), list = ms.controller.getListWidget();
            var selected = list._tplWidget.subTplCtxt.data.items[1].selected;
            this.assertTrue(this.getInputField("ms1").value === "");
            this.assertFalse(selected);
            list = null;
            ms = null;
            this.notifyTemplateTestEnd();
        }
    }
});

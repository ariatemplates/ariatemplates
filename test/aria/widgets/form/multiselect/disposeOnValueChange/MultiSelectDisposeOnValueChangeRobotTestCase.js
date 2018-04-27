/*
 * Copyright 2018 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.multiselect.disposeOnValueChange.MultiSelectDisposeOnValueChangeRobotTestCase",
    $dependencies : ["aria.templates.TemplateCtxtManager"],
    $extends : "aria.jsunit.MultiSelectTemplateTestCase",
    $prototype : {
        inputField: null,
        templatesNumber: 0,

        runTemplateTest : function () {
            this.templatesNumber = aria.templates.TemplateCtxtManager.getSize();
            this.inputField = this.getInputField("happyMS");
            this._MSClick(this.inputField, this._onTestMS0, this);
        },

        _onTestMS0 : function () {
            this._MSType(this.inputField, "[down]", this._onTestMS1, this);
        },

        _onTestMS1 : function () {
            this.waitUntilMsOpened('happyMS', this._onTestMS2);
        },

        _onTestMS2 : function () {
            var ms = this.getWidgetInstance("happyMS"), list = ms.controller.getListWidget();
            var checkBox = list._tplWidget.subTplCtxt._mainSection._content[1]._content[0].section._content[0].behavior.getDom();
            this._MSClick(checkBox, this._onTestMS3, this);
        },

        _onTestMS3 : function () {
            this._MSClick(this.inputField, this._onTestMS4, this);
        },

        _onTestMS4 : function () {
            this.waitUntilMsClosed('happyMS', this._onTestMS5);
        },

        _onTestMS5 : function () {
            this.assertEquals(this.templatesNumber, aria.templates.TemplateCtxtManager.getSize());
            this.end();
        }
    }
});

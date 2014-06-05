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
    $classpath : "test.aria.widgets.form.multiautocomplete.popupGeometry.PopupTopPositionTest",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $dependencies : ["aria.core.Browser"],
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.$constructor.call(this);
        if (aria.core.Browser.isIE7) {
            this.defaultTestTimeout = 30000;
        }
        this.data.expandButton = true;
    },
    $prototype : {

        runTemplateTest : function () {
            this.clickonExpandoButton(this._afterExpandOpen);
        },

        _afterExpandOpen : function () {
            this.getWidgetInstance("MultiAutoId").controller.getListWidget()._subTplCtxt.moduleCtrl.selectAll();
            this._testDropdownPosition();
            this.getWidgetInstance("MultiAutoId").controller.getListWidget()._subTplCtxt.moduleCtrl.deselectAll();
            this._testDropdownPosition();
            this.toggleOption("MultiAutoId", 0, "_afterFirstToggle");
        },

        _afterFirstToggle : function () {
            this._testDropdownPosition();
            this.toggleOption("MultiAutoId", 1, "_afterSecondToggle");
        },

        _afterSecondToggle : function () {
            this._testDropdownPosition();
            this.toggleOption("MultiAutoId", 2, "_afterThirdToggle");
        },

        _afterThirdToggle : function () {
            this._testDropdownPosition();
            this.toggleOption("MultiAutoId", 3, "_afterFouthToggle");
        },

        _afterFouthToggle : function () {
            this._testDropdownPosition();
            this.assertLogsEmpty();
            this.end();
        },

        _testDropdownPosition : function () {
            var dropdown = this.getWidgetDropDownPopup("MultiAutoId");
            var dropdownGeometry = aria.utils.Dom.getGeometry(dropdown);
            var macGeometry = aria.utils.Dom.getGeometry(this.getWidgetDomElement("MultiAutoId", "table"));

            this.assertEqualsWithTolerance(dropdownGeometry.y, macGeometry.y + macGeometry.height, 5, "Wrong left position for the popup. Expected: %2. Got: %1");
        }
    }
});

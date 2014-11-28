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

var Aria = require("ariatemplates/Aria");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.dropdown.touchDevices.DropDownTouchDevicesTestSuite",
    $extends : require("ariatemplates/jsunit/TestSuite"),
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButPopupDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButPopupTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButInputDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButInputTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButPopupDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButPopupTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButInputDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButInputTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerPopupDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerPopupTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerInputDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerInputTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectPopupDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectPopupTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectInputDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectInputTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxPopupDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxPopupTouchTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxInputDesktopTest");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxInputTouchTest");
    }
});

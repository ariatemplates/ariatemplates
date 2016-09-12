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
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButPopupDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButPopupTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButInputDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteExpButInputTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButPopupDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButPopupTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButInputDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.AutoCompleteNoExpButInputTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerPopupDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerPopupTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerInputDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.DatePickerInputTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectPopupDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectPopupTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectInputDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.MultiSelectInputTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxPopupDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxPopupTouchRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxInputDesktopRobotTestCase");
        this.addTests("test.aria.widgets.dropdown.touchDevices.SelectBoxInputTouchRobotTestCase");
    }
});

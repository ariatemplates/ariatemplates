/*
 * Copyright 2016 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.dropdown.DropdownTestSuite',
    $extends : require('ariatemplates/jsunit/TestSuite'),

    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests('test.aria.widgets.wai.dropdown.AutoCompleteDropdownTogglingRobotTestCase');
        this.addTests('test.aria.widgets.wai.dropdown.DatePickerDropdownTogglingRobotTestCase');
        this.addTests('test.aria.widgets.wai.dropdown.MultiAutoCompleteDropdownTogglingRobotTestCase');
        this.addTests('test.aria.widgets.wai.dropdown.MultiSelectDropdownTogglingRobotTestCase');
        this.addTests('test.aria.widgets.wai.dropdown.SelectDropdownTogglingRobotTestCase');
        this.addTests('test.aria.widgets.wai.dropdown.SelectBoxDropdownTogglingRobotTestCase');
    }
});

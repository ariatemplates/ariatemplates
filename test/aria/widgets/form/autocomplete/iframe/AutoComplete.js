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
    $classpath : 'test.aria.widgets.form.autocomplete.iframe.AutoComplete',
    $extends : 'aria.jsunit.RobotTestCase',
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this._autoCompleteTestCaseEnv = {
            template : "test.aria.widgets.form.autocomplete.iframe.AutoCompleteTpl",
            data : null
        };
        this.setTestEnv(this._autoCompleteTestCaseEnv);
    },
    $prototype : {
        _helperGetPopupTable : function () {
            var popup = this.getWidgetDropDownPopup('ac1');

            if (popup) {
                var table = popup.getElementsByTagName("table")[0];
                if (table) {
                    return table.parentNode;
                }
            }
        },

        runTemplateTest : function () {
            this.assertEquals(typeof(this._helperGetPopupTable()), "undefined", "Dropdown for the Autocomplete is open where as it was expected to be closed");
            this.assertFalse(!!this.getWidgetDropDownPopup("ac1"), "Dropdown for the Autocomplete is open where as it was expected to be closed");
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return (!!this._helperGetPopupTable());
                        },
                        callback : {
                            fn : this._blurField,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        _blurField : function () {
            this.assertTrue(!!this._helperGetPopupTable(), "Dropdown for the Autocomplete is closed where it was expected to be opened");
            this.synEvent.click(this.getElementById('display'), {
                fn : this.finishTest,
                scope : this
            });
        },

        finishTest : function () {
            this.assertFalse(!!this._helperGetPopupTable(), "Dropdown for the Autocomplete is open where as it was expected to be closed after clicking on an iframe");
            this.end();
        }
    }
});

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

/**
 * <pre>
 * This is a base class to extend for all tests dealing with preselect and autofill options in the MultiAutoComplete. It extends from
 * 'test.aria.widgets.form.autocomplete.preselectAutofill.PreselectAutofillBaseTest', thus performing the same scenario, but it also adds the following two steps
 *
 * 9 - type 'p1-4'  in the field. No matter what the preselect, autoFill, or freeText options are, 4 items have to be highlighted in the dropdown.
 * 10 - type the selection key. No matter what the preselect, autoFill, or freeText options are, 4 suggestions have to be selected.
 *
 * A test on the items that are selected inside the MultiAutocomplete is also performed, based on the values that should be found in the data model
 * </pre>
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.preselectAutofill.MACPreselectAutofillBaseTest",
    $extends : "test.aria.widgets.form.autocomplete.preselectAutofill.PreselectAutofillBaseTest",
    $dependencies : ["aria.resources.handlers.LCRangeResourceHandler"],
    $constructor : function () {
        this.testTemplate = "test.aria.widgets.form.multiautocomplete.preselectAutofill.PreselectAutofillCommonTemplate";
        this.resourcesHandler = new aria.resources.handlers.LCRangeResourceHandler({
            allowRangeValues : true
        });
        if (!this.allTestValues) {

            /**
             * <pre>
             * It contains two objects (one for the freeText=true scenario, the other for the freeText=false scenario), each containing, for each of the steps described in the comment above the class the expected values for
             * 1 - the input's value
             * 2 - the value in the data model
             * 3 - the status of the dropdown (the first entry being the number of suggestions, the second one an array containing the indices of highlighted items)
             *
             * Notice that the status after step 5 and 6 should be the same as step 1 and 2, respectively. That's why there are only six entries in the arrays.
             * </pre>
             */
            this.allTestValues = {
                freetext : {
                    input : [],
                    dataModel : [],
                    items : []
                },
                noFreetext : {
                    input : [],
                    dataModel : [],
                    items : []
                }
            };
        }

        this.$PreselectAutofillBaseTest.constructor.call(this);
        this.data.value = [];
        if (aria.core.Browser.isIE) {
            this.defaultTestTimeout = 25000;
        }
    },
    $prototype : {

        /**
         * type 'p1-4'
         */
        _furtherTests : function () {
            this._reset();
            this.synEvent.execute([["click", this.field], ["type", this.field, "p1-4"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [6, "_afterNinthTyping"]
            });
        },

        /**
         * Test that 4 items are highlighted in the dropdown. Type the selection key
         */
        _afterNinthTyping : function () {
            this._testAll(6);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [7, "_afterTenthTyping"]
            });
        },

        /**
         * test that 4 items have been selected.
         */
        _afterTenthTyping : function () {
            this._testAll(7);
            this.end();
        },

        _testAll : function (index) {
            this.field = this.getInputField("ac");
            this.$PreselectAutofillBaseTest._testAll.call(this, index);
            this._testSelectedItems(this.testValues.dataModel[index]);
        },

        _testSelectedItems : function (items) {
            items = items || [];

            var container = this.field.parentNode;
            var actualOptionCount = container.children.length - 1;
            this.assertEquals(actualOptionCount, items.length, "The number of selected options should be "
                    + items.length + ". It is " + actualOptionCount + " instead.");

            var element, text, label;
            for (var i = 0; i < items.length; i++) {
                element = container.childNodes[i];
                label = aria.utils.Type.isString(items[i]) ? items[i] : items[i].label;
                text = element.textContent || element.innerText;
                this.assertEquals(text, label, "The Wrong values are added.");
            }

        }
    }
});

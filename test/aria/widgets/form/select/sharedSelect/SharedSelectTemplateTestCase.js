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
    $classpath : "test.aria.widgets.form.select.sharedSelect.SharedSelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {

        this.$TemplateTestCase.constructor.call(this);
        this.data = {

            countries : [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }, {
                        value : "US",
                        label : "United States"
                    }, {
                        value : "ES",
                        label : "Spain"
                    }, {
                        value : "PL",
                        label : "Poland"
                    }, {
                        value : "SE",
                        label : "Sweden"
                    }, {
                        value : "USA",
                        label : "United States of America"
                    }]
        };
        this.defaultTestTimeout = 10000;
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.select = this.getWidgetInstance("select").getSelectField();
            this.synEvent.click(this.select, {
                fn : this.changeOptions,
                scope : this
            });
        },
        /**
         * replace the options list. The new options list is the former one in which the first element is deleted
         */
        changeOptions : function () {
            var newOptionsList = this.data.countries.slice(1, this.data.countries.length);
            this.oldSelectedValue = this.getCurrentOptionsFirstValue();
            aria.utils.Json.setValue(this.data, "countries", newOptionsList);
            this.newSelectedValue = this.getCurrentOptionsFirstValue();
            this.assertFalse(this.oldSelectedValue === this.newSelectedValue);
            this.oldSelectedValue = this.newSelectedValue;
            this.synEvent.click(this.select, {
                fn : this.onSelectFocused,
                scope : this
            });
        },
        /**
         * change the displayed value Interact with the widget to chek that it still working fine
         */
        onSelectFocused : function () {
            this.synEvent.type(this.select, "[down][down][enter]", {
                fn : this.checkSelectedValue,
                scope : this
            });
        },
        /**
         * check the new value
         */
        checkSelectedValue : function () {
            this.newSelectedValue = this.getCurrentlySelectedValue();
            this.assertFalse(this.oldSelectedValue === this.newSelectedValue);
            this.emptyOptions();
        },

        /**
         * empty the options list
         */
        emptyOptions : function () {
            aria.utils.Json.setValue(this.data, "countries", []);
            this.finishTest();
        },

        /**
         * Finalize the test, in this case, nothing special to do
         */
        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
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
    $classpath : "test.aria.widgets.form.selectbox.checkValue.MainTemplateRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {

        this.$RobotTestCase.constructor.call(this);
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

        this.setTestEnv({
            template : "test.aria.widgets.form.selectbox.checkValue.MainTemplate",
            data : this.data
        });
        this.defaultTestTimeout = 10000;
        if (aria.core.Browser.isIE7 || aria.core.Browser.isIE8) {
            this.defaultTestTimeout = 60000;
        }
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("selectbox"), {
                fn : this.beforeChangingOptions,
                scope : this
            });
        },
        /**
         * This method read the first value of the options list before changing
         */
        beforeChangingOptions : function () {
            var firstValue = this.getWidgetInstance("selectbox")._cfg.options[0].value;
            this.assertTrue(firstValue == "FR");
            this.changeOptionsList();
        },
        /**
         * This method changes the options list
         */
        changeOptionsList : function () {
            var newOptionsList = this.data.countries.slice(1, this.data.countries.length);
            aria.utils.Json.setValue(this.data, "countries", newOptionsList);
            this.afterChangingOptions();
        },
        /**
         * This method read the same value as in beforeChangingOptions to check that it has changed
         */
        afterChangingOptions : function () {
            var firstValue = this.getWidgetInstance("selectbox")._cfg.options[0].value;
            this.assertFalse(firstValue == "FR");
            this.synEvent.click(this.getInputField("selectbox"), {
                fn : this.searchForCountry,
                scope : this
            });
        },
        /**
         * This method searches for a country in options list. The goal is to interact with the widget and check that it
         * still working fine
         */
        searchForCountry : function () {
            this.synEvent.type(this.getInputField("selectbox"), "Swe", {
                fn : this.selectValue,
                scope : this
            });
        },

        /**
         * This method selects the eventual found value
         */
        selectValue : function () {
            this.synEvent.type(this.getInputField("selectbox"), "[enter]", {
                fn : this.finishTest,
                scope : this
            });
        },
        /**
         * Checks if the selected value corresponds to the expected one and end the test
         */
        finishTest : function () {
            this.assertTrue(this.getInputField("selectbox").value == "Sweden");
            this.end();
        }

    }
});

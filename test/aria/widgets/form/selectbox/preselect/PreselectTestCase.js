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
    $classpath : "test.aria.widgets.form.selectbox.preselect.PreselectTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {

        this.$RobotTestCase.constructor.call(this);
        this.data = {
            preselect : "always",
            value : null,
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
            data : this.data
        });
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var field = this.getInputField("selectbox");
            this.synEvent.execute([["click", field], ["type", field, "S"], ["pause", 100], ["type", field, "[ENTER]"]], {
                fn : this._afterFirstSelection,
                scope : this
            });
        },

        _afterFirstSelection : function () {
            var field = this.getInputField("selectbox");
            this.assertEquals(field.value, "Switzerland");
            this.assertEquals(this.data.value, "CH");
            this.data.value = null;
            this._refreshTestTemplate();
            field = this.getInputField("selectbox");
            this.synEvent.execute([["click", field], ["type", field, "Swe"], ["pause", 100], ["type", field, "[ENTER]"]], {
                fn : this._afterSecondSelection,
                scope : this
            });
        },

        _afterSecondSelection : function () {
            var field = this.getInputField("selectbox");
            this.assertEquals(field.value, "Sweden");
            this.assertEquals(this.data.value, "SE");
            this.data.value = null;
            this.data.preselect = "none";
            this._refreshTestTemplate();
            field = this.getInputField("selectbox");
            this.synEvent.execute([["click", field], ["type", field, "S"], ["pause", 100], ["type", field, "[ENTER]"]], {
                fn : this._afterThirdSelection,
                scope : this
            });
        },

        _afterThirdSelection : function () {
            var field = this.getInputField("selectbox");
            this.assertEquals(field.value, "S");
            this.assertUndefined(this.data.value == null ? undefined : this.data.value);
            this.data.value = null;
            this._refreshTestTemplate();
            field = this.getInputField("selectbox");
            this.synEvent.execute([["click", field], ["type", field, "Swe"], ["pause", 100], ["type", field, "[ENTER]"]], {
                fn : this._afterFourthSelection,
                scope : this
            });
        },

        _afterFourthSelection : function () {
            var field = this.getInputField("selectbox");
            this.assertEquals(field.value, "Swe");
            this.assertUndefined(this.data.value == null ? undefined : this.data.value);
            this.end();
        }

    }
});

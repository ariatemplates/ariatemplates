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
    $classpath : "test.aria.widgets.form.autocomplete.autoselectlabel.AutoSelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.autoselectlabel.AutoSelectTemplate",
            data : {
                valueFill : "",
                valueNoFill : ""
            }
        });

        // this.defaultTestTimeout = 60000;
    },
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("acFill");

            this.synEvent.type(this.getInputField("acFill"), "par", {
                fn : this.onAfterType,
                scope : this
            });
        },

        onAfterType : function () {
            aria.core.Timer.addCallback({
                fn : function () {
                    this.synEvent.click("clickHandler", {
                        fn : this.onAfterClick,
                        scope : this
                    });
                },
                scope : this,
                delay : 800
            });
        },

        onAfterClick : function () {
            // Check that the value is correctly set in the datamodel
            var data = this.templateCtxt.data.valueFill;
            var field = this.getInputField("acFill");

            this.assertEquals("PAR", data.code, "IATA Value in the datamodel: " + data.code + " - expecting: PAR");
            this.assertEquals("Paris", field.value, "Value in the field: " + field.value
                    + " - expecting: Paris");

            // Check without autofill
            this.withoutFill();
        },

        withoutFill : function () {
            this.templateCtxt.$focus("acNoFill");

            this.synEvent.type(this.getInputField("acNoFill"), "par", {
                fn : this.onAfterTypeNoFill,
                scope : this
            });
        },

        onAfterTypeNoFill : function () {
            aria.core.Timer.addCallback({
                fn : function () {
                    this.synEvent.click("clickHandler", {
                        fn : this.onAfterClickNoFill,
                        scope : this
                    });
                },
                scope : this,
                delay : 800
            });
        },

        onAfterClickNoFill : function () {
            // Check that the value is correctly set in the datamodel
            var data = this.templateCtxt.data.valueNoFill;
            var field = this.getInputField("acNoFill");

            this.assertEquals("", data, "Value in the datamodel: " + data + " - expecting an empty string");
            this.assertEquals("par", field.value, "Value in the field: " + field.value + " - expecting: par");

            this.notifyTemplateTestEnd();
        }
    }
});

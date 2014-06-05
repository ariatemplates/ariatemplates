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
    $classpath : "test.aria.widgets.form.autocomplete.typefast.AutoSelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.typefast.AutoSelectTemplate",
            data : {
                valueFill : "",
                valueNoFill : ""
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("acFill");

            // "asd" will display one option, "a" will close it
            this.synEvent.type(this.getInputField("acFill"), "asd", {
                fn : this.onAfterType,
                scope : this
            });
        },

        onAfterType : function () {
            aria.core.Timer.addCallback({
                fn : function () {
                    this.synEvent.type(this.getInputField("acFill"), "a", {
                        fn : function () {
                            aria.core.Timer.addCallback({
                                fn : this.onComplete,
                                scope : this,
                                delay : 100
                            });
                        },
                        scope : this
                    });
                },
                scope : this,
                delay : 100
            });
        },

        onComplete : function () {
            // Check that the value is correctly set in the datamodel
            var field = this.getInputField("acFill");

            this.assertEquals("asda", field.value, "Value in the field: " + field.value + " - expecting: asda");

            this.notifyTemplateTestEnd();
        }
    }
});

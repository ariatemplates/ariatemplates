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
var AppEnvironment = require("ariatemplates/core/AppEnvironment");
var jsonUtils = require("ariatemplates/utils/Json");
var dataUtils = require("ariatemplates/utils/Data");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.textInputBased.TextInputTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                text1 : {
                    mandatory: false,
                    value: ""
                },
                text2 : {
                    mandatory: true,
                    value: ""
                },
                textarea1 : {
                    mandatory: false,
                    value: ""
                },
                textarea2 : {
                    mandatory: true,
                    value: ""
                },
                number1 : {
                    mandatory: true,
                    value: ""
                }
            }

        });
    },
    $prototype : {
        run : function () {
            AppEnvironment.setEnvironment({
                appSettings: {
                    waiAria: true
                }
            }, {
                scope: this,
                fn: this.$TemplateTestCase.run
            });
        },

        switchValue : function(data, notEmptyValue) {
            return (data.value && data.value.length) ? "[backspace]" : notEmptyValue;
        },

        checkAttributes : function(inputId, data) {

            var input = this.getInputField(inputId);

            dataUtils.validateModel(data);
            if (data.mandatory) {
                this.assertTrue(input.getAttribute("required") != null, "required should be set in " + inputId);
            } else {
                this.assertTrue(input.getAttribute("required") == null, "required shouldn't be set in " + inputId);
            }

            if (input.parentNode.className.indexOf("Error") > -1) {
                this.assertTrue(input.getAttribute("aria-invalid") != null, "aria-invalid should be set in " + inputId);
            } else {
                this.assertTrue(input.getAttribute("aria-invalid") == null, "aria-invalid shouldn't be set in " + inputId);
            }

        },

        checkField : function(inputId, data, notEmptyValue, callback) {

            var self = this;

            this.checkAttributes(inputId, data);

            jsonUtils.setValue(data, "mandatory", !data.mandatory);
            this.checkAttributes(inputId, data);

            var newValue = this.switchValue(data, notEmptyValue);
            this.clickAndType(inputId, newValue, function() {
                self.checkAttributes(inputId, data);

                jsonUtils.setValue(data, "mandatory", !data.mandatory);
                self.checkAttributes(inputId, data);

                var newValue = self.switchValue(data, notEmptyValue);
                self.clickAndType(inputId, newValue, function() {
                    callback.apply(self);
                }, true);

            }, true);

        },

        runTemplateTest : function () {
            this.checkText1();
        },

        checkText1 : function() {
            this.checkField("text1", this.templateCtxt.data.text1, "aaa", function() {
                this.checkText2();
            });


        },

        checkText2 : function() {
            this.checkField("text2", this.templateCtxt.data.text2, "aaa", function() {
                this.checkTextarea1();
            });
        },

        checkTextarea1 : function() {
            this.checkField("textarea1", this.templateCtxt.data.textarea1, "aaa", function() {
                this.checkTextarea2();
            });


        },

        checkTextarea2 : function() {
            this.checkField("textarea2", this.templateCtxt.data.textarea2, "aaa", function() {
                this.checkNumber1();
            });
        },

        checkNumber1 : function() {
            this.checkField("number1", this.templateCtxt.data.number1, "aaa", function() {
                this.checkField("number1", this.templateCtxt.data.number1, "123", function() {
                    this.end();
                });
            });
        }
    }
});

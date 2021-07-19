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

var JawsTestCase = require("ariatemplates/jsunit/JawsTestCase");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");

require("ariatemplates/utils/validators/CfgBeans"); // just to make sure it is correctly defined
require("ariatemplates/widgets/errorlist/ErrorListTemplate.tpl"); // just to be sure the template is loaded when the test is run, since it depends on its (DOM) content

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.errorlist.binding.ErrorListBindingJawsTestCase",
    $extends : JawsTestCase,

    $constructor : function() {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.errorlist.binding.ErrorListBindingTpl",
            moduleCtrl : {
                classpath : 'test.aria.widgets.wai.errorlist.binding.ErrorListBindingCtrl'
            }
        });
    },

    $prototype : {
        skipClearHistory: true,

        run : function () {
            AppEnvironment.setEnvironment({
                appSettings: {
                    waiAria: true
                }
            }, {
                scope: this,
                fn: this.$JawsTestCase.run
            });
        },

        runTemplateTest : function () {
            var emailField = this.getInputField("email");
            this.execute([
                ["click", emailField],
                ["waitFocus", emailField],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Submit Button"],
                ["type",null,"[space]"],
                ["waitForJawsToSay",/Error.*The first name is a required field using a mandatory validator.*The last name is a required field using a mandatory validator.*The phone number is a required field using a mandatory validator.*The email is a required field using a mandatory validator/],
                ["type",null,"[down]"],
                ["waitForJawsToSay","list of 4 items"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "black square"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "The first name is a required field using a mandatory validator."],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "black square"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "The last name is a required field using a mandatory validator."],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Alert!"],
                ["waitForJawsToSay","The last name is a required field using a mandatory validator."],
                ["pause",500],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Phone Number"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Alert!"],
                ["waitForJawsToSay","The phone number is a required field using a mandatory validator."]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});

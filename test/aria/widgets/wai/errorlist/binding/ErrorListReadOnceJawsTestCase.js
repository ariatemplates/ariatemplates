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
var JsonUtils = require("ariatemplates/utils/Json");

require("ariatemplates/utils/validators/CfgBeans"); // just to make sure it is correctly defined
require("ariatemplates/widgets/errorlist/ErrorListTemplate.tpl"); // just to be sure the template is loaded when the test is run, since it depends on its (DOM) content

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.errorlist.binding.ErrorListReadOnceJawsTestCase",
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
            var emailError = /The email is a required field using a mandatory validator/i;
            var repeatErrorsListener = {
                match: emailError,
                scope: this,
                fn: this.lastJawsTextFailure
            };
            var emailField = this.getInputField("email");
            this.execute([
                ["click", emailField],
                ["waitFocus", emailField],
                ["waitForJawsToSay","Email Address colon  Edit"],
                ["type",null,"[down][down]"],
                ["waitForJawsToSay","Submit Button"],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay", emailError],
                // once the error is read (once), Jaws is not supposed to read it again:
                ["registerJawsListener", repeatErrorsListener],
                ["pause", 2000]
            ], {
                fn: function () {
                    // With role=alert, Jaws was reading messages when they are removed
                    // from the screen.
                    // Now let's check that the error messages are not read when they
                    // are removed from the screen:
                    this.$logInfo("Clearing messages");
                    JsonUtils.setValue(this.templateCtxt.data, "errorMessages", []);
                    this.execute([
                        ["pause", 3000],
                        ["unregisterJawsListener", repeatErrorsListener]
                    ], {
                        fn: this.end,
                        scope: this
                    });
                },
                scope: this
            });

        }
    }
});

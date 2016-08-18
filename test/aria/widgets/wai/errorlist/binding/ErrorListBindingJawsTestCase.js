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

var dataUtils = require("ariatemplates/utils/Data");

var JawsTestCase = require("ariatemplates/jsunit/JawsTestCase");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");

require("ariatemplates/utils/validators/CfgBeans"); // just to make sure it is correctly defined
require("ariatemplates/widgets/errorlist/ErrorListTemplate.tpl"); // just to be sure the template is loaded when the test is run, since it depends on its (DOM) content

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.errorlist.binding.ErrorListBindingJawsTestCase",
    $extends : JawsTestCase,

    $constructor : function() {
        // ---------------------------------------------------------------------

        this.$JawsTestCase.constructor.call(this);

        // ------------------------------------ template data & test environment

        var type = dataUtils.TYPE_CONFIRMATION;

        this.setTestEnv({
            template : "test.aria.widgets.wai.errorlist.binding.ErrorListBindingTpl",
            moduleCtrl : {
                classpath : 'test.aria.widgets.wai.errorlist.binding.ErrorListBindingCtrl'
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
                fn: this.$JawsTestCase.run
            });
        },

        runTemplateTest : function () {

            var doubleSlashRegExp = /\\\n/gi;
            var removeInsertedEmail = /\nEmail Address:\n/gi;

            this.synEvent.execute([
                ["click", this.getInputField("email")],
                ["pause", 1000],
                ["type", null, "[down][down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 2000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 5000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Email Address: Edit\nType in text.\nSubmit\nButton\nError\nError • The first name is a required field using a mandatory validator.• The last name is a required field using a mandatory validator.• The phone number is a required field using a mandatory validator.• The email is a required field using a mandatory validator.\nlist of 4 items\n• Link The first name is a required field using a mandatory validator.\n• Link The last name is a required field using a mandatory validator.\nAlert!\nThe last name is a required field using a mandatory validator.\nPhone Number:\nEdit\nAlert!\nThe phone number is a required field using a mandatory validator.",
                        this.end,
                        function (response) {
                            return this.removeDuplicates(
                                response
                                    .replace(doubleSlashRegExp, "\n")
                                    .replace(removeInsertedEmail, "\n")
                            );
                        }
                    );
                },
                scope: this
            });
        }
    }
});

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
    $classpath : "test.aria.widgets.wai.errorlist.binding.ErrorListNoAriaLiveJawsTestCase",
    $extends : JawsTestCase,

    $constructor : function() {
        // ---------------------------------------------------------------------

        this.$JawsTestCase.constructor.call(this);

        // ------------------------------------ template data & test environment

        this.setTestEnv({
            template : "test.aria.widgets.wai.errorlist.binding.ErrorListBindingTpl",
            moduleCtrl : {
                classpath : 'test.aria.widgets.wai.errorlist.binding.ErrorListBindingCtrl',
                initArgs: {
                    ariaLive : false,
                    focusOnError : false
                }
            }
        });

        this.noiseRegExps.push(/\\$/, /^Email Address:$/i);
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
            this.synEvent.execute([
                ["click", this.getInputField("email")],
                ["pause", 1000],
                ["type", null, "[down][down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 3000] // check that nothing is said when errors are displayed
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Email Address: Edit\nType in text.\nSubmit Button",
                        this.end,
                        function filter(content) {
                            content = content.replace(/(Submit)\n(Button)/gi, '$1 $2');
                            return content;
                        }
                    );
                },
                scope: this
            });
        }
    }
});

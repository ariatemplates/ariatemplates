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

var TemplateTestCase = require("ariatemplates/jsunit/TemplateTestCase");

require("ariatemplates/utils/validators/CfgBeans"); // just to make sure it is correctly defined
require("ariatemplates/widgets/errorlist/ErrorListTemplate.tpl"); // just to be sure the template is loaded when the test is run, since it depends on its (DOM) content

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.errorlist.ListErrorTestCase",
    $extends : TemplateTestCase,

    $constructor : function() {
        // ---------------------------------------------------------------------

        this.$TemplateTestCase.constructor.call(this);

        // ------------------------------------ template data & test environment

        var type = dataUtils.TYPE_CONFIRMATION;
        this.data = {
            errorMessages: [
                {
                    localizedMessage : "Line 1",
                    type : type
                }
            ]
        };

        this.setTestEnv({
            data: this.data
        });

     },

    $prototype : {
        runTemplateTest : function () {
            this.assertEquals(this.getWidgetInstance("e1").getDom().getAttribute("role"), "alert", "The role attribute should be %2 instead of %1");
            this.assertNull(this.getWidgetInstance("e2").getDom().getAttribute("role"), "The role attribute shouldn't be set");

            this.end();
        }
    }
});

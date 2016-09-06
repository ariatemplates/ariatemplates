/*
 * Copyright 2016 Amadeus s.a.s.
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

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.defaults.CheckDefaultsTest",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $prototype : {
        run : function () {
            AppEnvironment.setEnvironment({
                widgetDefaults: {
                    DatePicker: {
                        calendarNumberOfUnits: 5
                    }
                }
            }, {
                scope: this,
                fn: this.$TemplateTestCase.run
            });
        },

        runTemplateTest : function () {
            var dp1 = this.getWidgetInstance("dp1");
            this.assertEquals(dp1._cfg.calendarNumberOfUnits, 5, "Default value of 5 for calendarNumberOfUnits not taken into account in first date picker.");
            var dp2 = this.getWidgetInstance("dp2");
            this.assertEquals(dp2._cfg.calendarNumberOfUnits, 1, "Overridden value of 1 for calendarNumberOfUnits not taken into account in the second date picker.");

            AppEnvironment.setEnvironment({
                widgetDefaults: {
                    DatePicker: {
                        calendarNumberOfUnits: 2
                    }
                }
            }, {
                scope: this,
                fn: this.afterChangingEnv
            });

        },

        afterChangingEnv : function () {
            this.templateCtxt.$refresh();

            var dp1 = this.getWidgetInstance("dp1");
            this.assertEquals(dp1._cfg.calendarNumberOfUnits, 2, "Default value of 2 for calendarNumberOfUnits not taken into account in first date picker.");
            var dp2 = this.getWidgetInstance("dp2");
            this.assertEquals(dp2._cfg.calendarNumberOfUnits, 1, "Overridden value of 1 for calendarNumberOfUnits not taken into account in the second date picker.");

            this.end();
        }
    }
});

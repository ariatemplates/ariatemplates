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
    $classpath : "test.aria.widgets.form.select.checkBinding.SelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {};
        this.setTestEnv({
            template : "test.aria.widgets.form.select.checkBinding.SelectTemplateTest",
            data : this.data

        });
    },
    $prototype : {
        runTemplateTest : function () {
            if (aria.core.Browser.isFirefox) {
                var select = this.getWidgetInstance("mySelect1").getSelectField();
                // TODO replace the synEvent with the robot applet event as soon as it is ready
                this.synEvent.click(select, {
                    fn : this.onSelectFocused,
                    scope : this
                });
            } else {
                this.notifyTemplateTestEnd();
            }

        },

        onSelectFocused : function () {
            // TODO check that the options are displayed: this will possible only as soon as the robot applet is ready
            var select = this.getWidgetInstance("mySelect1").getSelectField();
            this.synEvent.type(select, "[down][down][down][enter]", {
                fn : this.checkText,
                scope : this
            });
        },

        checkText : function () {
            var select1 = this.getWidgetInstance("mySelect1").getSelectField();
            var select2 = this.getWidgetInstance("mySelect2").getSelectField();
            this.assertTrue(select1.selectedIndex === select2.selectedIndex);// test bindings
            this.notifyTemplateTestEnd();
        }
    }
});
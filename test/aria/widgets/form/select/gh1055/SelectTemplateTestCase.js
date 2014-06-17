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
    $classpath : "test.aria.widgets.form.select.gh1055.SelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            selectBox1Value : "A",
            selectBox2Value : "A",
            options : [{
                        label : "Type A",
                        value : "A"
                    }, {
                        label : "Type B",
                        value : "B"
                    }]
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.select.gh1055.SelectTemplateTest",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var select = this.getWidgetInstance("mySelect2").getSelectField();
            // TODO replace the synEvent with the robot applet event as soon as it is ready
            this.synEvent.click(select, {
                fn : this.onSelectFocused,
                scope : this
            });

        },

        onSelectFocused : function () {
            // TODO check that the options are displayed: this will possible only as soon as the robot applet is ready
            var select = this.getWidgetInstance("mySelect2").getSelectField();
            this.synEvent.type(select, "[down][enter]", {
                fn : this.onSelectChange,
                scope : this
            });
        },

        onSelectChange : function () {
            this.assertEquals(this.data.selectBox1Value, "A", "Select box value should be %2, got %1");
            this.assertEquals(this.data.selectBox2Value, "B", "Select box value should be %2, got %1");
            var select = this.getWidgetInstance("mySelect1").getSelectField();
            this.synEvent.type(select, "[down][enter]", {
                fn : this.checkSelectBoxValues,
                scope : this
            });

        },
        checkSelectBoxValues : function () {
            this.assertEquals(this.data.selectBox1Value, "B", "Select box value should be %2, got %1");
            this.assertEquals(this.data.selectBox2Value, "A", "Select box value should be %2, got %1");
            this.notifyTemplateTestEnd();
        }
    }
});

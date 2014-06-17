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
    $classpath : "test.aria.widgets.form.select.boundOptionsRemoval.SelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            select1Value : "A",
            select2Value : "A",
            options1 : [{
                        label : "Type A",
                        value : "A"
                    }, {
                        label : "Type B",
                        value : "B"
                    }]
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.select.boundOptionsRemoval.SelectTemplateTest",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // check initial values
            this.assertEquals(this.data.select1Value, "A", "Select 1 value should be %2, got %1");
            this.assertEquals(this.data.select2Value, "A", "Select 2 value should be %2, got %1");

            // select2 should have 2 options initially
            var select2widget = this.getWidgetInstance("mySelect2");
            this.assertEquals(select2widget._cfg.options.length, 2);

            var select1 = this.getWidgetInstance("mySelect1").getSelectField();
            this.synEvent.click(select1, {
                fn : this.onSelect1Focused,
                scope : this
            });
        },

        onSelect1Focused : function () {
            // change first select -> should update values to B, A
            var select1 = this.getWidgetInstance("mySelect1").getSelectField();
            this.synEvent.type(select1, "[down][enter]", {
                fn : this.onSelect1Change,
                scope : this
            });
        },

        onSelect1Change : function () {
            // Since select1 value was changed, the options of select2 bound to it should have also changed
            this.assertEquals(this.data.select1Value, "B", "Select 1 value should be %2, got %1");
            this.assertEquals(this.data.select2Value, "A", "Select 2 value should be %2, got %1");

            // Now select2 should have third option "C" available, let's select it
            var select2widget = this.getWidgetInstance("mySelect2");
            this.assertEquals(select2widget._cfg.options.length, 3);

            var select2 = select2widget.getSelectField();
            this.synEvent.type(select2, "[down][down][enter]", {
                fn : this.onSelect2Change,
                scope : this
            });
        },

        onSelect2Change : function () {
            this.assertEquals(this.data.select1Value, "B", "Select 1 value should be %2, got %1");
            this.assertEquals(this.data.select2Value, "C", "Select 2 value should be %2, got %1");

            // let's change the value of select1 once again, so that select2 doesn't have "C" as possible option anymore
            var select1 = this.getWidgetInstance("mySelect1").getSelectField();
            this.synEvent.type(select1, "[up][enter]", {
                fn : this.checkSelectValues,
                scope : this
            });
        },

        checkSelectValues : function () {
            // Essence of this test: the value of select2 should be hence updated accordingly - it must not stay as "C"
            // It will be reset to the first possible option instead
            this.assertEquals(this.data.select1Value, "A", "Select 1 value should be %2, got %1");
            this.assertEquals(this.data.select2Value, "A", "Select 2 value should be %2, got %1");

            // Make sure that widgets bound to select2 are refreshed too
            var boundTextWidget = this.getWidgetInstance("myBoundText2");
            this.assertEquals(boundTextWidget._cfg.text, "A", "Bound text value should be %2, got %1");

            this.notifyTemplateTestEnd();
        }
    }
});

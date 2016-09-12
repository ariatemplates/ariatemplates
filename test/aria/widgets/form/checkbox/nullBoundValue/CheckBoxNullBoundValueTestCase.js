/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.checkbox.nullBoundValue.CheckBoxNullBoundValueTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            var widgetInstance = this.getWidgetInstance("checkbox");
            this.assertEquals(widgetInstance._cfg.bind.value.inside.value, null, "Initial value is not null!");
            var domElt = widgetInstance.getDom();
            this.assertNotEquals(domElt, null, "getDom() returns null");
            this.synEvent.click(domElt, {
                scope : this,
                fn : this.afterClick
            });
        },
        afterClick : function () {
            var widgetInstance = this.getWidgetInstance("checkbox");
            this.assertEquals(widgetInstance._cfg.bind.value.inside.value, true, "Clicking on the checkbox did not set the value to true!");
            this.end();
        }
    }
});

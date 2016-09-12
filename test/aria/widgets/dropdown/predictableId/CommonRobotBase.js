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
    $classpath : "test.aria.widgets.dropdown.predictableId.CommonTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.dropdown.predictableId.Widgets",
            data : {
                options : [{
                            label : "First",
                            value : "One"
                        }, {
                            label : "Second",
                            value : "Two"
                        }, {
                            label : "Third",
                            value : "Three"
                        }, {
                            label : "Fourth",
                            value : "Four"
                        }]
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var icon = this.getMultiSelectIcon(this.idToBeTested);

            var iconClass = icon.className;
            this.assertEquals(iconClass, "xICNdropdown", "Couldn't find the dropdown icon, targetting " + iconClass);

            this.synEvent.click(icon, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return !!this.getWidgetDropDownPopup(this.idToBeTested);
                        },
                        callback : {
                            fn : this.onWidgetClick,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        onWidgetClick : function () {
            // firstChild is the span
            var dropdown = this.getWidgetDropDownPopup(this.idToBeTested).firstChild;

            var id = dropdown.id;

            this.assertTrue(id.indexOf(this.idToBeTested) > -1, "Dropdown doesn't have a predictable id, got " + id);

            this.end();
        }
    }
});

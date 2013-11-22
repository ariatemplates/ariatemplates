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
    $classpath : "test.aria.widgets.dropdown.fixedWidth.SelectBoxTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.dropdown.fixedWidth.Widgets",
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
        _helperGetPopupTable : function (id) {
            var popup = this.getWidgetDropDownPopup(id);

            if (popup) {
                var table = popup.getElementsByTagName("table")[0];
                if (table) {
                    return table.parentNode;
                }
            }
        },

        runTemplateTest : function () {
            this.synEvent.click(this.getMultiSelectIcon("sb500"), {
                fn : this.onFirstSBOpened,
                scope : this
            });
        },

        onFirstSBOpened : function () {
            aria.core.Timer.addCallback({
                fn : this.onActualFirstMSOpened,
                scope : this,
                delay : 500
            });
        },

        onActualFirstMSOpened : function () {
            var popup = this._helperGetPopupTable("sb500");

            // Should get the fixed width
            this.assertTrue(popup.clientWidth > 480, "SelectBox with width fixed to 500 is too small: "
                    + popup.clientWidth);

            // Try the second autocomplete
            this.synEvent.click(this.getMultiSelectIcon("sb100"), {
                fn : this.onSecondSBOpened,
                scope : this
            });
        },

        onSecondSBOpened : function () {
            aria.core.Timer.addCallback({
                fn : this.onActualSecondSBOpened,
                scope : this,
                delay : 500
            });
        },

        onActualSecondSBOpened : function () {
            var popup = this._helperGetPopupTable("sb100");

            // Should be at least as big as the reference
            this.assertTrue(popup.clientWidth > 200, "SelectBox with width fixed to 100 is too small: "
                    + popup.clientWidth);

            this.notifyTemplateTestEnd();
        }
    }
});

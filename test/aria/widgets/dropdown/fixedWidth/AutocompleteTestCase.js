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
    $classpath : "test.aria.widgets.dropdown.fixedWidth.AutocompleteTestCase",
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
            this.synEvent.click(this.getInputField("ac500"), {
                fn : this.onFirstACFocused,
                scope : this
            });
        },

        onFirstACFocused : function () {
            // Plug the event on the dropdown open
            aria.popups.PopupManager.$onOnce({
                "popupOpen" : {
                    fn : this.onFirstACOpened,
                    scope : this
                }
            });
            this.synEvent.type(this.getInputField("ac500"), "par", {
                fn : function () {},
                scope : this
            });
        },

        onFirstACOpened : function () {
            // maybe FIXME the popupOpen is raised before the popup is actually opened
            aria.core.Timer.addCallback({
                fn : this.onActualFirstACOpen,
                scope : this,
                delay : 500
            });
        },

        onActualFirstACOpen : function () {
            var popup = this._helperGetPopupTable("ac500");

            // Should get the fixed width
            this.assertTrue(popup.clientWidth > 480, "Autocomplete with width fixed to 500 is too small: "
                    + popup.clientWidth);

            // Try the second autocomplete
            this.synEvent.click(this.getInputField("ac100"), {
                fn : this.onSecondACFocused,
                scope : this
            });
        },

        onSecondACFocused : function () {
            aria.popups.PopupManager.$onOnce({
                "popupOpen" : {
                    fn : this.onSecondACOpened,
                    scope : this
                }
            });
            this.synEvent.type(this.getInputField("ac100"), "par", {
                fn : function () {},
                scope : this
            });
        },

        onSecondACOpened : function () {
            aria.core.Timer.addCallback({
                fn : this.onActualSecondACOpen,
                scope : this,
                delay : 500
            });
        },

        onActualSecondACOpen : function () {
            var popup = this._helperGetPopupTable("ac100");

            // Should be at least as big as the reference
            this.assertTrue(popup.clientWidth > 200, "Autocomplete with width fixed to 100 is too small: "
                    + popup.clientWidth);

            this.notifyTemplateTestEnd();
        }
    }
});
/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.issue411.DatePickerTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.form.issue411.DatePicker",
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
            aria.core.Timer.addCallback({
                fn : this.assertPopup,
                scope : this,
                delay : 500
            });
        },

        assertPopup : function () {
            var popup = this._helperGetPopupTable("dp");
            var widgetInstance = this.getWidgetInstance("dp");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the DatePicker is not opened");
            var expandButton = this.getExpandButton("dp");
            this.synEvent.click(expandButton, {
                fn : this.openPopupDropdown,
                scope : this
            });
        },

        openPopupDropdown : function () {
            var popup = this._helperGetPopupTable("dp");
            var widgetInstance = this.getWidgetInstance("dp");
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen is true, where as it was expected to be false");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the DatePicker is still open where as it was expected to be closed.");
            aria.utils.Json.setValue(this.env.data, "popupOpenDP", true);
            aria.core.Timer.addCallback({
                fn : this.assertPopup1,
                scope : this,
                delay : 500
            });
        },

        assertPopup1 : function () {
            var popup = this._helperGetPopupTable("dp");
            var widgetInstance = this.getWidgetInstance("dp");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the DatePicker is not opened");
            aria.utils.Json.setValue(this.env.data, "popupOpenDP", false);
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen is true, where as it was expected to be false");
            popup = this._helperGetPopupTable("dp");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the DatePicker is still open where as it was expected to be closed.");
            var expandButton = this.getExpandButton("dp");
            this.synEvent.click(expandButton, {
                fn : this.assertPopup2,
                scope : this
            });
        },

        assertPopup2 : function () {
            var popup = this._helperGetPopupTable("dp");
            var widgetInstance = this.getWidgetInstance("dp");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the DatePicker is not opened");
            this.notifyTemplateTestEnd();
        }
    }
});

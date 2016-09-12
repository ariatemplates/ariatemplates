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
    $classpath : "test.aria.widgets.form.widgetsfont.WidgetsFontTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Caret", "aria.utils.Date", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.widgetsfont.WidgetsFontTemplate",
            data : {
                multiSelectValue : ["AC"],
                dateFieldValue : new Date("12/11/2014"),
                numberFieldValue : 56,
                passwordFieldValue : "password",
                txtAreaValue : "hello",
                txtFieldValue : "textfield",
                timeFieldValue : aria.utils.Date.interpretTime("12:34"),
                selectBoxValue : "A",
                autoCompleteValue : "Finnair"
            }
        });
        this._widgetIds = ["wv1", "wv2", "wv3", "wv4", "wv5", "wv6", "wv7", "wv8", "wv9", "wv10", "wv11", "wv12",
                "wv28"];
        this._disabledWidgetIds = ["wv13", "wv14", "wv15", "wv16", "wv17", "wv18", "wv19", "wv20", "wv21", "wv22",
                "wv23", "wv24", "wv29"];
        this._buttonWidgetIds = ["wv25", "wv26"];
        this._normalFontObj = {
            fontStyle : "italic",
            fontFamily : "Tahoma",
            fontSize : "17px",
            fontVariant : "small-caps"
        };
        this._disabledFontObj = {
            fontStyle : "italic",
            fontFamily : "Arial",
            fontSize : "19px",
            fontVariant : "small-caps"
        };
        this._currentIndex = 0;
        this.domUtil = aria.utils.Dom;
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._testWidgetsFontStyle,
                scope : this,
                delay : 50
            });

        },
        _testWidgetsFontStyle : function () {
            // for widgets in normal state
            for (var i = 0; i < this._widgetIds.length; i++) {
                this._checkNormalWidgetsFontStyle(i);
            }
            // for widgets in disabled state
            for (var i = 0; i < this._disabledWidgetIds.length; i++) {
                this._checkDisabledWidgetsFontStyle(i);
            }
            // check Button widget font
            this._checkButtonWidgetFontStyle();
        },
        _checkNormalWidgetsFontStyle : function (index) {
            var widgetIndex = this._widgetIds[index];
            var widgetLabel = this.getWidgetInstance(widgetIndex).getLabel();
            // for radiobutton, checkbox and multiautocomplete
            if (!(widgetIndex == "wv11" || widgetIndex == "wv12" || widgetIndex == "wv28")) {
                var widgetInputElt = this.getWidgetInstance(widgetIndex).getTextInputField();
            }
            this._testFontProperties(this._normalFontObj, widgetLabel, widgetInputElt);
        },
        _checkDisabledWidgetsFontStyle : function (index) {
            var widgetIndex = this._disabledWidgetIds[index];
            var widgetLabel = this.getWidgetInstance(widgetIndex).getLabel();
            // for radiobutton, checkbox and multiautocomplete
            if (!(widgetIndex == "wv23" || widgetIndex == "wv24" || widgetIndex == "wv29")) {
                var widgetInputElt = this.getWidgetInstance(widgetIndex).getTextInputField();
            }
            this._testFontProperties(this._disabledFontObj, widgetLabel, widgetInputElt);
        },
        _checkButtonWidgetFontStyle : function (index) {
            // test for normal state
            var buttonElement = Aria.$window.document.getElementsByClassName('xButton_std_normal_c')[0];
            this._testFontProperties(this._normalFontObj, buttonElement, null);
            // test for disabled state
            var buttonElement = Aria.$window.document.getElementsByClassName('xButton_std_disabled_c')[0];
            this._testFontProperties(this._disabledFontObj, buttonElement, null);
            this._checkCalendarWidgetFontStyle();

        },
        _checkCalendarWidgetFontStyle : function () {
            var calendarElement = Aria.$window.document.getElementsByClassName('xCalendar_std_month')[0];
            var fontObj = {
                fontFamily : "Tahoma",
                fontVariant : "small-caps"
            };
            this._testFontProperties(fontObj, calendarElement, null);
            this._checkTabWidgetFontStyle();
        },
        _checkTabWidgetFontStyle : function () {
            // test for normal state
            var tabElement = Aria.$window.document.getElementsByClassName('xTab_std_selected_c')[0];
            this._testFontProperties(this._normalFontObj, tabElement, null);
            // test for disabled state
            var tabElement = Aria.$window.document.getElementsByClassName('xTab_std_disabled_c')[0];
            this._testFontProperties(this._disabledFontObj, tabElement, null);
            this._checkDivWidgetFontStyle();
        },
        _checkDivWidgetFontStyle : function () {
            var divElement = Aria.$window.document.getElementsByClassName('xDiv_std_normal_frame')[0];
            this._testFontProperties(this._normalFontObj, divElement, null);
            this.end();
        },
        _testFontProperties : function (fontObj, widgetLabel, widgetInputElt) {
            for (var prop in fontObj) {
                this.assertEquals(fontObj[prop], aria.utils.Dom.getStyle(widgetLabel, prop), "Expected %1, got %2");
                if (widgetInputElt) {
                    this.assertEquals(fontObj[prop], aria.utils.Dom.getStyle(widgetInputElt, prop), "Expected %1, got %2");
                }
            }
        }

    }
});

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
    $classpath : "test.aria.widgets.form.labelClick.FocusTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Caret", "aria.utils.Date"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.labelClick.FocusTestTemplate",
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
        this._widgetIds = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10", "w11", "w12"];
        this._widgetIdswithValues = ["wv1", "wv2", "wv3", "wv4", "wv5", "wv6", "wv7", "wv8", "wv9", "wv10"];
        this._currentIndex = 0;
    },
    $prototype : {
        runTemplateTest : function () {
            this._testWidgetsFocus();
        },
        _testWidgetsFocus : function () {
            var index = this._currentIndex;
            if (index == this._widgetIds.length) {
                this._currentIndex = 0;
                this._testWidgetsFocuswithValues();
            } else {
                this.clickWidgetLabel(index);
            }
        },
        _testWidgetsFocuswithValues : function () {
            var index = this._currentIndex;
            if (index == this._widgetIdswithValues.length) {
                this.end();
            } else {
                this.clickWidgetLabelwithValues(index);
            }

        },
        clickWidgetLabel : function (index) {
            var widgetLabel = this.getWidgetInstance(this._widgetIds[index]).getLabel();
            this.synEvent.click(widgetLabel, {
                fn : this.checkWidgetFocus,
                scope : this
            });

        },
        clickWidgetLabelwithValues : function (index) {
            var widgetLabel = this.getWidgetInstance(this._widgetIdswithValues[index]).getLabel();
            this.synEvent.click(widgetLabel, {
                fn : this.checkWidgetCaretPos,
                scope : this
            });

        },
        checkWidgetFocus : function () {
            var index = this._currentIndex;
            var active = Aria.$window.document.activeElement;
            var widgetInputElt = this.getWidgetInstance(this._widgetIds[index]).getTextInputField();
            this.assertTrue(widgetInputElt == active, "$focus method failed.");
            this._currentIndex++;
            this._testWidgetsFocus();
        },
        checkWidgetCaretPos : function () {

            var index = this._currentIndex;
            var widgetInputElt = this.getWidgetInstance(this._widgetIdswithValues[index]).getTextInputField();
            var caretPos = aria.utils.Caret.getPosition(widgetInputElt);
            this.assertEquals(caretPos.start, 0, "The start pos of caret is not zero");
            this.assertEquals(caretPos.end, widgetInputElt.value.length, "The end pos of caret is not at the end of the word typed");
            this._currentIndex++;
            this._testWidgetsFocuswithValues();
        }
    }
});

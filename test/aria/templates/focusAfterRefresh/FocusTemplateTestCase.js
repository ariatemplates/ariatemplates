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
    $classpath : "test.aria.templates.focusAfterRefresh.FocusTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.defaultTestTimeout = 30000; // takes ~3s in Fx and up to ~23s in IE8 in dev mode!!! funnily IE7 = ~7s
        this.setTestEnv({
            template : "test.aria.templates.focusAfterRefresh.RefreshTemplate"
        });
        this.widgetPath = ["1", "2", "3", "A", "txtf0"];
    },
    $prototype : {
        runTemplateTest : function () {
            this._testSetGetFocusedWidget();
            this._testSetGetFocusedWidgetAfterRefresh();
            this._testFocusAfterRefresh();
        },

        _testSetGetFocusedWidget : function () {
            this.getWidgetInstance('txtf0').initWidgetDom();
            this.__getInput().focus();
            this.templateCtxt.$setFocusedWidget();
            this._assertWidgetPath();
        },

        _testSetGetFocusedWidgetAfterRefresh : function () {
            this.__clickAndContinue(this.__getButton(), this._buttonClicked1);
        },
        _buttonClicked1 : function () {
            this.__getInput().focus();
            this._assertWidgetPath();
        },

        _testFocusAfterRefresh : function () {
            this.__clickAndContinue(this.__getButton(), this._buttonClicked2);
        },
        _buttonClicked2 : function () {
            this.__clickAndContinue(this.__getInput(), this._focusedWidget);
        },
        _focusedWidget : function () {
            var element = this.__getInput();
            var focusedElement = Aria.$window.document.activeElement;
            this.assertEquals(element.innerHTML, focusedElement.innerHTML, "Widget was not focused after refresh.");
            this._finishTest();
        },

        _finishTest : function () {
            this.notifyTemplateTestEnd();
        },

        _assertWidgetPath : function () {
            var Ids = this.templateCtxt.$getFocusedWidget();
            this.assertEquals(Ids.length, this.widgetPath.length, "The widget path was empty! It should be: '"
                    + this.widgetPath + "'");
            for (var i = 0; i < Ids.length; i++) {
                this.assertEquals(this.widgetPath[i], Ids[i], "The widget path is incorrect. It should be '"
                        + this.widgetPath[i] + "' but instead it is '" + Ids[i] + "'.");
            }
        },
        __getButton : function () {
            return this.getElementById("refreshPage");
        },
        __getInput : function () {
            return Aria.$window.document.getElementsByTagName("input")[0];
        },
        __clickAndContinue : function (elm, continueWith) {
            this.synEvent.click(elm, {
                fn : continueWith,
                scope : this
            });
        }
    }
});

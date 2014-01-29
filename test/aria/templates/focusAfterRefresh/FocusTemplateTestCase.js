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
            this.__getInput().focus();
            this.templateCtxt.$setFocusedWidget();
            this._assertWidgetPath();
        },

        _testSetGetFocusedWidgetAfterRefresh : function () {
            this.templateCtxt.$refresh();
            this._assertWidgetPath();
        },

        _testFocusAfterRefresh : function () {
            var element = this.__getInput();
            var focusedElement = Aria.$window.document.activeElement;
            this.assertEquals(element, focusedElement, "Widget was not focused after refresh.");
            this.end();
        },

        _assertWidgetPath : function () {
            var ids = this.templateCtxt.$getFocusedWidget();
            this.assertEquals(ids.length, this.widgetPath.length, "The widget path was not correct. It should be: '"
                    + this.widgetPath + "'");
            for (var i = 0; i < ids.length; i++) {
                this.assertEquals(this.widgetPath[i], ids[i], "The widget path is incorrect. It should be '"
                        + this.widgetPath[i] + "' but instead it is '" + ids[i] + "'.");
            }
        },
        __getInput : function () {
            return this.getInputField("txtf0");
        }
    }
});

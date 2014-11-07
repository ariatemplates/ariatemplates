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
    $classpath : "test.aria.widgets.form.select.checkStates.SelectStatesTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var select = this.getWidgetInstance("mySelect").getSelectField();
            this.synEvent.click(select, {
                fn : this._waitForOpen,
                scope : this
            });
        },

        _waitForOpen : function () {
            var testCase = this;
            this.waitFor({
                condition : function () {
                    return aria.popups.PopupManager.openedPopups.length > 0;
                },
                callback : {
                    fn : this._afterOpen,
                    scope : this
                }
            });
        },

        _afterOpen : function () {
            var popupDom = aria.popups.PopupManager.openedPopups[0].domElement;
            this.synEvent.click(popupDom.getElementsByTagName("a")[2], {
                fn : this._afterPopupClose,
                scope : this
            });
        },

        _afterPopupClose : function () {
            this.synEvent.click(this.getElementById("clickHelper"), {
                fn : this._checkState,
                scope : this
            });
        },

        _checkState : function () {
            var select = this.getWidgetInstance("mySelect").getSelectField();
            var container = select.parentNode.parentNode.parentNode;
            this.assertTrue(container.className.indexOf("normalFocused") == -1, "The select shouldn't have the focused state");
            this.end();
        }
    }
});

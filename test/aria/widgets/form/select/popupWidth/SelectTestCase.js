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
    $classpath : "test.aria.widgets.form.select.popupWidth.SelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.core.Timer"],
    $prototype : {
        runTemplateTest : function () {
            var select = this.getWidgetInstance("mySelect2").getSelectField();
            this.synEvent.click(select, {
                fn : this._selectClicked2,
                scope : this
            });
        },

        _selectClicked2 : function () {
            aria.core.Timer.addCallback({
                fn : this._afterDelay,
                scope : this,
                delay : 500
            });
        },

        _afterDelay : function () {
            // get the width of the popup
            var popupDom = aria.popups.PopupManager.openedPopups[0].domElement;
            var popupWidth = popupDom.offsetWidth;
            this.assertTrue(popupWidth == 300);
            this.synEvent.click(this.getElementById("clickHelper"), {
                fn : this._afterPopupClose,
                scope : this
            });
        },

        _afterPopupClose : function () {
            var select = this.getWidgetInstance("mySelect1").getSelectField();
            this.synEvent.click(select, {
                fn : this._selectClicked1,
                scope : this
            });
        },

        _selectClicked1 : function () {
            aria.core.Timer.addCallback({
                fn : this._afterDelay1,
                scope : this,
                delay : 500
            });
        },

        _afterDelay1 : function () {
            // get the width of the popup
            var popupDom = aria.popups.PopupManager.openedPopups[0].domElement;
            var popupWidth = popupDom.offsetWidth;
            this.assertTrue(popupWidth == 120);
            this.notifyTemplateTestEnd();
        }
    }
});
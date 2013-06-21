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
    $classpath : "test.aria.widgets.container.dialog.checkStyle.DialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.checkStyle.DialogTestCaseTpl",
            data : this.data

        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._count = 0;
            this._checkDialogVisible();
        },

        _checkDialogVisible : function () {
            // we do the test twice to check that sections are correctly kept
            this._count++;
            this._checkStyle("dialogDivToCheck");
            this._showTooltip();
        },

        _showTooltip : function () {
            var link = this.getWidgetDomElement("myLink", "a");
            var position = aria.utils.Dom.calculatePosition(link);
            this.synEvent.move({
                from : {
                    clientX : 100,
                    clientY : 100
                },
                to : {
                    clientX : position.left + 5,
                    clientY : position.top + 5
                },
                duration : 300
            }, Aria.$window.document.body, {
                fn : this._waitTooltipLoaded,
                scope : this
            });
        },

        _waitTooltipLoaded : function () {
            // hide the dialog:
            aria.utils.Json.setValue(this.data, "dialogVisible", false);
            aria.core.Timer.addCallback({
                fn : this._checkTooltip,
                scope : this,
                delay : 1000
            });
        },

        _checkTooltip : function () {
            // check the dialog was hidden:
            var dialogDiv = this.getElementById("dialogDivToCheck");
            this.assertTrue(dialogDiv == null, "Dialog was not hidden.");

            // then check tooltip:
            this._checkStyle("tooltipDivToCheck");

            // and hide the tooltip:
            var link = this.getWidgetDomElement("myLink", "a");
            var position = aria.utils.Dom.calculatePosition(link);
            this.synEvent.move({
                from : {
                    clientX : position.left + 5,
                    clientY : position.top + 5
                },
                to : {
                    clientX : 100,
                    clientY : 100
                },
                duration : 300
            }, Aria.$window.document.body, {
                fn : this._waitTooltipHidden,
                scope : this
            });
        },

        _waitTooltipHidden : function () {
            try {
                aria.utils.Json.setValue(this.data, "dialogVisible", true);
                aria.core.Timer.addCallback({
                    fn : this._count > 1 ? this.notifyTemplateTestEnd : this._checkDialogVisible,
                    scope : this,
                    delay : 1000
                });
            } catch (e) {
                this.handleAsyncTestError(e, true);
            }
        },

        _checkStyle : function (id) {
            var div = this.getElementById(id);
            this.assertTrue(div != null, "Item with id " + id + " was not found in DOM");
            this.assertTrue(aria.utils.Dom.getStyle(div, "fontSize") == "32px", "CSS Template was not applied to " + id);
        }
    }
});

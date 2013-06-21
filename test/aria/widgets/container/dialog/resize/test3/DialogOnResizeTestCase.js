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
    $classpath : "test.aria.widgets.container.dialog.resize.test3.DialogOnResizeTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.resize.test3.DialogOnResizeTemplate",
            data : this.data,
            iframe : true
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var doc = this.testDocument;
            var dialogContent = doc.getElementById("dialogContent");
            this._input = dialogContent.getElementsByTagName("input")[0];
            var inputPosition = this.testWindow.aria.utils.Dom.getGeometry(this._input);
            this.synEvent.click({
                x : inputPosition.x + inputPosition.width / 2,
                y : inputPosition.y + inputPosition.height / 2

            }, {
                fn : this._afterClick,
                scope : this
            });
        },

        _afterClick : function () {
            this.synEvent.type(this._input, "blah", {
                fn : this._afterType,
                scope : this
            });
        },

        _afterType : function () {
            this._input.blur();
            this._input.focus();
            this.testIframe.style.width = "600px";
            this.testIframe.style.height = "600px";

            aria.core.Timer.addCallback({
                fn : this._afterResize,
                scope : this,
                delay : 1000
            });
        },

        _afterResize : function () {
            this.numberField = this.getWidgetInstance("myNumberField");
            var popupElem = this.numberField._onValidatePopup._validationPopup.domElement;
            var popupPos = this.testWindow.aria.utils.Dom.getGeometry(popupElem);

            var tolerance = 10;
            var expectedLeft = 311;
            var expectedTop = 223;

            var left = popupPos.x;
            var top = popupPos.y;

            this.assertEqualsWithTolerance(left, expectedLeft, tolerance, "Bad offset from left: "
                    + left + ", should be ~311");
            this.assertEqualsWithTolerance(top, expectedTop, tolerance, "Bad offset from top: "
                    + top + ", should be ~ 223");
            this.notifyTemplateTestEnd();
        }

    }
});
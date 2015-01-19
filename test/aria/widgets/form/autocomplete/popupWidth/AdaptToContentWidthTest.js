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
    $classpath : "test.aria.widgets.form.autocomplete.popupWidth.AdaptToContentWidthTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.popupWidth.AdaptToContentWidthTpl"
        });

    },
    $prototype : {

        runTemplateTest : function () {
            var field = this.getInputField("ac");
            this.synEvent.execute([["click", field], ["type", field, "a"]], {
                fn : this._afterTyping,
                scope : this
            });
        },

        _afterTyping : function () {
            var testCase = this;

            this.waitFor({
                condition : function () {
                    return !!testCase.getWidgetDropDownPopup("ac");
                },
                callback : function () {
                    testCase.$callback({
                        fn : testCase._afterDropdownOpen,
                        scope : testCase
                    });
                }
            });
        },

        _afterDropdownOpen : function () {
            this._checkDropdownWidth();
            var field = this.getInputField("ac");
            this.synEvent.execute([["type", field, "[BACK_SPACE]a"]], {
                fn : this._afterSecondDropdownOpen,
                scope : this
            });

        },

        _afterSecondDropdownOpen : function () {
            this._checkDropdownWidth();
            this.end();
        },

        _checkDropdownWidth : function () {
            var listContainer = this.getElementById("Items", false, this.getWidgetInstance("ac").controller.getListWidget()._subTplCtxt);
            var list = listContainer.getElementsByTagName("tbody")[0].children;
            var domUtil = aria.utils.Dom, geometry, containerGeometry = domUtil.getGeometry(listContainer), containerRight = containerGeometry.x
                    + containerGeometry.width;

            for (var i = 0, len = list.length; i < len; i++) {
                geometry = domUtil.getGeometry(list[i]);
                if (geometry) {
                    this.assertTrue(domUtil.getGeometry(list[i]).height < 22, "Entry number " + i
                            + " in the dropdown does not fit in one line");
                    this.assertEqualsWithTolerance(geometry.x + geometry.width, containerRight, 2, "Too much space between suggestion "
                            + i + " and the end of the container");
                }
            }
        }

    }
});

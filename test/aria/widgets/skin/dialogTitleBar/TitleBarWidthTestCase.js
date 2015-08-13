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

/**
 * Test case for test.aria.widgets.skin.dialogTitleBar.DialogTitleBarTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.skin.dialogTitleBar.TitleBarWidthTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.skin.dialogTitleBar.TitleBarWidth"
        });
    },
    $prototype : {
        /**
         * Test base layout
         */
        runTemplateTest : function () {
            this._checkCloseButtonPosition("theDialog");
            this.end();
        },

        getDialogCloseButton : function (titleBar) {
            var child = titleBar.lastChild;
            while (child && ! (/close/.test(child.className))) {
                child = child.previousSibling;
            }
            return child;
        },

        _checkCloseButtonPosition : function (id) {
            var dialog = this.getWidgetInstance(id);
            var titleBar = dialog._titleBarDomElt;
            var closeButton = this.getDialogCloseButton(titleBar);
            var titleBarGeometry = aria.utils.Dom.getGeometry(titleBar);
            var closeButtonGeometry = aria.utils.Dom.getGeometry(closeButton);
            this.assertEquals(titleBarGeometry.y, closeButtonGeometry.y);
        }
    }
});
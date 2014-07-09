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
    $classpath : "test.aria.widgets.skin.dialogTitleBar.DialogTitleBarTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.skin.dialogTitleBar.DialogTitleBarTestCaseTpl",
            data : this.data

        });
    },
    $prototype : {
        /**
         * Test base layout
         */
        runTemplateTest : function () {
            this._checkStyle("myDialog");
            this.end();
        },

        _checkStyle : function (id) {
            var div = this.getWidgetDomElement(id, "div");
            var titleBkgColor = aria.utils.Dom.getStyle(div, "backgroundColor");

            var titleBorderTopLeftRadius = aria.utils.Dom.getStyle(div, "borderTopLeftRadius");
            var titleBorderTopRightRadius = aria.utils.Dom.getStyle(div, "borderTopRightRadius");
            var titleBorderBottomLeftRadius = aria.utils.Dom.getStyle(div, "borderBottomLeftRadius");
            var titleBorderBottomRightRadius = aria.utils.Dom.getStyle(div, "borderBottomRightRadius");

            var titleBorderTopStyle = aria.utils.Dom.getStyle(div, "borderTopStyle");
            var titleBorderBottomStyle = aria.utils.Dom.getStyle(div, "borderBottomStyle");
            var titleBorderLeftStyle = aria.utils.Dom.getStyle(div, "borderLeftStyle");
            var titleBorderRightStyle = aria.utils.Dom.getStyle(div, "borderRightStyle");

            var titleBorderTopColor = aria.utils.Dom.getStyle(div, "borderTopColor");
            var titleBorderBottomColor = aria.utils.Dom.getStyle(div, "borderBottomColor");
            var titleBorderLeftColor = aria.utils.Dom.getStyle(div, "borderLeftColor");
            var titleBorderRightColor = aria.utils.Dom.getStyle(div, "borderRightColor");

            var titleBorderTopWidth = aria.utils.Dom.getStyle(div, "borderTopWidth");
            var titleBorderBottomWidth = aria.utils.Dom.getStyle(div, "borderBottomWidth");
            var titleBorderLeftWidth = aria.utils.Dom.getStyle(div, "borderLeftWidth");
            var titleBorderRightWidth = aria.utils.Dom.getStyle(div, "borderRightWidth");

            var titlePaddingTop = aria.utils.Dom.getStyle(div, "paddingTop");
            var titlePaddingBottom = aria.utils.Dom.getStyle(div, "paddingBottom");
            var titlePaddingLeft = aria.utils.Dom.getStyle(div, "paddingLeft");
            var titlePaddingRight = aria.utils.Dom.getStyle(div, "paddingRight");

            this.assertTrue(titleBkgColor.search('rgb\\(189, 195, 199\\)') === 0 || titleBkgColor.search('#bdc3c7') === 0, "The skin property background-color is not applied to the title bar of the dialog widget");

            if (!aria.core.Browser.isIE8) {
                this.assertTrue(titleBorderTopLeftRadius.search('6px') === 0, "The skin property border-radius is not applied to the title bar of the dialog widget");
                this.assertTrue(titleBorderTopRightRadius.search('6px') === 0, "The skin property border-radius is not applied to the title bar of the dialog widget");
                this.assertTrue(titleBorderBottomLeftRadius.search('0px') === 0, "The skin property border-radius is not applied to the title bar of the dialog widget");
                this.assertTrue(titleBorderBottomRightRadius.search('0px') === 0, "The skin property border-radius is not applied to the title bar of the dialog widget");
            }

            this.assertTrue(titleBorderTopStyle.search('solid') === 0, "The skin property border-style is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderBottomStyle.search('solid') === 0, "The skin property border-style is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderLeftStyle.search('solid') === 0, "The skin property border-style is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderRightStyle.search('solid') === 0, "The skin property border-style is not applied to the title bar of the dialog widget");

            this.assertTrue(titleBorderTopColor.search('rgb\\(52, 73, 94\\)') === 0 || titleBorderTopColor.search('#34495e') === 0, "The skin border-color is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderBottomColor.search('rgb\\(52, 73, 94\\)') === 0 || titleBorderBottomColor.search('#34495e') === 0, "The skin border-color is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderLeftColor.search('rgb\\(52, 73, 94\\)') === 0 || titleBorderLeftColor.search('#34495e') === 0, "The skin border-color is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderRightColor.search('rgb\\(52, 73, 94\\)') === 0 || titleBorderRightColor.search('#34495e') === 0, "The skin border-color is not applied to the title bar of the dialog widget");

            this.assertTrue(titleBorderTopWidth.search('0px') === 0, "The skin property border-width is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderBottomWidth.search('1px') === 0, "The skin property border-width is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderLeftWidth.search('0px') === 0, "The skin property border-width is not applied to the title bar of the dialog widget");
            this.assertTrue(titleBorderRightWidth.search('0px') === 0, "The skin property border-width is not applied to the title bar of the dialog widget");

            this.assertTrue(titlePaddingTop.search('0px') === 0, "The skin property padding is not applied to the title bar of the dialog widget");
            this.assertTrue(titlePaddingBottom.search('0px') === 0, "The skin property padding is not applied to the title bar of the dialog widget");
            this.assertTrue(titlePaddingLeft.search('0px') === 0, "The skin property padding is not applied to the title bar of the dialog widget");
            this.assertTrue(titlePaddingRight.search('10px') === 0, "The skin property padding is not applied to the title bar of the dialog widget");
        }
    }
});
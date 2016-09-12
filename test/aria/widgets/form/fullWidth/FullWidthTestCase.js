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
    $classpath : "test.aria.widgets.form.fullWidth.FullWidthTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.ClassList", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.fullWidth.FullWidthTemplate"
        });
        this._widgetIds = ["tf101", "tf201", "pf101", "nf101", "tmf101", "tf301", "ac101", "ac201", "ac301", "ac401", "tf100", "tf200", "pf100", "nf100", "tmf100", "tf300", "ac100", "ac200", "ac300", "ac400"];

        this.domUtil = aria.utils.Dom;
        this.classList = aria.utils.ClassList;
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._testWidgetsStyle,
                scope : this,
                delay : 50
            });
        },

        _testWidgetsStyle : function () {
            for (var i = 0; i < this._widgetIds.length; i++) {
                var widgetObj = this._getWidgetObject(this._widgetIds[i]);
                this._checkCssClassesAdded(widgetObj);

                var widgetGeometry = this._getWidgetGeomety(widgetObj);
                this._checkGeometry(widgetGeometry);
            }

            this.end();
        },

        _getWidgetObject : function(widgetIndex) {
            var obj = {
                instance : this.getWidgetInstance(widgetIndex),
                container : this.getElementById(widgetIndex),
                label : this.getWidgetInstance(widgetIndex).getLabel(),
                inputContainer : this.getWidgetDomElement(widgetIndex, "span"),
                inputField : this.getInputField(widgetIndex)
            };

            var middle = this.domUtil.getDomElementsChildByTagName(obj.inputContainer, "span");
            if (middle && middle.length > 0) {
                obj.middleContainer = middle[1];
            }

            return obj;
        },

        _getWidgetGeomety : function(widgetObj) {
            return {
                container : this.domUtil.getGeometry(widgetObj.container).width,
                label : this.domUtil.getGeometry(widgetObj.label).width,
                labelPos : widgetObj.instance._cfg.labelPos,
                inputContainer : this.domUtil.getGeometry(widgetObj.inputContainer).width,
                middleContainer : widgetObj.middleContainer ? this.domUtil.getGeometry(widgetObj.middleContainer).width : null,
                input : this.domUtil.getGeometry(widgetObj.inputField).width
            };
        },

        _checkCssClassesAdded : function (widgetObj) {
            var widgetContainerCssClass = new this.classList(widgetObj.container);

            if (widgetObj.instance._fullWidth) {
                var widgetLabelCssClass = new this.classList(widgetObj.label);

                if (widgetObj.instance._cfg.labelPos === "right") {
                    this.assertTrue(widgetLabelCssClass.contains("xFloatLabelRight"), "The class 'xFloatLabelRight' was not added to the widget label.");
                } else if (widgetObj.instance._cfg.labelPos === "left") {
                    this.assertTrue(widgetLabelCssClass.contains("xFloatLabelLeft"), "The class 'xFloatLabelLeft' was not added to the widget label.");
                } else {
                    this.assertFalse(widgetLabelCssClass.contains("xFloatLabelLeft"), "The class 'xFloatLabelLeft' was added to the widget label, but the labelPos configuration is not 'left'.");
                    this.assertFalse(widgetLabelCssClass.contains("xFloatLabelRight"), "The class 'xFloatLabelRight' was added to the widget label, but the labelPos configuration is not 'right'.");
                }

                this.assertTrue(widgetContainerCssClass.contains("xFullWidth"), "The class 'xFullWidth' was not added to the widget container.");
                widgetLabelCssClass.$dispose();
            } else {
                this.assertFalse(widgetContainerCssClass.contains("xFullWidth"), "The class 'xFullWidth' was added to the widget container, but its configuration is not in fullWidth.");
            }
            widgetContainerCssClass.$dispose();
        },

        _checkGeometry : function(widgetGeometry) {
            if (widgetGeometry.labelPos === "top" || widgetGeometry.labelPos === "bottom") {
                this.assertEqualsWithTolerance(widgetGeometry.container, widgetGeometry.inputContainer, 5, "The widget is not taking the whole available width of its container, expected = %1, actual = %2.");
            } else {
                this.assertEqualsWithTolerance(widgetGeometry.container, (widgetGeometry.label + widgetGeometry.inputContainer), 5, "The widget is not taking the whole available width of its container, expected = %1, actual = %2.");
            }

            if (widgetGeometry.middleContainer != null) {
                this.assertEqualsWithTolerance(widgetGeometry.middleContainer, widgetGeometry.input, 5, "The input field is not taking the whole available width of its container, expected = %1, actual = %2.");
            } else {
                this.assertEqualsWithTolerance(widgetGeometry.inputContainer, widgetGeometry.input, 5, "The input field is not taking the whole available width of its container, expected = %1, actual = %2.");
            }
        }
    }
});

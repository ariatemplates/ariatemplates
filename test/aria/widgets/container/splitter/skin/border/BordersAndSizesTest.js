/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.container.splitter.skin.border.BordersAndSizesTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.$constructor.call(this);

        this._sclasses = ["sclassOne", "sclassTwo", "sclassThree", "sclassFour"];

        this._currentScenario = 0;

        this._data = {
            border : true,
            height : 500,
            width : 500,
            size1 : 100,
            sclass : this._sclasses[this._currentScenario],
            orientation : "horizontal",
            sizeA : 0,
            sizeB : 300
        };

        this.setTestEnv({
            data : this._data
        });
    },
    $prototype : {
        borders : {
            "sclassOne" : {
                container : {
                    width : 8,
                    top : 1,
                    bottom : 2,
                    left : 2,
                    right : 1
                },
                separator : {
                    height : 10,
                    width : 10,
                    top : 1,
                    bottom : 2,
                    left : 2,
                    right : 1
                },
                panel : {
                    top : 1,
                    bottom : 2,
                    left : 2,
                    right : 1
                }
            },
            "sclassTwo" : {
                container : {
                    top : 10,
                    bottom : 10,
                    left : 10,
                    right : 10
                },
                separator : {
                    height : 5,
                    width : 5,
                    top : 5,
                    bottom : 5,
                    left : 5,
                    right : 5
                },
                panel : {
                    top : 5,
                    bottom : 5,
                    left : 5,
                    right : 5
                }
            },
            "sclassThree" : {
                container : {
                    width : 5,
                    top : 10,
                    bottom : 10,
                    left : 10,
                    right : 10
                },
                separator : {
                    height : 5,
                    width : 5,
                    top : 5,
                    bottom : 5,
                    left : 5,
                    right : 5
                },
                panel : {
                    top : 5,
                    bottom : 5,
                    left : 5,
                    right : 5
                }
            },
            "sclassFour" : {
                container : {
                    width : 0,
                    top : 10,
                    bottom : 10,
                    left : 10,
                    right : 10
                },
                separator : {
                    height : 5,
                    width : 5,
                    top : 5,
                    bottom : 5,
                    left : 5,
                    right : 5
                },
                panel : {
                    top : 5,
                    bottom : 5,
                    left : 5,
                    right : 5
                }
            }
        },

        setUp : function () {
            var splitterSkin = aria.widgets.AriaSkin.skinObject.Splitter, newSkin;

            for (var sclass in this.borders) {
                var values = this.borders[sclass];
                newSkin = splitterSkin[sclass] = aria.utils.Json.copy(splitterSkin.std);
                newSkin.separatorBorder = this.getBorders(values.separator);
                newSkin.panelBorder = this.getBorders(values.panel);
                newSkin.separatorWidth = values.separator.width;
                newSkin.separatorHeight = values.separator.height;
                newSkin.borderColor = "black";
                newSkin.borderTopWidth = values.container.top;
                newSkin.borderBottomWidth = values.container.bottom;
                newSkin.borderLeftWidth = values.container.left;
                newSkin.borderRightWidth = values.container.right;

                if (values.container.width || values.container.width === 0) {
                    newSkin.borderWidth = values.container.width;
                }
            }
        },
        getBorders : function (values) {
            return {
                color : "grey",
                style : "solid",
                topWidth : values.top,
                bottomWidth : values.bottom,
                leftWidth : values.left,
                rightWidth : values.right
            };
        },

        runTemplateTest : function () {
            this._performScenario();

            for (var i = 1; i < this._sclasses.length; i++) {
                this._data.sclass = this._sclasses[i];
                this._currentScenario = i;
                this._performScenario();
            }
            this.end();
        },

        _performScenario : function () {
            this._data.orientation = "horizontal";
            this.templateCtxt.$refresh();

            this._performTest("sizeA", 0);
            this._performTest("sizeA", 200);
            this._performTest("sizeB", 200);
            this._performTest("sizeB", 10);

            this._data.orientation = "vertical";
            this.templateCtxt.$refresh();

            this._performTest("sizeA", 0);
            this._performTest("sizeA", 200);
            this._performTest("sizeB", 200);
            this._performTest("sizeB", 10);
        },

        _performTest : function (property, value) {
            aria.utils.Json.setValue(this._data, property, value);

            var actual = this._getRealMeasures();
            var expected = this._getExpectedMeasures();

            this.assertTrue(aria.utils.Json.equals(actual, expected), "The actual values are different from the expected ones.");
            this.templateCtxt.$refresh();
            var actual = this._getRealMeasures();
            var expected = this._getExpectedMeasures();

            this.assertTrue(aria.utils.Json.equals(actual, expected), "The actual values are different from the expected ones.");
        },

        _getRealMeasures : function () {
            var instance = this.getWidgetInstance("splitter");
            var fullSplitter = instance._domElt.children[0];
            var splitBar = instance._splitBar;
            var splitBarProxy = instance._splitBarProxy;
            var panel1 = instance._splitPanel1;
            var panel2 = instance._splitPanel2;
            var output = {
                container : this._getStyleProperties(fullSplitter),
                panel1 : this._getStyleProperties(panel1),
                panel2 : this._getStyleProperties(panel2),
                separator : this._getStyleProperties(splitBar),
                separatorProxy : this._getStyleProperties(splitBarProxy)
            };
            output.separator.top = aria.utils.Dom.getStylePx(splitBar, "top", 0);
            output.separator.left = aria.utils.Dom.getStylePx(splitBar, "left", 0);
            output.separatorProxy.top = aria.utils.Dom.getStylePx(splitBarProxy, "top", 0);
            output.separatorProxy.left = aria.utils.Dom.getStylePx(splitBarProxy, "left", 0);

            return output;
        },

        _getStyleProperties : function (element) {
            var dom = aria.utils.Dom;
            return {
                // width : dom.getStylePx(element, "width"),
                width : parseInt(element.style.width, 10) || aria.utils.Dom.getStylePx(element, "width"),
                // height : dom.getStylePx(element, "height"),
                height : parseInt(element.style.height, 10) || aria.utils.Dom.getStylePx(element, "height"),
                border : {
                    top : dom.getStylePx(element, "borderTopWidth", 0),
                    bottom : dom.getStylePx(element, "borderBottomWidth", 0),
                    left : dom.getStylePx(element, "borderLeftWidth", 0),
                    right : dom.getStylePx(element, "borderRightWidth", 0)
                }
            };
        },

        _getExpectedMeasures : function (splitterId) {
            var borders = this.borders[this._sclasses[this._currentScenario]], data = this._data;
            var output = {};

            var borderWidth = borders.container.width || borders.container.width === 0;
            output.container = {
                width : borderWidth ? data.width - borders.container.width * 2 : data.width - borders.container.left
                        - borders.container.right,
                height : borderWidth ? data.height - borders.container.width * 2 : data.height - borders.container.top
                        - borders.container.bottom,
                border : {
                    top : borderWidth ? borders.container.width : borders.container.top,
                    bottom : borderWidth ? borders.container.width : borders.container.bottom,
                    left : borderWidth ? borders.container.width : borders.container.left,
                    right : borderWidth ? borders.container.width : borders.container.right
                }
            };

            output.panel1 = {
                border : {
                    top : borders.panel.top,
                    bottom : borders.panel.bottom,
                    left : borders.panel.left,
                    right : borders.panel.right
                }
            };
            output.panel2 = {
                border : output.panel1.border
            };
            output.separator = {
                border : {
                    top : borders.separator.top,
                    bottom : borders.separator.bottom,
                    left : borders.separator.left,
                    right : borders.separator.right
                }
            };
            output.separatorProxy = output.separator;

            var container = output.container;
            var separator = output.separator;
            var panel1 = output.panel1;
            var panel2 = output.panel2;
            var sizeA = data.sizeA;
            var sizeB = data.sizeB;
            var splitterBarPos;

            var panelBorder = data.orientation == "vertical"
                    ? separator.border.left + separator.border.right
                    : separator.border.top + separator.border.bottom;
            if (sizeA === 0) {
                splitterBarPos = 0;
            } else {
                splitterBarPos = sizeA + panelBorder;
            }

            if (data.orientation == "vertical") {
                panel1.height = container.height - panel1.border.top - panel1.border.bottom;
                panel1.width = sizeA;
                panel2.height = panel1.height;
                panel2.width = sizeB;
                separator.width = borders.separator.width;
                separator.height = container.height - separator.border.top - separator.border.bottom;
                separator.top = 0;
                separator.left = splitterBarPos;
            } else {
                panel1.height = sizeA;
                panel1.width = container.width - panel1.border.left - panel1.border.right;
                panel2.height = sizeB;
                panel2.width = panel1.width;
                separator.height = borders.separator.height;
                separator.width = container.width - separator.border.left - separator.border.right;
                separator.top = splitterBarPos;
                separator.left = 0;
            }

            return output;
        }
    }
});
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
 * Test case for aria.widgets.form.GaugeTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.issue746.SkinClassFallbackTestCase",
    $dependencies : ["aria.jsunit.helpers.OutObj", "aria.templates.View"],
    $extends : "aria.jsunit.WidgetTestCase",
    $constructor : function () {
        this.$WidgetTestCase.constructor.call(this);
        this.__widgets = [{
                    name : "aria.widgets.container.Fieldset",
                    isContainer : true
                }, {
                    name : "aria.widgets.action.Button"
                }, {
                    name : "aria.widgets.action.IconButton",
                    cfg : {
                        icon : "std:collapse"
                    }
                }, {
                    name : "aria.widgets.calendar.Calendar"
                }, {
                    name : "aria.widgets.container.Dialog",
                    isContainer : true,
                    checkInnerHTML : false,
                    cfg : {
                        contentMacro : "dialogMacro"
                    }
                }, // how to config?
                {
                    name : "aria.widgets.action.Link"
                }, {
                    name : "aria.widgets.container.Div",
                    isContainer : true
                }, {
                    name : "aria.widgets.form.TextField"
                }, {
                    name : "aria.widgets.form.Textarea"
                }, {
                    name : "aria.widgets.container.Splitter",
                    isContainer : true,
                    cfg : {
                        border : true,
                        height : 150,
                        width : 150,
                        macro1 : 'PanelOne',
                        macro2 : 'PanelTwo'
                    }
                }, // how to config?
                {
                    name : "aria.widgets.container.Tab",
                    isContainer : true,
                    cfg : {
                        tabId : "tabId"
                    }
                }, {
                    name : "aria.widgets.container.TabPanel",
                    isContainer : true,
                    cfg : {
                        id : "myId",
                        macro : "myMacro"
                    }
                }, {
                    name : "aria.widgets.form.PasswordField"
                }, {
                    name : "aria.widgets.form.DateField"
                }, {
                    name : "aria.widgets.form.DatePicker"
                }, {
                    name : "aria.widgets.form.MultiSelect",
                    cfg : {
                        items : ["a", "b", "c"]
                    }
                }, {
                    name : "aria.widgets.form.TimeField"
                }, {
                    name : "aria.widgets.form.NumberField"
                }, {
                    name : "aria.widgets.form.AutoComplete",
                    cfg : {
                        resourcesHandler : function (param) {}
                    }
                }, {
                    name : "aria.widgets.form.CheckBox",
                    cfg : {
                        label : "Label"
                    }
                }, {
                    name : "aria.widgets.form.RadioButton",
                    cfg : {
                        label : "Label"
                    }
                },
                // {name : "aria.widgets.Icon", cfg : {icon: "std:collapse"}}, //sclass not used in the widgets markup?
                {
                    name : "aria.widgets.form.SelectBox"
                }, {
                    name : "aria.widgets.form.Select"
                },
                // {name : "aria.widgets.action.SortIndicator", cfg : {sortName : 'SortByName', label : 'Label', view:
                // new aria.templates.View([0, 1, 2, 3, 4])}},
                {
                    name : "aria.widgets.form.list.List",
                    checkInnerHTML : false
                }, {
                    name : "aria.widgets.errorlist.ErrorList",
                    checkInnerHTML : false
                }];
    },
    $prototype : {
        _createWidget : function (widgetName, cfg, isContainer) {
            return {
                instance : isContainer
                        ? this.createContainerAndInit(widgetName, cfg)
                        : this.createAndInit(widgetName, cfg),
                dom : this.outObj.testArea.childNodes[0]
            };
        },
        _destroyWidget : function (_inst) {
            _inst.$dispose();
            this.outObj.clearAll();
        },
        testAsyncAllWidgets : function () {
            // Load all widgets needed for the test and then test them
            Aria.load({
                classes : this.__widgets.map(this.__mappingFn),
                oncomplete : {
                    fn : this.__performTests,
                    scope : this
                }
            });
        },
        // method used to extract the widgetname from the testconfig
        __mappingFn : function (value) {
            return value.name;
        },
        __performTests : function () {
            while (this.__widgets.length > 0) {
                var testConfig = this.__widgets.shift();
                var widgetName = testConfig.name;
                var cfg = testConfig.cfg || {};
                var isContainer = testConfig.isContainer;

                var wrongSclass = "doesntExist";
                // if there is a sclass specified for the test use this, else use the default for the tests defined
                // above
                if (cfg.sclass) {
                    wrongSclass = cfg.sclass;
                } else {
                    cfg.sclass = wrongSclass;
                }

                var tf = this._createWidget(widgetName, cfg, isContainer);

                var instance = tf.instance;
                var correctClassName = ["x", tf.instance._skinnableClass, "_std"].join('');
                var wrongClassName = ["x", tf.instance._skinnableClass, "_", wrongSclass].join('');

                try {
                    // check the config was changed to use std as sclass because the given sclass should not exist in
                    // the skin
                    this.assertEquals("std", instance._cfg.sclass, "The style class '" + instance._cfg.sclass
                            + "' does not match the expected 'std' for widgetName " + widgetName);

                    var checkInnerHTML = true;
                    if (testConfig.checkInnerHTML !== undefined) {
                        checkInnerHTML = testConfig.checkInnerHTML;
                    }
                    if (checkInnerHTML) {

                        if (tf.dom === undefined || tf.dom.innerHTML === undefined) {
                            this.$logWarn("InnerHTML should be checked but it is undefined for widget " + widgetName);
                        } else {
                            // check that the markup is generated using the fallback sclass
                            this.assertTrue(tf.dom.innerHTML.indexOf(correctClassName) > -1, "In the innerHTML the className '"
                                    + correctClassName + "' could not be found for widget " + widgetName);
                            // make sure that there is no occurence of the wrong sclass
                            this.assertTrue(tf.dom.innerHTML.indexOf(wrongClassName) == -1, "Class name should not use the given sclass "
                                    + wrongClassName);
                        }
                    }
                } finally {
                    this._destroyWidget(instance);
                }
            }
            this.notifyTestEnd("testAsyncAllWidgets");
        }
    }
});

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
 * Test case for aria.widgets.form.Input
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.InputTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.environment.WidgetSettings"],
    $prototype : {
        $init : function (p) {
            p.__json = aria.utils.Json;
        },
        /**
         * Internal helper method to create an InputCfg object
         */
        _getCfg : function (labelPos) {
            var cfg = {
                label : "Some text",
                labelPos : labelPos
            }
            return cfg;
        },
        _createInput : function (cfg, minWidth) {
            var o = new aria.widgets.form.Input(cfg, aria.jsunit.helpers.OutObj.tplCtxt)
            o._minInputMarkupWidth = minWidth
            return o
        },
        /**
         * Test _checkCfgConsistency to make sure widths are well set
         */
        testAsyncCheckCfgConsistency : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.Input"],
                oncomplete : {
                    fn : this._testCheckCfgConsistency,
                    scope : this
                }
            });
        },

        _testCheckCfgConsistency : function () {

            // min input markup width: 20px
            var o = new aria.widgets.form.Input({
                width : 20
            }, aria.jsunit.helpers.OutObj.tplCtxt);

            o.$dispose();

            // first test: no change expected
            var pos = ["left", "right"]
            for (var idx in pos) {
                var cfg = this._getCfg(pos[idx])
                o = this._createInput(cfg, 20);

                o._checkCfgConsistency(cfg)
                this.assertTrue(cfg.width == -1)
                this.assertTrue(cfg.labelWidth == -1)
                this.assertTrue(o._inputMarkupWidth == -3)

                cfg.width = 15
                o._checkCfgConsistency(cfg) // too small width >> change width
                this.assertTrue(cfg.width == 20)
                this.assertTrue(cfg.labelWidth == -1)
                this.assertTrue(o._inputMarkupWidth == 18)

                cfg.width = 50
                cfg.labelWidth = 25
                o._checkCfgConsistency(cfg) // valid values
                this.assertTrue(cfg.width == 50)
                this.assertTrue(cfg.labelWidth == 25)
                this.assertTrue(o._inputMarkupWidth == 23)

                cfg.width = 50
                cfg.labelWidth = 35
                o._checkCfgConsistency(cfg) // too big label: 35+20>50 >> change width
                this.assertTrue(cfg.width == 55)
                this.assertTrue(cfg.labelWidth == 35)
                this.assertTrue(o._inputMarkupWidth == 18)

                o.$dispose();
            }

            cfg = this._getCfg("top")
            o = this._createInput(cfg, 20);

            cfg.width = 15 // too small width >> change width
            o._checkCfgConsistency(cfg)
            this.assertTrue(cfg.width == 20)
            this.assertTrue(cfg.labelWidth == -1)
            this.assertTrue(o._inputMarkupWidth == 20)

            cfg.width = 25
            cfg.labelWidth = 40 // too big label: 40>25 >> change width
            o._checkCfgConsistency(cfg)
            this.assertTrue(cfg.width == 40)
            this.assertTrue(cfg.labelWidth == 40)
            this.assertTrue(o._inputMarkupWidth == 40)

            cfg.width = 50
            cfg.labelWidth = 35 // too small label
            o._checkCfgConsistency(cfg)
            this.assertTrue(cfg.width == 50)
            this.assertTrue(cfg.labelWidth == 50)
            this.assertTrue(o._inputMarkupWidth == 50)

            o.$dispose();

            this.notifyTestEnd("testAsyncCheckCfgConsistency");
        },
        /**
         * Automatic Bindings: TestCase1 Value property is not bound: the value property is not bound no automatic
         * bindings should be created.
         */
        test_valueBindingDoesNotExist : function () {
            var o = new aria.widgets.form.Input({
                width : 20
            }, aria.jsunit.helpers.OutObj.tplCtxt);
            var bind = {};
            o._cfg.bind = {};
            o._setAutomaticBindings(o._cfg); // try to create automatic bindings without the value property being
            // bound
            this.assertJsonEquals(bind, o._cfg.bind);
            o.$dispose();
        },
        /**
         * Automatic Bindings: TestCase2 Value property is bound: the value property is bound the following automatic
         * bindings should be created: error errorMessages
         */
        test_valueBindingDoesExist : function () {
            var o = new aria.widgets.form.Input({
                width : 20
            }, aria.jsunit.helpers.OutObj.tplCtxt);
            var metaDataObject = {};
            o._cfg.bind = {
                "value" : {
                    "inside" : metaDataObject,
                    "to" : "arrivalDate"
                }
            };
            var bind = {
                "requireFocus" : {
                    "inside" : {},
                    "to" : "requireFocus"
                },
                "error" : {
                    "inside" : {},
                    "to" : "error"
                },
                "errorMessages" : {
                    "inside" : {},
                    "to" : "errorMessages"
                },
                "value" : {
                    "inside" : {
                        "meta::arrivalDate" : {}
                    },
                    "to" : "arrivalDate"
                },
                "formatErrorMessages" : {
                    "inside" : {},
                    "to" : "formatErrorMessages"
                }
            };
            o._setAutomaticBindings(o._cfg); // try to create automatic bindings with the value property being bound
            this.assertJsonEquals(bind, o._cfg.bind);
            o.$dispose();
        },

        /**
         * Automatic Bindings: TestCase3 inputMetaData property is defined: only create automatic bindings if this
         * property is defined (exceptions: error,errorMessages which have bindings created if the value property is
         * bound)
         */
        test_inputMetaDataExists : function () {
            var o = new aria.widgets.form.Input({
                width : 20
            }, aria.jsunit.helpers.OutObj.tplCtxt);
            var metaDataObject = {};
            var inputMetaData = {
                "inputMetaData" : "arrivalDate1"
            };
            this.__json.inject(inputMetaData, o._cfg, true);
            o._cfg.bind = {
                "value" : {
                    "inside" : metaDataObject,
                    "to" : "arrivalDate"
                }
            };
            var bind = {
                "formatError" : {
                    "inside" : {},
                    "to" : "formatError"
                },
                "formatErrorMessages" : {
                    "inside" : {},
                    "to" : "formatErrorMessages"
                },
                "requireFocus" : {
                    "inside" : {
                        "local:arrivalDate1" : {}
                    },
                    "to" : "requireFocus"
                },
                "error" : {
                    "inside" : {
                        "local:arrivalDate1" : {}
                    },
                    "to" : "error"
                },
                "errorMessages" : {
                    "inside" : {
                        "local:arrivalDate1" : {}
                    },
                    "to" : "errorMessages"
                },
                "value" : {
                    "inside" : {
                        "aria:meta::arrivalDate" : {
                            "arrivalDate1" : {}
                        }
                    },
                    "to" : "arrivalDate"
                }
            };
            o._setAutomaticBindings(o._cfg); // try to create automatic bindings with the inputMetaData property
            // being declared
            this.assertJsonEquals(bind, o._cfg.bind);
            o.$dispose();
        },
        /**
         * Automatic Bindings: TestCase4 Bindings already exist do not create automatic bindings.
         */
        testAsync_bindingsExist : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The last test hence becomes asynchronous (because it will be executed first in IE)
            Aria.load({
                classes : ["aria.widgets.form.Input"],
                oncomplete : {
                    fn : this._test_bindingsExist,
                    scope : this
                }
            });
        },

        _test_bindingsExist : function () {
            var o = new aria.widgets.form.Input({
                width : 20
            }, aria.jsunit.helpers.OutObj.tplCtxt);
            var inputMetaData = {
                "inputMetaData" : "arrivalDate1"
            };
            this.__json.inject(inputMetaData, o._cfg, true);
            o._cfg.bind = {
                "value" : {
                    "inside" : {},
                    "to" : "arrivalDate"
                },
                "error" : {
                    "inside" : {},
                    "to" : "error"
                },
                "errorMessages" : {
                    "inside" : {},
                    "to" : "errorMessages"
                },
                "formatError" : {
                    "inside" : {},
                    "to" : "formatError"
                },
                "formatErrorMessages" : {
                    "inside" : {},
                    "to" : "formatErrorMessages"
                },
                "requireFocus" : {
                    "inside" : {},
                    "to" : "requireFocus"
                }
            };
            var bind = {
                "value" : {
                    "inside" : {
                        "meta::arrivalDate" : {
                            "arrivalDate1" : {}
                        }
                    },
                    "to" : "arrivalDate"
                },
                "error" : {
                    "inside" : {},
                    "to" : "error"
                },
                "errorMessages" : {
                    "inside" : {},
                    "to" : "errorMessages"
                },
                "formatError" : {
                    "inside" : {},
                    "to" : "formatError"
                },
                "formatErrorMessages" : {
                    "inside" : {},
                    "to" : "formatErrorMessages"
                },
                "requireFocus" : {
                    "inside" : {},
                    "to" : "requireFocus"
                }
            };
            o._setAutomaticBindings(o._cfg); // try to create automatic bindings when there are already existing
            // bindings declared for the properties
            this.assertJsonEquals(bind, o._cfg.bind);
            o.$dispose();

            this.notifyTestEnd("testAsync_bindingsExist");
        }
    }
});

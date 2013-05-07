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

/**
 * Test a complete table navigation
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.keyboardNavigation.enter.EnterTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.core.Timer"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._timer = aria.core.Timer;
        this.data = {
            logs : []
        };
        this.setTestEnv({
            template : "test.aria.templates.keyboardNavigation.enter.TestTemplate",
            data : this.data
        });
    },
    $prototype : {

        runTemplateTest : function () {

            // clean what was before
            this._disposeTestTemplate();

            // add globalKeyMap
            aria.templates.NavigationManager.addGlobalKeyMap({
                key : "enter",
                event : "keyup",
                callback : {
                    fn : function () {
                        aria.utils.Json.add(this.data.logs, "global");
                    },
                    scope : this
                }
            });

            this._loadTestTemplate({
                fn : this._step0,
                scope : this
            });
        },

        _pressEnterOn : function (args) {
            this.templateCtxt.$focus(args.id);
            this._timer.addCallback({
                fn : this._pressEnterOnCb1,
                scope : this,
                args : args,
                delay : 200
            });

        },

        _pressEnterOnCb1 : function (args) {
            var getter = (args.getter) ? args.getter : "getElementById";
            var current = this[getter](args.id);
            this.synEvent.type(current, "[enter]", {
                fn : this._pressEnterOnCb2,
                scope : this,
                args : args
            });
        },
        _pressEnterOnCb2 : function (evt, args) {
            this.$callback(args.cb);
        },

        // starting point
        _step0 : function () {
            this._pressEnterOn({
                id : "myButton1",
                cb : {
                    fn : this._step1,
                    scope : this
                }
            });

        },

        _step1 : function () {
            this.assertTrue(this.data.logs[0] == "button");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs[2] == "global");
            this.assertTrue(this.data.logs.length == 3);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myLink1",
                getter : "getLink",
                cb : {
                    fn : this._step2,
                    scope : this
                }
            });
        },
        _step2 : function () {
            this.assertTrue(this.data.logs[0] == "link");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs[2] == "global");
            this.assertTrue(this.data.logs.length == 3);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor11",
                cb : {
                    fn : this._step3,
                    scope : this
                }
            });
        },

        _step3 : function () {
            this.assertTrue(this.data.logs[0] == "anchorOne");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs[2] == "global");
            this.assertTrue(this.data.logs.length == 3);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor12",
                cb : {
                    fn : this._step4,
                    scope : this
                }
            });
        },
        _step4 : function () {
            this.assertTrue(this.data.logs[0] == "anchorTwoOnEnter");
            this.assertTrue(this.data.logs[1] == "anchorTwo");
            this.assertTrue(this.data.logs[2] == "section");
            this.assertTrue(this.data.logs[3] == "global");
            this.assertTrue(this.data.logs.length == 4);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myButton2",
                cb : {
                    fn : this._step5,
                    scope : this
                }
            });

        },

        _step5 : function () {
            this.assertTrue(this.data.logs[0] == "button");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myLink2",
                getter : "getLink",
                cb : {
                    fn : this._step6,
                    scope : this
                }
            });
        },
        _step6 : function () {
            this.assertTrue(this.data.logs[0] == "link");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor21",
                cb : {
                    fn : this._step7,
                    scope : this
                }
            });
        },

        _step7 : function () {
            this.assertTrue(this.data.logs[0] == "anchorOne");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor22",
                cb : {
                    fn : this._step8,
                    scope : this
                }
            });
        },
        _step8 : function () {
            this.assertTrue(this.data.logs[0] == "anchorTwoOnEnter");
            this.assertTrue(this.data.logs[1] == "anchorTwo");
            this.assertTrue(this.data.logs[2] == "section");
            this.assertTrue(this.data.logs.length == 3);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myButton3",
                cb : {
                    fn : this._step9,
                    scope : this
                }
            });

        },

        _step9 : function () {
            this.assertTrue(this.data.logs[0] == "button");
            this.assertTrue(this.data.logs.length == 1);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myLink3",
                getter : "getLink",
                cb : {
                    fn : this._step10,
                    scope : this
                }
            });
        },
        _step10 : function () {
            this.assertTrue(this.data.logs[0] == "link");
            this.assertTrue(this.data.logs.length == 1);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor31",
                cb : {
                    fn : this._step11,
                    scope : this
                }
            });
        },

        _step11 : function () {
            this.assertTrue(this.data.logs[0] == "anchorOne");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor32",
                cb : {
                    fn : this._step12,
                    scope : this
                }
            });
        },
        _step12 : function () {
            this.assertTrue(this.data.logs[0] == "anchorTwo");
            this.assertTrue(this.data.logs[1] == "anchorTwoOnEnter");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myButton4",
                cb : {
                    fn : this._step13,
                    scope : this
                }
            });

        },

        _step13 : function () {
            this.assertTrue(this.data.logs[0] == "button");
            this.assertTrue(this.data.logs[1] == "global");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "myLink4",
                getter : "getLink",
                cb : {
                    fn : this._step14,
                    scope : this
                }
            });
        },
        _step14 : function () {
            this.assertTrue(this.data.logs[0] == "link");
            this.assertTrue(this.data.logs[1] == "global");
            this.assertTrue(this.data.logs.length == 2);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor41",
                cb : {
                    fn : this._step15,
                    scope : this
                }
            });
        },

        _step15 : function () {
            this.assertTrue(this.data.logs[0] == "section");
            this.assertTrue(this.data.logs[1] == "anchorOne");
            this.assertTrue(this.data.logs[2] == "global");
            this.assertTrue(this.data.logs.length == 3);
            aria.utils.Json.setValue(this.data, "logs", []);

            this._pressEnterOn({
                id : "anchor42",
                cb : {
                    fn : this._step16,
                    scope : this
                }
            });
        },
        _step16 : function () {
            this.assertTrue(this.data.logs[0] == "anchorTwoOnEnter");
            this.assertTrue(this.data.logs[1] == "section");
            this.assertTrue(this.data.logs[2] == "anchorTwo");
            this.assertTrue(this.data.logs[3] == "global");
            this.assertTrue(this.data.logs.length == 4);
            aria.utils.Json.setValue(this.data, "logs", []);

            this.notifyTemplateTestEnd();
        }

    }
});

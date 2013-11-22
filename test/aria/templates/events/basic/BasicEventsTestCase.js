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

Aria.classDefinition({
    $classpath : 'test.aria.templates.events.basic.BasicEventsTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.templates.CSSMgr', 'aria.utils.Event', 'aria.utils.Callback', 'aria.utils.Dom'],
    $constructor : function () {
        // this.defaultTestTimeout = 10000;
        this.$TemplateTestCase.constructor.call(this);
        this.map = {
            handlerCalled : 0,
            callbackCalled : 0,
            normalCallback : 0,
            functionAlone : 0
        };
        this.jsonHandler = {
            fn : function () {
                this.map.elementArrClicked = true;
            },
            scope : this
        };

        this.callbackInstance = new aria.utils.Callback(this.jsonHandler);
    },
    $prototype : {
        runTemplateTest : function () {
            var mydiv1 = aria.utils.Dom.getElementById('mydiv1');
            var mydiv2 = aria.utils.Dom.getElementById('mydiv2');
            var mydiv3 = aria.utils.Dom.getElementById('mydiv3');
            var mydiv4 = aria.utils.Dom.getElementById('mydiv4');
            var mydiv5 = aria.utils.Dom.getElementById('mydiv5');
            var mydiv6 = aria.utils.Dom.getElementById('mydiv6');
            var mydiv7 = aria.utils.Dom.getElementById('mydiv7');
            var map = this.map;
            var handler = {
                fn : function () {
                    map.handlerCalled++;
                },
                scope : this,
                args : []
            };
            this.anotherCallback = new aria.utils.Callback({
                fn : function () {
                    map.callbackCalled++;
                },
                scope : this,
                args : []
            });
            // JSON object {fn:,scope:,args}
            aria.utils.Event.addListener(mydiv1, 'click', handler);
            // aria.utils.Callback
            aria.utils.Event.addListener(mydiv2, 'click', this.anotherCallback);
            // JSON object {fn:}
            var myHandler = {
                fn : function () {
                    map.functionAlone++;
                }
            };
            aria.utils.Event.addListener(mydiv4, 'click', myHandler);
            // JSON object {fn:,scope}
            aria.utils.Event.addListener(mydiv5, 'click', {
                fn : function (a, b) {
                    map.jsonFnAndScope = true;
                    map.scope = this;
                },
                scope : {
                    scopeIndex : true
                }
            });
            // JSON object {fn:,args:[]}
            aria.utils.Event.addListener(mydiv6, 'click', {
                fn : function (a, b) {
                    map.jsonFnAndArgs = true;
                    map.args = b[0];
                },
                args : [true]
            });
            // JSON object {fn:,args:string}
            aria.utils.Event.addListener(mydiv7, 'click', {
                fn : function (a, b) {
                    map.jsonFnAndArgs = true;
                    map.args = b;
                },
                args : 'true'
            });

            this.synEvent.click(mydiv1, {
                fn : this.__afterHandler,
                scope : this
            });
        },
        __afterHandler : function () {
            this.assertTrue(this.map.handlerCalled == 1);
            var mydiv2 = aria.utils.Dom.getElementById('mydiv2');
            this.synEvent.click(mydiv2, {
                fn : this.__afterCallback,
                scope : this
            });
        },
        __afterCallback : function () {
            this.assertTrue(this.map.callbackCalled == 1);

            var mydiv3 = aria.utils.Dom.getElementById('mydiv3');
            this.synEvent.click(mydiv3, {
                fn : this.__afterFunction,
                scope : this
            });
        },
        __afterFunction : function () {
            this.assertTrue(this.map.normalCallback === 0);
            var mydiv4 = aria.utils.Dom.getElementById('mydiv4');
            this.synEvent.click(mydiv4, {
                fn : this.__afterFunctionAlone,
                scope : this
            });

        },
        __afterFunctionAlone : function () {
            this.assertTrue(this.map.functionAlone == 1);
            var mydiv5 = aria.utils.Dom.getElementById('mydiv5');
            this.synEvent.click(mydiv5, {
                fn : this.__afterJsonFnAndScope,
                scope : this
            });
        },
        __afterJsonFnAndScope : function () {
            this.assertTrue(this.map.jsonFnAndScope);
            this.assertTrue(this.map.scope.scopeIndex);
            var mydiv6 = aria.utils.Dom.getElementById('mydiv6');
            this.synEvent.click(mydiv6, {
                fn : this.__afterJsonFnAndArgs,
                scope : this
            });
        },
        __afterJsonFnAndArgs : function () {
            this.assertTrue(this.map.jsonFnAndArgs);
            this.assertTrue(this.map.args);
            var mydiv7 = aria.utils.Dom.getElementById('mydiv7');
            this.synEvent.click(mydiv7, {
                fn : this.__afterJsonFnAndArgStr,
                scope : this
            });
        },
        __afterJsonFnAndArgStr : function () {
            this.assertTrue(this.map.jsonFnAndArgs);
            this.assertTrue(this.map.args == 'true');
            var mydiv1 = aria.utils.Dom.getElementById('mydiv1');
            aria.utils.Event.removeListener(mydiv1, 'click');
            this.map.handlerCalled = 0;
            this.synEvent.click(mydiv1, {
                fn : this.__afterRemoveListner,
                scope : this
            });

        },
        __afterRemoveListner : function () {
            this.assertTrue(this.map.handlerCalled === 0);
            this.__addThreeEvents();

        },
        __addThreeEvents : function () {
            var mydiv8 = aria.utils.Dom.getElementById('mydiv8');
            var handler1 = {
                fn : function () {
                    this.map.eventOne = true;
                },
                scope : this,
                args : []
            };
            var handler2 = {
                fn : function () {
                    this.map.eventTwo = true;
                },
                scope : this,
                args : []
            };
            var handler3 = {
                fn : function () {
                    this.map.eventThree = true;
                },
                scope : this,
                args : []
            };
            this.callback = new aria.utils.Callback(handler1);
            aria.utils.Event.addListener(mydiv8, 'click', this.callback);
            aria.utils.Event.addListener(mydiv8, 'click', handler2);
            aria.utils.Event.addListener(mydiv8, 'click', handler3);
            this.synEvent.click(mydiv8, {
                fn : this.__afterAddThreeEvents,
                scope : this
            });

        },
        __afterAddThreeEvents : function () {
            this.assertTrue(this.map.eventOne);
            this.assertTrue(this.map.eventTwo);
            this.assertTrue(this.map.eventThree);
            var mydiv8 = aria.utils.Dom.getElementById('mydiv8');
            aria.utils.Event.removeListener(mydiv8, 'click', this.callback);
            this.map.eventOne = false;
            this.map.eventTwo = false;
            this.map.eventThree = false;
            this.synEvent.click(mydiv8, {
                fn : this.__afterRemoveOneEvents,
                scope : this
            });

        },
        __afterRemoveOneEvents : function () {
            this.assertFalse(this.map.eventOne);
            this.assertTrue(this.map.eventTwo);
            this.assertTrue(this.map.eventThree);
            var mydiv8 = aria.utils.Dom.getElementById('mydiv8');
            aria.utils.Event.removeListener(mydiv8, 'click');
            this.map.eventTwo = false;
            this.map.eventThree = false;
            this.synEvent.click(mydiv8, {
                fn : this.__afterRemoveAllEvents,
                scope : this
            });

        },
        __afterRemoveAllEvents : function () {
            this.assertFalse(this.map.eventOne);
            this.assertFalse(this.map.eventTwo);
            this.assertFalse(this.map.eventThree);
            var eleArr = ['mydiv9', 'mydiv10'];

            this.map.elementArrClicked = false;

            aria.utils.Event.addListener(eleArr, 'click', this.jsonHandler);

            var mydiv9 = aria.utils.Dom.getElementById('mydiv9');
            this.synEvent.click(mydiv9, {
                fn : this.__afterClickEleArr,
                scope : this
            });

        },
        __afterClickEleArr : function () {
            this.assertTrue(this.map.elementArrClicked);
            this.map.elementArrClicked = false;
            var mydiv10 = aria.utils.Dom.getElementById('mydiv10');
            this.synEvent.click(mydiv10, {
                fn : this.__afterClickEleArrOne,
                scope : this
            });

        },
        __afterClickEleArrOne : function () {
            this.assertTrue(this.map.elementArrClicked);
            var eleArr = ['mydiv9', 'mydiv10'];
            this.map.elementArrClicked = false;
            aria.utils.Event.removeListener(eleArr, 'click', {
                fn : function () {
                    this.map.elementArrClicked = true;
                },
                scope : this
            });
            var mydiv10 = aria.utils.Dom.getElementById('mydiv10');
            this.synEvent.click(mydiv10, {
                fn : this.__afterRemoveObjectCallback,
                scope : this
            });

        },
        __afterRemoveObjectCallback : function () {
            this.assertTrue(this.map.elementArrClicked);// Object doesnot match so nothing should be removed
            var eleArr = ['mydiv9', 'mydiv10'];
            aria.utils.Event.removeListener(eleArr, 'click', this.jsonHandler);
            var mydiv10 = aria.utils.Dom.getElementById('mydiv10');
            this.map.elementArrClicked = false;
            this.synEvent.click(mydiv10, {
                fn : this.__afterRemoveCallback,
                scope : this
            });

        },
        __afterRemoveCallback : function () {
            this.assertFalse(this.map.elementArrClicked);
            var eleArr = ['mydiv9', 'mydiv10'];
            aria.utils.Event.addListener(eleArr, 'click', this.callbackInstance);
            var mydiv10 = aria.utils.Dom.getElementById('mydiv10');
            this.synEvent.click(mydiv10, {
                fn : this.__afterAddAriaCallback,
                scope : this
            });

        },
        __afterAddAriaCallback : function () {
            this.assertTrue(this.map.elementArrClicked);
            var eleArr = ['mydiv9', 'mydiv10'];
            this.newCallbackInstance = new aria.utils.Callback(this.jsonHandler);
            aria.utils.Event.removeListener(eleArr, 'click', this.newCallbackInstance);
            var mydiv10 = aria.utils.Dom.getElementById('mydiv10');
            this.map.elementArrClicked = false;
            this.synEvent.click(mydiv10, {
                fn : this.__afterRemoveAriaCallbackDummyObj,
                scope : this
            });

        },
        __afterRemoveAriaCallbackDummyObj : function () {
            this.assertTrue(this.map.elementArrClicked);// passed dummy callback object so should not remove the
            // callback
            this.newCallbackInstance.$dispose();
            var eleArr = ['mydiv9', 'mydiv10'];
            aria.utils.Event.removeListener(eleArr, 'click', this.callbackInstance);
            var mydiv10 = aria.utils.Dom.getElementById('mydiv10');
            this.map.elementArrClicked = false;
            this.synEvent.click(mydiv10, {
                fn : this.__afterRemoveAriaCallbackInstance,
                scope : this
            });

        },
        __afterRemoveAriaCallbackInstance : function () {
            this.assertFalse(this.map.elementArrClicked);
            this.callbackInstance.$dispose();
            this.callback.$dispose();
            this.anotherCallback.$dispose();
            this.notifyTemplateTestEnd();
        }
    }
});

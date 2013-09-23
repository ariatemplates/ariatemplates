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
    $classpath : "test.aria.touch.widgets.ButtonTouch",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.touch.widgets.Button", "aria.DomEvent", "aria.utils.Delegate", "aria.utils.ClassList"],
    $prototype : {

        testForSimpleButton : function () {
            var cfg1 = {
                id : "button1",
                isLink : false
            };

            var widget1 = this.createContainerAndInit("aria.touch.widgets.Button", cfg1);
            this.assertEquals(widget1._domElt.className, "appButton", "Wrong Markup for the Button Widget..");
            widget1.$dispose();
            this.outObj.clearAll();
        },

        testForSimpleLink : function () {
            var cfg2 = {
                id : "button2",
                isLink : true
            };

            var widget2 = this.createContainerAndInit("aria.touch.widgets.Button", cfg2);
            this.assertEquals(widget2._domElt.className, "appLink", "Wrong Markup for the Link Widget..");
            widget2.$dispose();
            this.outObj.clearAll();
        },
        testForDisabledButton : function () {
            var cfg3 = {
                id : "button3",
                isLink : false,
                attributes : {
                    disabled : "disabled"
                }
            };

            var widget3 = this.createContainerAndInit("aria.touch.widgets.Button", cfg3);
            if (!aria.core.Browser.isIE7) {
                this.assertEquals(widget3._domElt.attributes["disabled"].value, "disabled", "Wrong state for the Button Widget..");
            } else {
                this.assertEquals(widget3._domElt.disabled, true, "Wrong state for the Button Widget..");
            }
            widget3.$dispose();
            this.outObj.clearAll();
        },

        testForDisabledLink : function () {
            var cfg4 = {
                id : "button4",
                isLink : true,
                attributes : {
                    disabled : "disabled"
                }
            };

            var widget4 = this.createContainerAndInit("aria.touch.widgets.Button", cfg4);
            if (!aria.core.Browser.isIE7) {
                this.assertEquals(widget4._domElt.attributes["disabled"].value, "disabled", "Wrong state for the Link Widget..");
            } else {
                this.assertEquals(widget4._domElt.disabled, true, "Wrong state for the Link Widget..");
            }
            widget4.$dispose();
            this.outObj.clearAll();
        },

        testAsyncTapOnButton : function () {
            this.startTesting({
                id : "button"
            }, "testAsyncTapOnButton");
        },

        testAsyncTapOnLink : function () {
            this.startTesting({
                id : "link",
                isLink : true
            }, "testAsyncTapOnButton");
        },

        startTesting : function (config, testName) {
            var widget = this.createContainerAndInit("aria.touch.widgets.Button", config);
            var dom = widget.getDom();
            var classList = new aria.utils.ClassList(dom);

            var fakeEvent = aria.DomEvent.getFakeEvent("tapstart", dom);
            aria.utils.Delegate.delegate(fakeEvent);

            // There shouldn't be a class yet
            this.assertFalse(classList.contains("touchLibButtonPressed"));
            aria.core.Timer.addCallback({
                fn : this.afterSomeTime,
                scope : this,
                delay : 100,
                args : {
                    widget : widget,
                    dom : dom,
                    classList : classList,
                    testName : testName
                }
            });
        },

        afterSomeTime : function (args) {
            var dom = args.dom;
            var classList = args.classList;

            // Now there should be a class
            this.assertTrue(classList.contains("touchLibButtonPressed"));

            // cancel this tap
            var fakeEvent = aria.DomEvent.getFakeEvent("tapcancel", dom);
            aria.utils.Delegate.delegate(fakeEvent);

            this.assertFalse(classList.contains("touchLibButtonPressed"));

            fakeEvent = aria.DomEvent.getFakeEvent("tapstart", dom);
            aria.utils.Delegate.delegate(fakeEvent);

            // tap again
            aria.core.Timer.addCallback({
                fn : this.afterSomeOtherTime,
                scope : this,
                delay : 100,
                args : args
            });
        },

        afterSomeOtherTime : function (args) {
            var widget = args.widget;
            var dom = args.dom;
            var classList = args.classList;

            this.assertTrue(classList.contains("touchLibButtonPressed"));

            // complete the tap
            var fakeEvent = aria.DomEvent.getFakeEvent("tap", dom);
            aria.utils.Delegate.delegate(fakeEvent);

            var expected = widget._isLink ? true : false;
            this.assertEquals(expected, classList.contains("touchLibButtonPressed"));

            widget.$dispose();
            this.clearAll();
            classList.$dispose();
            this.notifyTestEnd(args.testName);
        }
    }
});

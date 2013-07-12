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
    $dependencies : ["aria.touch.widgets.Button"],
    $prototype : {

        testForSimpleButton : function () {
            var cfg1 = {
                id : "button1",
                isLink : false

            };

            var widget1 = this.createAndInit("aria.touch.widgets.Button", cfg1);
            this.assertEquals(widget1._domElt.className, "appButton", "Wrong Markup for the Button Widget..");
            widget1.$dispose();
            this.outObj.clearAll();
        },
        testForSimpleLink : function () {
            var cfg2 = {
                id : "button2",
                isLink : true,
                attributes : {
                    disabled : "disabled"
                }

            };

            var widget2 = this.createAndInit("aria.touch.widgets.Button", cfg2);
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

            var widget3 = this.createAndInit("aria.touch.widgets.Button", cfg3);
            this.assertEquals(widget3._domElt.attributes["disabled"].value, "disabled", "Wrong state for the Button Widget..");
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

            var widget4 = this.createAndInit("aria.touch.widgets.Button", cfg4);
            this.assertEquals(widget4._domElt.attributes["disabled"].value, "disabled", "Wrong state for the Link Widget..");
            widget4.$dispose();
            this.outObj.clearAll();
        }
    }
});

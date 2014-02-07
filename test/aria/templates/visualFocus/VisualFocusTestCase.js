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
 * Testcase for focus handling
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.visualFocus.VisualFocusTestCase",
    $dependencies : ["aria.core.Browser", "aria.utils.Dom"],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._visualFocusTestCaseEnv = {
            template : "test.aria.templates.visualFocus.VisualFocusTemplate"
        };
        this.setTestEnv(this._visualFocusTestCaseEnv);

    },
    $prototype : {
        runTemplateTest : function () {

            // set the outline configuration property of the application
            aria.core.AppEnvironment.setEnvironment({
                appOutlineStyle : "2px dashed red"
            }, null, true);
            if (aria.utils.VisualFocus) {
                this.executeActions();
            } else {
                aria.core.ClassMgr.$on({
                    "classComplete" : function (evt) {
                        if (evt.refClasspath && evt.refClasspath == "aria.utils.VisualFocus") {
                            this.executeActions();
                        }
                    },
                    scope : this
                });
            }
        },

        executeActions : function () {
            this.visualFocusTestvar = {};
            var curOutline;
            var myDom = this.myDom = aria.utils.Dom;
            var link = this.link = this.getElementById("myLink");
            var secondLink = this.secondLink = this.getElementById("mySecondLink");
            // on button the outline is added directly on the button element
            var button = this.button = this.getWidgetInstance("myButton").getDom().childNodes[0];
            // on fields it's added on the span containing the input
            var field = this.field = this.getWidgetInstance("myField").getDom().getElementsByTagName("input")[0].parentNode;
            var template = this.template = this.templateCtxt._tpl;

            curOutline = [link.style.outlineColor, link.style.outlineStyle, link.style.outlineWidth];
            this.visualFocusTestvar.var1 = curOutline.join(" ");
            template.$focus("myLink");

            var that = this;
            setTimeout(function() {
                that.afterMyLinkFocus();
            }, 25);

        },

        afterMyLinkFocus : function () {
            var link = this.link;

            var curOutline = [link.style.outlineColor, link.style.outlineStyle, link.style.outlineWidth];
            this.visualFocusTestvar.var2 = curOutline.join(" ");
            this.template.$focus("myButton");

            var that = this;
            setTimeout(function() {
                that.afterMyButtonFocus();
            }, 25);
        },

        afterMyButtonFocus : function () {
            var link = this.link;
            var button = this.button;

            var curOutline = [link.style.outlineColor, link.style.outlineStyle, link.style.outlineWidth];
            this.visualFocusTestvar.var3 = curOutline.join(" ");

            curOutline = [button.style.outlineColor, button.style.outlineStyle, button.style.outlineWidth];
            this.visualFocusTestvar.var4 = curOutline.join(" ");
            this.template.$focus("myField");

            var that = this;
            setTimeout(function() {
                that.afterMyFieldFocus();
            }, 25);
        },

        afterMyFieldFocus : function () {
            var button = this.button;
            var field = this.field;

            var curOutline = [button.style.outlineColor, button.style.outlineStyle, button.style.outlineWidth];
            this.visualFocusTestvar.var5 = curOutline.join(" ");

            curOutline = [field.style.outlineColor, field.style.outlineStyle, field.style.outlineWidth];
            this.visualFocusTestvar.var6 = curOutline.join(" ");

            curOutline = [this.myDom.getStyle(this.secondLink, "outlineStyle")];
            this.visualFocusTestvar.var7 = curOutline.join(" ");
            this.template.$focus("mySecondLink");

            var that = this;
            setTimeout(function() {
                that.afterMySecondLinkFocus();
            }, 25);
        },

        afterMySecondLinkFocus : function () {
            var field = this.field;
            var secondLink = this.secondLink;
            var myDom = this.myDom;

            var curOutline = [field.style.outlineStyle, field.style.outlineWidth];
            this.visualFocusTestvar.var8 = curOutline.join(" ");

            curOutline = [myDom.getStyle(secondLink, "outlineStyle"), myDom.getStyle(secondLink, "outlineWidth")];
            this.visualFocusTestvar.var9 = curOutline.join(" ");
            this.template.$focus("myField");

            var that = this;
            setTimeout(function() {
                that.afterMyFieldFocus2();
            }, 25);
        },

        afterMyFieldFocus2 : function () {
            var curOutline = [this.myDom.getStyle(this.secondLink, "outlineStyle")];
            this.visualFocusTestvar.var10 = curOutline.join(" ");

            aria.core.AppEnvironment.setEnvironment({
                appOutlineStyle : null
            }, null, true);

            this.myVisualFocusTest();
        },

        myVisualFocusTest : (aria.core.Browser.isIE7)
                ? function () {
                    this.finishTest();
                }
                : function () {
                    var testVar;
                    var outlines = {
                        1 : "green solid 3px",
                        2 : "red dashed 2px",
                        3 : "green solid 3px",
                        4 : "red dashed 2px",
                        5 : "  ",
                        6 : "red dashed 2px",
                        7 : "double",
                        8 : " ",
                        9 : "dashed 2px",
                        10 : "double"
                    };
                    for (var i = 1; i <= 10; i++) {
                        testVar = this.visualFocusTestvar["var" + i];
                        var expected = outlines[i].toLowerCase();
                        var got = testVar.toLowerCase();
                        this.assertEquals(got, expected, "got '" + got + "' expected '" + expected + "' on var" + i);
                    }

                    this.finishTest();
                },

        /**
         * Finalize the test, in this case, nothing special to do
         */
        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

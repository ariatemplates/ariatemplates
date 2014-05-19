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
    $classpath : "test.aria.widgets.verticalAlign.VerticalAlignTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.jsunit.LayoutTester", "aria.utils.Json", "aria.core.Browser"],
    $templates : ["aria.widgets.form.list.templates.ListTemplate"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                group1 : "a"
            }

        });
    },
    $prototype : {

        setUp : function () {
            aria.core.AppEnvironment.setEnvironment({
                widgetSettings : {
                    middleAlignment : true
                }
            }, null, true);
        },

        runTemplateTest : function () {
            this.compare();
        },

        compare : function () {
            var document = Aria.$window.document;
            // Select the divs to compare
            var found = document.getElementsByTagName("div");
            var divs = [];
            for (var i = 0, ii = found.length; i < ii; i++) {
                if (found[i].className == "line") {
                    divs.push(found[i]);
                }
            }

            for (var i = 0, ii = divs.length; i < ii; i++) {
                var div = divs[i];
                // var left = div.offsetLeft;
                var top = div.offsetTop;
                // var width = div.offsetWidth;
                var height = div.offsetHeight;
                var middlePosition = height / 2;

                var widgets = this.getElementsByClassName(div, "xWidget");

                // Check that every widget are centered
                for (var j = 0, jj = widgets.length; j < jj; j++) {
                    var widget = widgets[j];
                    // Check only the direct children of a line
                    if (widget.parentNode === div) {
                        if (widget.style.verticalAlign == "bottom") {
                            var offsetBottom = Math.abs(height - (widget.offsetTop + widget.offsetHeight));
                            this.assertTrue(offsetBottom < 4, "Widget " + j + " in line " + i
                                    + " is not bottom aligned");
                            var labelContent = widget.textContent || widget.innerText;
                            if (labelContent === "email address") {
                                var labelBottom = Math.abs(widget.offsetHeight
                                        - (widget.firstChild.offsetTop + widget.firstChild.offsetHeight));
                                this.assertTrue(labelBottom === 0, "Widget label " + j + " in line " + i
                                        + " is not bottom aligned");
                            }
                        } else {
                            var offsetMiddle = Math.abs(middlePosition - (widget.offsetTop + widget.offsetHeight / 2));
                            this.assertTrue(offsetMiddle < 2, "Widget " + j + " in line " + i
                                    + " is not vertical aligned");
                        }
                    }
                }
            }
            this.notifyTemplateTestEnd();
        }
    }
});

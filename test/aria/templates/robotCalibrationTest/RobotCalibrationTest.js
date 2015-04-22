/*
 * Copyright 2015 Amadeus s.a.s.
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

var Aria = require("ariatemplates/Aria");
var eventUtils = require("ariatemplates/utils/Event");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.templates.robotCalibrationTest.RobotCalibrationTest",
    $extends : require("ariatemplates/jsunit/RobotTestCase"),
    $prototype : {
        runTemplateTest : function () {
            var markPosition = {
                x : 70,
                y : 144
            };
            var document = Aria.$window.document;
            var markPixel = document.createElement("div");
            var markPixelStyle = markPixel.style;
            markPixelStyle.position = "absolute";
            markPixelStyle.backgroundColor = "black";
            markPixelStyle.width = "1px";
            markPixelStyle.height = "1px";
            markPixelStyle.left = markPosition.x + "px";
            markPixelStyle.top = markPosition.y + "px";
            markPixelStyle.zIndex = "10000";
            document.body.appendChild(markPixel);

            var clicks = [];
            var clickHandler = {
                fn : function (event) {
                    clicks.push({
                        x : event.clientX,
                        y : event.clientY
                    });
                }
            };

            eventUtils.addListener(document.body, "click", clickHandler);
            eventUtils.addListener(markPixel, "click", clickHandler);

            this.synEvent.click(markPosition, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return clicks.length > 0;
                        },
                        callback : function () {
                            eventUtils.removeListener(document.body, "click", clickHandler);
                            eventUtils.removeListener(markPixel, "click", clickHandler);
                            markPixel.parentNode.removeChild(markPixel);
                            // DO NOT ADD ANY TOLERANCE! THIS TEST MUST BE PIXEL PERFECT!
                            this.assertJsonEquals(clicks, [markPosition, markPosition]);
                            this.end();
                        }
                    });
                },
                scope : this
            });
        }
    }
});

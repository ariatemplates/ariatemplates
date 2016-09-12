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
    $classpath : "test.aria.widgets.skin.button.verticalAlign.VerticalAlignBottomTestCase",
    $extends : "test.aria.widgets.skin.button.verticalAlign.VerticalAlignParentBase",
    $dependencies : ["aria.core.Browser"],

    $prototype : {
        setUp : function () {
            var frame =  this.getFrame();
            frame.sprHeight = 50;
            frame.verticalAlign = "bottom";
        },

        runTemplateTest : function () {
            var browser = aria.core.Browser;
            if (browser.isIE) {
                if (browser.majorVersion <= 7) {
                    // Vertical-align not supported on IE7
                    this.end();
                    return;
                }
            }

            this.checkPosition("bottom");

            this.end();
        }
    }
});

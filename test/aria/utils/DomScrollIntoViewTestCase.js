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

Aria.classDefinition({
    $classpath : "test.aria.utils.DomScrollIntoViewTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype: {
        testScrollIntoViewChromeBug : function () {
            var document = Aria.$window.document;
            var bodyStyle = document.body.style.cssText;
            var containerElement;
            try {
                // Makes sure the document is initially not scrolled:
                Aria.$window.scroll(0, 0);
                // sets the margin on the body as 0 which makes document.body.scrollHeight == document.body.clientHeight
                document.body.style.cssText = "margin:0;";
                var containerElement = document.createElement("div");
                document.body.appendChild(containerElement);
                containerElement.style.cssText = "position:relative;height:3000px;";
                var childElement = document.createElement("div");
                containerElement.appendChild(childElement);
                childElement.style.cssText = "position:absolute;width:10px;height:10px;left:10px;top:1500px;background-color:blue;z-index:1000;";
                var elementInitialGeometry = aria.utils.Dom.getGeometry(childElement);
                this.assertTrue(elementInitialGeometry.y >= 1500, "The pre-condition is not satisfied");
                aria.utils.Dom.scrollIntoView(childElement, true);
                var elementFinalGeometry = aria.utils.Dom.getGeometry(childElement);
                this.assertEqualsWithTolerance(elementFinalGeometry.y, 0, 2, "scrollIntoView did not work."); // 2 px of tolerance for IE7
            } finally {
                if (containerElement) {
                    document.body.removeChild(containerElement);
                }
                document.body.style.cssText = bodyStyle;
            }
        }
    }
});

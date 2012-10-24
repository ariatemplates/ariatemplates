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
 * Test case for aria.utils.Text
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Ellipsis",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Ellipsis"],
    $prototype : {

        /**
         * TestCase1 Tests with the width explicitly given to the ellipses
         */

        testellipseTextExplicitWidth : function () {
            var document = Aria.$window.document;
            var testElement = document.createElement("span");

            testElement.innerHTML = "This is my text. There is a lot of text in the world, but this text is mine.";

            var testParent = document.createElement("span");
            testParent.appendChild(testElement);
            document.body.appendChild(testParent);

            var width = 100;
            var position = "right";
            var ellipsisStr = "...";
            var testText = "test text that needs to be made shorter";

            // var ellipsedText = aria.utils.Ellipsis.applyTo(testElement, width, position, ellipsisStr);
            var ellipsisInstance = new aria.utils.Ellipsis(testElement, width, position, ellipsisStr, '', '', testText);

            // ellipsedText.parentNode.removeChild(ellipsedText);

            if (aria.core.Browser.isIE6)
                this.assertTrue(parseInt(testElement.offsetWidth) == 96);
            else
                this.assertTrue(parseInt(testElement.offsetWidth) == 100);
            ellipsisInstance.$dispose();

            testElement.parentNode.removeChild(testElement);
            testElement = null;

        },
        /**
         * TestCase2 Tests with no width given. The width has be deduced from the parent
         */

        testellipseTextParentWidth : function () {
            var document = Aria.$window.document;
            var parentWidth = 150;

            var testElement = document.createElement("span");

            testElement.innerHTML = "This is my text. There is a lot of text in the world, but this text is mine.";

            var testParent = document.createElement("span");

            testParent.style.width = parentWidth + "px";
            testParent.style.display = "inline-block";
            testParent.style.overflow = "hidden";
            testParent.style.whiteSpace = "nowrap";
            testParent.className = 'testparent';
            testParent.appendChild(testElement);
            document.body.appendChild(testParent);

            var width = 0;
            var position = 'right';
            var ellipsisStr = '...';
            var testText = 'test text that needs to be made shorter';

            var ellipsisInstance = new aria.utils.Ellipsis(testElement, width, position, ellipsisStr, '', '', testText);

            this.assertTrue(parseInt(testElement.offsetWidth) <= parseInt(parentWidth));
            ellipsisInstance.$dispose();

            testElement.parentNode.removeChild(testElement);
            testElement = null;
            document.body.removeChild(testParent);
            testParent = null;
        },
        testWrongElementTypePassed : function () {
            var document = Aria.$window.document;
            var testElement = document.createElement("span");
            var position = 'right';
            var ellipsisStr = '...';
            var testText = 'test text that needs to be made shorter';

            var ellipsisInstance = new aria.utils.Ellipsis(testElement, 0, position, ellipsisStr, '', '', testText);

            ellipsisInstance.$dispose();

            testElement = null;

        }
    }
});

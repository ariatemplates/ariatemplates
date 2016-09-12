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
    $classpath : "test.aria.widgets.form.text.TextTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Ellipsis"],
    $prototype : {

        setUp : function () {
            var document = Aria.$window.document;
            this._element = document.createElement("span");
            document.body.appendChild(this._element);
        },

        testEllipsis : function () {
            this.checkSize("This is the text to be displayed. At time there is a lot of text and it is necessary to make the test shorter. We do this by using ellipses.");
            this.checkSize("WWWWWWWWWWWWMMMMMMMMMMMMMMiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            this.checkSize("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
            this.checkSize("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            this.checkSize("&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;&nbsp;&gt;&lt;");

        },

        checkTruncatedTextSize : function (fullText, position) {

            var ellipsisText = "...";
            var ellipsisWidth = this.getTextSize(ellipsisText);
            var expectedTotalWidth = 120;

            // An acceptable error margin
            var errorMarginWidth = 20;

            this._element.innerHTML = fullText;

            var ellipsis = new aria.utils.Ellipsis(this._element, expectedTotalWidth, position, ellipsisText, null, "fullCharacter");

            var totalEllipsisWidth = this._element.offsetWidth;

            if (position ==="right"){
                var text = this._element.firstChild.textContent || this._element.firstChild.innerText;
            }
            else{
                var text = this._element.childNodes[1].textContent || this._element.childNodes[1].innerText;
            }

            var textSize = this.getTextSize(text) + ellipsisWidth;

            var correctSize = (expectedTotalWidth - errorMarginWidth <= textSize)
                    && (textSize <= expectedTotalWidth);

            this.assertTrue(correctSize);

            // make sure that the width is close to the real ellipsis' width we have set
            correctSize = (expectedTotalWidth - errorMarginWidth <= totalEllipsisWidth)
                    && (totalEllipsisWidth <= expectedTotalWidth);

            this.assertTrue(correctSize);

            ellipsis.$dispose();

        },

        checkSize : function (fullText, position) {
            this.checkTruncatedTextSize(fullText, "left");
            this.checkTruncatedTextSize(fullText, "right");
        },

        getTextSize : function (text) {

            var document = Aria.$window.document;
            // Need to make sure the new element has the same exact styling applied as the original element so we use
            // the same tag, class, style and append it to the same parent
            var tempSizerEl = document.createElement(this._element.tagName);
            tempSizerEl.className = this._element.className;
            tempSizerEl.setAttribute("style", this._element.getAttribute("style"));
            this._element.parentNode.appendChild(tempSizerEl);

            // Now we need to make sure the element displays on one line and is not visible in the page
            tempSizerEl.style.visibility = "hidden";
            tempSizerEl.style.position = "absolute";
            tempSizerEl.style.whiteSpace = "nowrap";

            tempSizerEl.innerHTML = text;

            var eltWidth = tempSizerEl.offsetWidth;

            // delete tmp element
            tempSizerEl.parentNode.removeChild(tempSizerEl);
            tempSizerEl = null;

            return eltWidth;
        },

        tearDown : function () {
            this._element.parentNode.removeChild(this._element);
            this._element = null;
        }

    }
});

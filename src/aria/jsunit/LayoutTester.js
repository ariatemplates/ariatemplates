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
    $classpath : "aria.jsunit.LayoutTester",
    $singleton : true,
    $statics : {
        excludeRegExp : /"^(script|noscript|style|option)$"/gi
    },
    $constructor : function () {
        this.elements = [];
    },
    $prototype : {
        /**
         * Captures the dom elements information of the root children elements (including the root). These properties
         * are stored for each node : id, tagName, top, left, width, height and text.
         * @param {HtmlElement} root The root node.
         */
        captureJsonScreenshot : function (root) {
            this.elements = [];
            if (!root) {
                root = Aria.$window.document.body;
            }
            this._captureJsonScreenshot(root);
            return this.elements;
        },

        /**
         * Recursive method of captureJsonScreenshot
         * @param {HtmlElement} root The root node.
         * @private
         */
        _captureJsonScreenshot : function (root) {
            var excludeRegExp = this.excludeRegExp;
            var children = root.childNodes;
            for (var i = 0, ii = children.length; i < ii; i++) {
                var child = children[i];
                if (child.tagName && !excludeRegExp.test(child.tagName)) {
                    if (this._isHumanVisible(child)) {
                        this._saveElement(child);
                    }
                    this._captureJsonScreenshot(child);
                }
            }
        },

        /**
         * Convenient method to compare an old json with the last capture
         * @param {Array} arrayToCompare The array to be compared.
         * @return An array with messages about differences found. If no difference is found, an empty array is
         * returned.
         */
        compare : function (arrayToCompare) {

            if (!arrayToCompare) {
                return ["Array to compare is null"];
            }

            var result = [];
            var ref = this.elements;
            if (arrayToCompare.length != ref.length) {
                result.push("The items number is not the same");
                for (var i = 0, ii = ref.length; i < ii; i++) {
                    if (!arrayToCompare[i] || !this.itemCompare(ref[i], arrayToCompare[i])) {
                        result.push("Different from item " + i);
                        break;
                    }
                }
                return result;
            }

            // From here, both length array are equals
            for (var i = 0, ii = ref.length; i < ii; i++) {
                if (!arrayToCompare[i] || !this.itemCompare(ref[i], arrayToCompare[i])) {
                    result.push("Item " + i + " is different");
                }
            }
            return result;

        },

        /**
         * Convenient method to compare an json element on one single level. It also prevent to compare the 'element'
         * attribute, which is the html object.
         * @param {JSON} item1 Object 1 to compare
         * @param {JSON} item2 Object 2 to compare
         * @return true if item1 is equals to item2
         */
        itemCompare : function (item1, item2) {
            for (var key in item1) {
                if (key != "element" && item1[key] !== item2[key]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Stores the json of a dom element.
         * @param {HtmlElement} el The element to store
         * @private
         */
        _saveElement : function (el) {
            var coords = this._getCoordinates(el);
            var text = this._getDirectTextContent(el);
            this.elements.push({
                element : el,
                id : el.id,
                tagName : el.tagName,
                top : coords.top,
                left : coords.left,
                width : coords.width,
                height : coords.height,
                text : text
            });
        },

        /**
         * Returns true if the element is visible
         * @param {HtmlElement} el The element to test
         * @return true if the element is visible
         * @private
         */
        _isHumanVisible : function (el) {
            // If it's an image, directly return true
            if (el.tagName.toLowerCase() == "img") {
                return true;
            }
            // If it's invisible via CSS, directly return false
            if (el.style.display == "none" || el.style.visibility == "hidden") {
                return false;
            }
            // If it's too small to be seen, return false
            var coords = this._getCoordinates(el);
            if (coords.width === 0 && coords.height === 0) {
                return false;
            }
            // If it contains text as the first child, directly return true
            if (this._hasDirectChildText(el)) {
                return true;
            }
            // Otherwise, check if it has a border or background
            return this._hasStyleThatMakesItVisible(el);
        },

        /**
         * Returns true if the element has a text value
         * @param {HtmlElement} el The element to test
         * @return true if the element has a text value
         * @private
         */
        _hasDirectChildText : function (el) {
            return this._getDirectTextContent(el) !== "";
        },

        /**
         * Returns true if the element is visible, regarding some properties as the border, the background, ...
         * @param {HtmlElement} el The element to test
         * @return true if the element is visible.
         * @private
         */
        _hasStyleThatMakesItVisible : function (el) {
            // var getComputedStyle = document.defaultView.getComputedStyle;

            var computedStyle = el.currentStyle || el.ownerDocument.defaultView.getComputedStyle(el);

            return (computedStyle.border !== "" || computedStyle.borderWidth !== ""
                    || computedStyle.borderTopWidth !== "" || computedStyle.borderLeftWidth !== ""
                    || computedStyle.borderBottomWidth !== "" || computedStyle.borderRightWidth !== ""
                    || (computedStyle.background !== "" && computedStyle.background !== "none")
                    || (computedStyle.backgroundImage !== "" && computedStyle.backgroundImage !== "none") || (computedStyle.backgroundColor !== "" && computedStyle.backgroundColor !== "transparent"));
        },

        /**
         * Returns the coordinates of the dom element
         * @param {HtmlElement} el Dom element
         * @return coordinates object
         * @private
         */
        _getCoordinates : function (el) {
            var clientRect = el.getBoundingClientRect();
            // clientRect is readonly, and width/height are not in ie

            // Math.round : to have the same result with all browsers:
            var coordinates = {};
            coordinates.top = Math.round(clientRect.top);
            coordinates.left = Math.round(clientRect.left);
            coordinates.width = Math.round(clientRect.width || el.offsetWidth);
            coordinates.height = Math.round(clientRect.height || el.offsetHeight);

            return coordinates;
        },

        /**
         * Returns the text content of a dom element
         * @param {HtmlElement} el Dom element
         * @return The text content
         * @private
         */
        _getDirectTextContent : function (el) {
            if (el.tagName.toLowerCase() == "input" && el.getAttribute("type") == "text") {
                return el.value;
            }
            var children = el.childNodes;
            var str = "";
            for (var i = 0, ii = children.length; i < ii; i++) {
                var child = children[i];
                if (child.nodeType == 3) {
                    var text = child.textContent || child.innerText || child.nodeValue;
                    if (text) {
                        text = text.replace(/(\r\n|[\r\n])/g, "").replace(new RegExp(String.fromCharCode(160), "g"), " ").replace(/^\s+|\s+$/g, "");
                        if (text !== "") {
                            str += text;
                        }
                    }
                }
            }
            return str;
        }
    }
});

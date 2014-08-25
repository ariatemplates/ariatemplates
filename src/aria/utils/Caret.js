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
var Aria = require("../Aria");


/**
 * @class aria.utils.Caret Utilities for the caret
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Caret',
    $singleton : true,
    $prototype : {
        /**
         * Return the caret position of the HTML element
         * @param {HTMLElement} element The html element
         * @return {Object} The caret position (start and end)
         */
        getPosition : function (element) {
            var pos = {
                start : 0,
                end : 0
            };

            if ("selectionStart" in element) {
                // w3c standard, available in all but IE<9
                pos.start = element.selectionStart;
                pos.end = element.selectionEnd;
            } else {
                // old IE support
                var document = Aria.$window.document;
                if (document.selection) {
                    var sel = document.selection.createRange();
                    var initialLength = sel.text.length;
                    sel.moveStart('character', -element.value.length);
                    var x = sel.text.length;
                    pos.start = x - initialLength;
                    pos.end = x;
                }
            }

            return pos;
        },

        /**
         * Set the caret position of the HTML element
         * @param {HTMLElement} element The html element
         * @param {Integer} start The starting caret position
         * @param {Integer} end The ending caret position
         */
        setPosition : function (element, start, end) {
            if ("selectionStart" in element) {
                element.selectionStart = start;
                element.selectionEnd = end;
            } else {
                var document = Aria.$window.document;
                if (document.selection) {
                    var range = element.createTextRange();
                    range.moveStart('character', start);
                    range.moveEnd('character', -element.value.length + end);
                    range.select();
                }
            }
        },

        /**
         * Select the element text setting the caret position to the whole input value.
         * @type {HTMLElement} element The html elment
         */
        select : function (element) {
            var start = 0;
            var end = (element.value.length) ? element.value.length : 0;
            if (end) {
                this.setPosition(element, start, end);
            }
        }
    }
});

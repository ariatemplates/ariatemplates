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
    $classpath : "aria.utils.css.Colors",
    $dependencies : ["aria.utils.css.PropertiesConfig"],
    $singleton : true,
    $constructor : function () {
        this.cfg = aria.utils.css.PropertiesConfig;
    },
    $prototype : {

        /**
         * Converts the value of a CSS color into hexadecimal notation
         * @param {String} color valid CSS color value e.g. "rgb(255, 255, 0)", "green"
         * @return {String} value in hexadecimal notation e.g. "#FF0000"
         */
        convertColorToHex : function (color) {
            if (/^rgb/.test(color)) {
                var hex = ["#"];
                var rgb = this.getRGBComponentsFromRGBNotation(color);
                hex.push(rgb[0].toString(16));
                hex.push(rgb[1].toString(16));
                hex.push(rgb[2].toString(16));
                return hex.join("");
            } else if (color.charAt(0) != "#") {
                return this.cfg.COLORS[color.toLowerCase()];
            }
            return color;
        },

        /**
         * Converts the value of a CSS color into RGB notation
         * @param {String} color valid CSS color value e.g. "#FF0000", "green"
         * @return {String} value in RGB notation e.g. "rgb(255, 255, 0)"
         */
        convertColorToRGB : function (color) {
            var isRgb = /^rgb/.test(color);
            var isHex = color.charAt(0) == "#";
            if (isHex || !isRgb) {
                var col = (isHex) ? color : this.cfg.COLORS[color.toLowerCase()];
                var rgb = this._convertHexToRGBArray(col);
                return this.getRGBNotationFromRGBComponents(rgb);
            }
            // return already RGB color
            return color;
        },

        /**
         * Converts the value of a CSS color into RGB values
         * It supports <strong>only the <a href="http://www.w3.org/TR/css3-color/#html4">17 basic color keywords</a></strong>:
         * aqua, black, blue, fuchsia, gray, green, lime, maroon, navy, olive, purple, red, silver, teal, white, and yellow
         * @param {String} color valid CSS color value e.g. "#FF0000", "green", "rgb(255, 255, 0)"
         * @return {Array} RGB values e.g. [255, 255, 0]
         */
        getRGBComponents : function (color) {
            var isRgb = /^rgb/.test(color);
            var isHex = color.charAt(0) == "#";
            if (isHex || !isRgb) {
                var col = (isHex) ? color : this.cfg.COLORS[color.toLowerCase()];
                return this._convertHexToRGBArray(col);
            } else { // if in RGB notation
                return this.getRGBComponentsFromRGBNotation(color);
            }
        },

        /**
         * Converts the value of a RGB notation into RGB values
         * @param {String} color valid CSS color in RGB notation e.g. "rgb(255, 255, 0)"
         * @return {Array} RGB values e.g. [255, 255, 0]
         */
        getRGBComponentsFromRGBNotation : function (color) {
            var rgb = color.split(/[\(\)\,]/);
            return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
        },

        /**
         * Converts an RGB components array into an RGB notation
         * @param {Array} rgb values e.g. [255, 255, 0]
         * @return {String} value in RGB notation e.g. "rgb(255, 255, 0)"
         */
        getRGBNotationFromRGBComponents : function (rgb) {
            return ["rgb(", rgb[0], ",", rgb[1], ",", rgb[2], ")"].join("");
        },

        /**
         * Converts the hexadecimal value of a CSS color into RGB values
         * @param {String} color valid CSS color value e.g. "#FF0000"
         * @return {String} RGB values e.g. [255, 255, 0]
         */
        _convertHexToRGBArray : function (color) {
            var r = parseInt(color.substring(1, 3), 16);
            var g = parseInt(color.substring(3, 5), 16);
            var b = parseInt(color.substring(5, 7), 16);
            return [r, g, b];
        }

    }
});

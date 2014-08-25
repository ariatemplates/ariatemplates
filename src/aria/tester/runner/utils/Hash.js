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
var Aria = require("../../../Aria");


module.exports = Aria.classDefinition({
    $classpath : "aria.tester.runner.utils.Hash",
    $singleton : true,
    $constructor : function () {
        this._hashParameters = {};
    },
    $prototype : {
        /**
         * @private
         */
        _getHash : function () {
            return Aria.$window.document.location.hash;
        },

        /**
         * @private
         */
        _setHash : function (hash) {
            Aria.$window.document.location.hash = hash;
        },

        /**
         *
         */
        getParameter : function (key) {
            var hash = this._getHash();

            // remove initial #
            hash = hash.substring(1);

            var keyvalues = hash.split("&");
            for (var i = 0, l = keyvalues.length; i < l; i++) {
                var keyvalue = keyvalues[i];
                if (keyvalue.indexOf("=") != -1) {
                    var split = keyvalue.split("=");
                    if (key == split[0]) {
                        return split[1];
                    }
                }
            }
            return "";
        },

        setParameter : function (key, value) {
            var hash = this._getHash();
            var hashParam = [key, value].join("=");
            // remove initial #
            hash = hash.substring(1) || "";

            var found = false;
            var keyvalues = hash.split("&");
            for (var i = 0, l = keyvalues.length; i < l; i++) {
                var keyvalue = keyvalues[i];
                if (keyvalue.indexOf("=") != -1) {
                    var split = keyvalue.split("=");
                    if (key == split[0]) {
                        found = true;
                        keyvalues[i] = hashParam;
                    }
                }
            }

            if (!found) {
                if (keyvalues[keyvalues.length - 1] === "") {
                    keyvalues[keyvalues.length - 1] = hashParam;
                } else {
                    keyvalues.push(hashParam);
                }
            }

            hash = "#" + keyvalues.join("&");
            this._setHash(hash);
        }
    }
});

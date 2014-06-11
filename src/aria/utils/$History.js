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
var asyncRequire = require("noder-js/asyncRequire").create(module);

/**
 * Detect whether the HTML5 History API is available
 * @return {Boolean}
 */
var isHtml5HistoryAvailable = function () {
    var history = Aria.$window.history;
    if (history && history.pushState) {
        try {
            return history.state !== undefined;
        } catch (e) {
            // reading history.state on IE 10 can raise an "Unspecified error" exception
            return true;
        }
    }
    return false;
};

/**
 * @return {Object} An object containing
 *
 * <pre>
 * {
 *     isHtml5HistoryAvailable : whether the HTML5 History API is available,
 *     hashManager : a reference to aria.utils.HashManager if needed,
 *     arrayUtil : a reference to aria.utils.Array if needed
 * }
 * </pre>
 */
var getDependencies = function () {
    if (isHtml5HistoryAvailable()) {
        return {
            isHtml5HistoryAvailable : true,
            hashManager : null,
            arrayUtil : null
        };
    } else {
        return {
            isHtml5HistoryAvailable : false,
            hashManager : module.require("./HashManager"),
            arrayUtil : module.require("./Array")
        };
    }

};

getDependencies.$preload = function () {
    if (!isHtml5HistoryAvailable()) {
        return asyncRequire("./HashManager", "./Array");
    }
};

module.exports = {
    getDependencies : getDependencies
};
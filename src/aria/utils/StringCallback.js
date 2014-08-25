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
 * Utility class allowing to store a reference to a callback object and get a string which, when evaluated, will call
 * that callback object.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.StringCallback",
    $singleton : true,
    $constructor : function () {
        this._callbacks = {};
        this._index = 0;
    },
    $destructor : function () {
        this._callbacks = null;
    },
    $statics : {
        _VALUE_REGEXP : /^aria\.utils\.StringCallback\.call\(([0-9]+)\)$/
    },
    $prototype : {

        /**
         * Stores a reference to the given callback and returns a string which, when evaluated, calls that callback.
         * @param {aria.core.CfgBeans:Callback} cb callback to register.
         * @param {Boolean} moreThanOnce If true, the callback can be called several times. Otherwise, it is removed at
         * the first call.
         */
        createStringCallback : function (cb, moreThanOnce) {
            var index = this._index;
            this._index++;
            var entry = {
                cb : cb,
                moreThanOnce : moreThanOnce
            };
            this._callbacks["c" + index] = entry;
            return "aria.utils.StringCallback.call(" + index + ");";
        },

        /**
         * Removes the reference to a previously stored callback. After calling this method, the callback can no longer
         * be called, even if the return value from createStringCallback is evaluated.
         * @param {String} value Return value from createStringCallback.
         */
        deleteStringCallback : function (value) {
            var match = this._VALUE_REGEXP.exec(value);
            if (match) {
                var index = match[1];
                delete this._callbacks["c" + index];
            }
        },

        /**
         * This method is used when calling a callback stored on this object.
         * @param {Number} index Index of the callback to call.
         */
        call : function (index) {
            var entry = this._callbacks["c" + index];
            if (entry) {
                if (!entry.moreThanOnce) {
                    delete this._callbacks["c" + index];
                }
                this.$callback(entry.cb);
            }
        }
    }
});

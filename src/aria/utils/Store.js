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
var ariaUtilsArray = require("./Array");
var ariaUtilsCallback = require("./Callback");


/**
 * Store utility class. Usefull to register a stack of object, retrieve elements, filter, browse.
 * @class aria.utils.Store
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Store',
    $constructor : function () {
        /**
         * Internal stack of elements.
         * @type Array
         */
        this._store = null;

        /**
         * Store length. Optimisation of avoid using 'push'.
         * @type Number
         */
        this._storeLength = 0;
    },
    $destructor : function () {
        var elt;
        if (this._store) {
            for (var index = 0, l = this._store.length; index < l; index++) {
                elt = this._store[index];
                if (elt.$dispose) {
                    elt.$dispose();
                }
            }
            this._store = null;
        }
    },
    $prototype : {

        /**
         * Add an element in the store
         * @param {Object} elt Element to add
         */
        add : function (elt) {
            if (!this._store) {
                this._store = [];
                this.initialize();
            }
            this._store[this._storeLength++] = elt;
        },

        /**
         * Function called when a first element is added to the store.
         */
        initialize : function () {},

        /**
         * Remove an element from the store
         * @param {Object} elt
         * @return {Boolean} true if element was found and removed
         */
        remove : function (elt) {
            if (this._store && ariaUtilsArray.remove(this._store, elt)) {
                this._storeLength--;
                return true;
            }
            return false;
        },

        /**
         * Get the number of elements in the store
         * @return {Number}
         */
        getSize : function () {
            return this._storeLength;
        },

        /**
         * Get an element matching the match function
         * @param {aria.core.CfgBeans:Callback} matchFunction takes the element as first argument and return true if
         * element matches.
         * @param {Boolean} multiple false if returns first instance, true if returns all instances in array
         * @return {Object|Array}
         */
        getMatch : function (matchFunction, multiple) {
            multiple = multiple === true;
            var elt = null, result = multiple ? [] : null, resultNb = 0;
            for (var i = 0; i < this._storeLength; i++) {
                elt = this._store[i];
                if (this.$callback(matchFunction, elt)) {
                    if (!multiple) {
                        return elt;
                    }
                    result[resultNb++] = elt;
                }
            }
            return result;
        },

        /**
         * Remove from store element matching the match function, return the elements removed
         * @param {aria.core.CfgBeans:Callback} matchFunction takes the element as first argument and return true if
         * element matches.
         * @param {Boolean} multiple false will stop at first instance. if true, function will return number of element
         * removed
         * @return {Object|Array}
         */
        removeMatch : function (matchFunction, multiple) {
            matchFunction = new ariaUtilsCallback(matchFunction);
            multiple = multiple === true;
            var elt = null, result = multiple ? [] : null;
            for (var i = 0; i < this._storeLength; i++) {
                elt = this._store[i];
                if (matchFunction.call(elt)) {
                    this._store.splice(i, 1);
                    this._storeLength--;
                    i -= 1;
                    if (!multiple) {
                        matchFunction.$dispose();
                        return elt;
                    }
                    result.push(elt);
                }
            }
            matchFunction.$dispose();
            return result;
        },

        /**
         * Apply a function on each element of the store, or elements matching the match function
         * @param {aria.core.CfgBeans:Callback} actionFunction takes the element as first argument
         * @param {aria.core.CfgBeans:Callback} matchFunction OPTIONAL takes the element as first argument and return
         * true if element matches.
         */
        foreach : function (actionFunction, matchFunction) {
            var elt = null;

            actionFunction = new ariaUtilsCallback(actionFunction);

            if (matchFunction) {
                matchFunction = new ariaUtilsCallback(matchFunction);
            }

            for (var i = 0; i < this._storeLength; i++) {
                elt = this._store[i];
                if (matchFunction && !matchFunction.call(elt)) {
                    continue;
                }
                actionFunction.call(elt);
            }

            actionFunction.$dispose();

            if (matchFunction) {
                matchFunction.$dispose();
            }
        }

    }
});

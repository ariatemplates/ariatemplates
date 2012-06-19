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

(function () {
    /**
     * Counter so that each StackHashMap object has its own metadata, and they won't interfere with each other in case
     * an object is a key in several MultiHashMap objects.
     */
    var __objCount = 0;
    /**
     * Shortcut to aria.utils.Type
     */
    var typeUtils;

    /**
     * A StackHashMap object is a map of stacks (last in, first out) of values. The key feature of this class is that it
     * accepts any type of keys (in addition to any type of values) in the map. It is implemented as metadata for object
     * keys and with a JavaScript map for strings and numbers.
     */
    Aria.classDefinition({
        $classpath : "aria.utils.StackHashMap",
        $dependencies : ["aria.utils.Type"],
        $onload : function () {
            typeUtils = aria.utils.Type;
        },
        $onunload : function () {
            typeUtils = null;
        },
        /**
         * Create an empty StackHashMap object.
         */
        $constructor : function () {
            __objCount++;
            /**
             * Counter to be used as an index in each map. Is incremented each time a new entry is added to the object.
             * @private
             * @type Number
             */
            this._nextIndex = 0;
            /**
             * Map to store entries whose keys are of type object or function. Note that, even if null is of type
             * object, it cannot store properties, and for this reason, an entry whose key is null is not stored here,
             * but in this._otherKeys.
             * @private
             * @type Entry
             */
            this._objectKeys = null;
            /**
             * Map to store entries whose keys are of type string.
             * @private
             * @type Entry
             */
            this._stringKeys = null;
            /**
             * Map to store entries whose keys are of type number.
             * @private
             * @type Entry
             */
            this._numberKeys = null;
            /**
             * Map to store entries whose keys are neither objects (with the exception of null), nor functions, nor
             * strings, nor numbers. Sample values for keys here: null and undefined (and maybe some other strange
             * type). For keys in that category, performances are very bad (must iterate over the whole _otherKeys stuff
             * to find a key).
             * @private
             * @type Entry
             */
            this._otherKeys = null;
            /**
             * Name of the metadata to use when storing information in object keys. It must be unique.
             * @private
             * @type String
             */
            this._metaDataName = Aria.FRAMEWORK_PREFIX + "hash::" + __objCount;
        },
        $destructor : function () {
            this.removeAll();
        },
        $beans : {
            "Entry" : {
                $type : "json:Object",
                $description : "Structure used to store a (key, value) pair in a StackHashMap object.",
                $properties : {
                    "key" : {
                        $type : "json:MultiTypes",
                        $description : "Key of the entry."
                    },
                    "value" : {
                        $type : "json:MultiTypes",
                        $description : "Value of the entry."
                    },
                    "next" : {
                        $type : "Entry",
                        $description : "Link to the entry with the same key, which was present before adding this entry, if any, or undefined otherwise."
                    },
                    "index" : {
                        $type : "json:MultiTypes",
                        $description : "Index of this entry in _objectKeys, _stringKeys, _numberKeys, or _otherKeys."
                    }
                }
            }
        },

        $prototype : {

            /**
             * Return the right map (either this._objectKeys, or this._stringKeys, or this._numberKeys, or
             * this._otherKeys) depending on the type of the given key.
             * @private
             * @param {MultiTypes} key key whose type will be evaluated to select the right map
             * @param {Boolean} create If true and the corresponding map does not exist yet, it is created.
             * @return {Object} Either this._objectKeys, or this._stringKeys, or this._numberKeys, or this._otherKeys,
             * depending on the type of the given key
             */
            _getMap : function (key, create) {
                if (typeUtils.isString(key)) {
                    if (!this._stringKeys && create)
                        this._stringKeys = {};
                    return this._stringKeys;
                } else if (typeUtils.isNumber(key)) {
                    if (!this._numberKeys && create)
                        this._numberKeys = {};
                    return this._numberKeys;
                } else if (key != null && (typeof(key) == "object" || typeUtils.isFunction(key))) {
                    // don't use typeUtils.isObject here to be more general (it also accepts RegExp, Date, Array ...)
                    if (!this._objectKeys && create)
                        this._objectKeys = {};
                    return this._objectKeys;
                } else {
                    if (!this._otherKeys && create)
                        this._otherKeys = {};
                    return this._otherKeys;
                }
            },

            /**
             * Add an entry in the StackHashMap object.
             * @param {MultiTypes} key Key which can be used to retrieve the value later (through the pop method). If
             * the key is already present in the object, the value will be added anyway.
             * @param {MultiTypes} value Anything to store in the StackHashMap object
             */
            push : function (key, value) {
                var item = {
                    key : key,
                    value : value,
                    index : this._nextIndex
                };
                this._nextIndex++;
                var map = this._getMap(key, true);
                if (map == this._objectKeys) {
                    // something special in case of objects:
                    var next = key[this._metaDataName];
                    if (next) {
                        // the key is already present
                        // keep the old value
                        item.next = next;
                        // keep the index (so that the removal is unified between objects, strings and numbers)
                        item.index = next.index;
                    }
                    key[this._metaDataName] = item;
                } else if (map != this._otherKeys) {
                    item.index = key; // use the key as index for numbers and strings
                    item.next = map[item.index]; // keep any existing value
                } else {
                    // we must check for an existing value to define the 'next' property,
                    // so that the order when removing values is the one of a stack
                    for (var i in map) {
                        if (map.hasOwnProperty(i)) {
                            var elt = map[i];
                            if (key === elt.key) {
                                item.index = i;
                                item.next = elt;
                                break;
                            }
                        }
                    }
                }
                map[item.index] = item;
            },

            /**
             * Remove an entry from the StackHashMap object and return the value.
             * @param {MultiTypes} key key which was used to add the entry in the StackHashMap object.
             * @return {MultiTypes} value associated to the given key. If several entries were added with the same key,
             * return the last one which has not yet been removed (it is a stack).
             */
            pop : function (key) {
                var map = this._getMap(key, false);
                if (map == null) {
                    return undefined;
                }
                var item;
                if (map == this._objectKeys) {
                    item = key[this._metaDataName];
                    if (item) {
                        key[this._metaDataName] = item.next;
                        if (!item.next) {
                            delete key[this._metaDataName];
                        }
                    }
                } else if (map != this._otherKeys) {
                    item = map[key];
                } else {
                    for (var i in map) {
                        if (map.hasOwnProperty(i)) {
                            var elt = map[i];
                            if (key === elt.key) {
                                item = elt;
                                break;
                            }
                        }
                    }
                }
                if (item) {
                    var next = item.next;
                    map[item.index] = next;
                    if (!next) {
                        delete map[item.index];
                    }
                    item.key = null;
                    item.next = null;
                    return item.value;
                } else {
                    return undefined;
                }
            },

            /**
             * Remove all the entries of the given map and put the corresponding values in the given array.
             * @private
             * @param {Object} map of entries to be emptied
             * @param {Array} array which will receive the values
             */
            _removeAllToArray : function (map, array) {
                if (map == null)
                    return;
                for (var i in map) {
                    var item = map[i];
                    var key = item.key;
                    if (map == this._objectKeys) {
                        key[this._metaDataName] = null
                        delete item.key[this._metaDataName];
                    }
                    while (item) {
                        array.push(item.value);
                        item.value = null;
                        item.key = null;
                        var next = item.next;
                        item.next = null;
                        item = next;
                    }
                    map[i] = null;
                    delete map[i];
                }
            },

            /**
             * Remove all the entries of the StackHashMap object and return the corresponding values.
             * @return {Array} array of all the values present in the StackHashMap object
             */
            removeAll : function () {
                var res = [];
                this._removeAllToArray(this._objectKeys, res);
                this._objectKeys = null;
                this._removeAllToArray(this._stringKeys, res);
                this._stringKeys = null;
                this._removeAllToArray(this._numberKeys, res);
                this._numberKeys = null;
                this._removeAllToArray(this._otherKeys, res);
                this._otherKeys = null;
                return res;
            }

        }
    });
})();
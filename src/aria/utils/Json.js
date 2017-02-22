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
var ariaUtilsJsonJsonSerializer = require("./json/JsonSerializer");
var ariaUtilsType = require("./Type");
var ariaUtilsArray = require("./Array");
var ariaUtilsObject = require("./Object");

(function () {

    // shortcut to array & type utils
    var arrayUtils, typeUtils, jsonUtils, parProp, res = [];

    /**
     * Returns the container for listener for an optional target property. Returns a different container for recursive
     * listeners.
     * @private
     * @param {String} property can be null
     * @param {Boolean} recursive
     * @return {String} the property name of the container
     */
    var __getListenerMetaName = function (property, recursive) {
        var metaName = recursive ? jsonUtils.META_FOR_RECLISTENERS : jsonUtils.META_FOR_LISTENERS;
        if (property != null) {// the comparison with null is important, as 0 or "" must be considered as valid
            // property names
            metaName += "_" + property;
        }
        return metaName;
    };

    /**
     * Returns whether the given object can be used as a container for addListener and setValue.
     * @param {Object} container Object
     * @return {Boolean}
     * @private
     */
    var __isValidContainer = function (container) {
        return typeUtils.isContainer(container) &&
                // not HTML element
                !typeUtils.isHTMLElement(container) &&
                // not on class instances
                !container.$JsObject;
    };

    /**
     * Remove back-reference link from oldChild to parent (previous link was: parent[property] = oldChild).
     * @param {Object} oldChild old child. (this method does nothing if the child is null or does not have any back
     * references)
     * @param {Object} parent
     * @param {String} property
     * @private
     */
    var __removeLinkToParent = function (oldChild, parent, property) {
        var oldChildParents = oldChild ? oldChild[parProp] : null;
        if (oldChildParents) {
            for (var index = 0, parentDescription; parentDescription = oldChildParents[index]; index++) {
                if (parentDescription.parent == parent && parentDescription.property == property) {
                    oldChildParents.splice(index, 1);
                    // there should be only one.
                    break;
                }
            }
            if (oldChildParents.length === 0) {
                __checkAndRemoveBackRefs(oldChild);
            }
        }
    };

    /**
     * Update back-references when the property name under which a parent was referencing a child changed.
     * @param {Object} child child. This method does nothing if the child is null or does not have any back references)
     * @param {Object} parent
     * @param {String} oldProperty
     * @param {String} newProperty
     * @private
     */
    var __changeLinkToParent = function (child, parent, oldProperty, newProperty) {
        var childParents = child ? child[parProp] : null;
        if (childParents) {
            for (var index = 0, parentDescription; parentDescription = childParents[index]; index++) {
                if (parentDescription.parent == parent && parentDescription.property == oldProperty) {
                    parentDescription.property = newProperty;
                    // there should be only one.
                    break;
                }
            }
        }
    };

    /**
     * Returns whether back references recursive methods will go down through links with that name.
     * @param {String} propertyName Property name.
     * @return {Boolean}
     * @private
     */
    var __includePropForBackRef = function (propertyName) {
        // which property names are included for back references
        return (propertyName != jsonUtils.OBJECT_PARENT_PROPERTY &&
            propertyName.substr(0, jsonUtils.META_FOR_LISTENERS.length) != jsonUtils.META_FOR_LISTENERS &&
            propertyName.substr(0, jsonUtils.META_FOR_RECLISTENERS.length) != jsonUtils.META_FOR_RECLISTENERS);
    };

    /**
     * Check if the container has no parent and no recursive listener.
     * In that case, its references in the aria:parent property of its
     * children are removed.
     */
    var __checkAndRemoveBackRefs = function (container) {
        var ariaParents = container[parProp];
        if (!ariaParents || ariaParents.length > 0) {
            return;
        }
        var recListenersPrefix = jsonUtils.META_FOR_RECLISTENERS;
        var recListenersPrefixLength = recListenersPrefix.length;
        for (var childName in container) {
            if (container.hasOwnProperty(childName) && childName.substr(0, recListenersPrefixLength) === recListenersPrefix) {
                // we found a recursive listener, we cannot remove aria:parent in children!
                return;
            }
        }
        // no recursive listener in this object and no parent, we can safely remove the aria:parent link
        // and do the same in children
        delete container[parProp];
        for (var childName in container) {
            if (container.hasOwnProperty(childName) && __includePropForBackRef(childName)) {
                __removeLinkToParent(container[childName], container, childName);
            }
        }
    };

    /**
     * Clean temporary markers pushed in the structure by exploring parents
     * @private
     * @param {Object} node to start with
     */
    var __cleanUpRecMarkers = function (node) {
        var recMarker = jsonUtils.TEMP_REC_MARKER;
        if (node[recMarker]) {
            node[recMarker] = false;
            delete node[recMarker];
            var parents = node[jsonUtils.OBJECT_PARENT_PROPERTY];
            if (parents) {
                for (var index = 0, l = parents.length; index < l; index++) {
                    __cleanUpRecMarkers(parents[index].parent);
                }
            }
        }
    };

    /**
     * Append the given new array of listeners to the existing array of listeners. It is used when retrieving the array
     * of listeners to call. The resulting array of listeners can be modified without changing newListeners. If both
     * element are null, will return null
     * @param {Array} newListeners listeners to add, can be null
     * @param {Array} existingListeners existing listeners, can be null
     * @return {Array}
     * @private
     */
    var __appendListeners = function (newListeners, existingListeners) {
        if (newListeners != null) {
            if (!existingListeners) {
                existingListeners = [];
            }
            existingListeners.push.apply(existingListeners, newListeners);
        }
        return existingListeners;
    };

    /**
     * Retrieve listeners in node and its parents
     * @private
     * @param {Object} node
     * @param {String} property (may be null, for changes which are not related to a specific property, e.g. splice on
     * an array)
     * @param {Boolean} retrieve recursive listeners only, default is false
     * @param {Array} listeners
     */
    var __retrieveListeners = function (node, property, recursive, listeners) {
        if (property != null) {
            // add property specific listeners
            listeners = __retrievePropertySpecificListeners(node, property, recursive, listeners);
        }

        // recursive check
        if (node[jsonUtils.TEMP_REC_MARKER]) {
            return listeners;
        }

        // add general listeners
        listeners = __retrievePropertySpecificListeners(node, null, recursive, listeners);

        // case parent property is defined: look for "recursive" listener in parent nodes
        var parents = node[jsonUtils.OBJECT_PARENT_PROPERTY];
        if (parents) {
            // mark this node has being visited
            node[jsonUtils.TEMP_REC_MARKER] = true;

            for (var index = 0, parentDesc; parentDesc = parents[index]; index++) {
                listeners = __retrieveListeners(parentDesc.parent, parentDesc.property, true, listeners);
            }
            // at the end, clean recursive markup (only first call will have recursive set to null)
            if (!recursive) {
                __cleanUpRecMarkers(node);
            }
        }

        return listeners;
    };

    /**
     * Retrieve property-specific listeners (both recursive and non recursive) on this node.
     * @private
     * @param {Object} node
     * @param {String} property
     * @param {Boolean} recursive
     * @param {Array} listeners
     */
    var __retrievePropertySpecificListeners = function (node, property, recursive, listeners) {
        // add property specific recursive listeners
        listeners = __appendListeners(node[__getListenerMetaName(property, true)], listeners);
        if (!recursive) {
            // add property specific non-recursive listeners
            listeners = __appendListeners(node[__getListenerMetaName(property)], listeners);
        }
        return listeners;
    };

    /**
     * Call the given listeners with the given parameter.
     * @param {Array} listeners array of listeners to call (can be retrieved with __retrieveListeners)
     * @param {Object} change object describing the change
     * @param {Object} listenerToExclude (optional) potential listener callback belonging to the object that raised the
     * change and which doesn't want to be notified
     */
    var __callListeners = function (listeners, change, listenerToExclude) {
        for (var idx = 0, length = listeners.length; idx < length; idx++) {
            var lsn = listeners[idx];
            if (lsn == listenerToExclude || !lsn) {
                continue;
            }
            var fn = lsn.fn;
            if (fn) {
                // note that calling $callback has an impact on performances (x2)
                // that's why we don't do it here
                fn.call(lsn.scope, change, lsn.args);
            }
        }
    };

    /**
     * Notifies JSON listeners that a value on the object they listen to has changed
     * @private
     * @param {Object} container reference to the data holder object - e.g. data.search.preferedCity
     * @param {String} property name of the property - e.g. '$value'
     * @param {Object} change object describing the change made to the property (containing oldValue/newValue if the
     * change was made with setValue)
     * @param {Object} listenerToExclude (optional) potential listener callback belonging to the object that raised the
     * change and which doesn't want to be notified
     */
    var __notifyListeners = function (container, property, change, listenerToExclude) {
        // retrieve listeners for this node and its parents
        // arguments given to the callback
        var listeners = __retrieveListeners(container, property);
        if (listeners) {
            change.dataHolder = container;
            change.dataName = property;
            __callListeners(listeners, change, listenerToExclude);
        }
    };

    /**
     * Json utility class
     * @singleton
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.utils.Json",
        $singleton : true,
        $events : {
            "aria-parent-metadata-added" : {
                description : "Notifies that a new parent has been added in the 'aria:parent' property of a node of the datamodel.",
                properties : {
                    child : "Node to which the parent has been added in the 'aria:parent' property.",
                    parent : "Parent of the child node.",
                    property : "Property of the parent node referencing the child node."
                }
            }
        },
        $constructor : function () {
            jsonUtils = this;
            arrayUtils = ariaUtilsArray;
            typeUtils = ariaUtilsType;
            parProp = this.OBJECT_PARENT_PROPERTY;

            /**
             * Default JSON serializer used inside the convertToJsonString method
             * @private
             * @type aria.utils.json.JsonSerializer
             */
            this.__defaultJsonSerializer = new ariaUtilsJsonJsonSerializer(true);
        },
        $destructor : function () {
            jsonUtils = null;
            arrayUtils = null;
            typeUtils = null;
            parProp = null;
            res = null;
            this.__defaultJsonSerializer.$dispose();
            this.__defaultJsonSerializer = null;
        },
        $statics : {

            /**
             * Meta used in json to store listeners
             * @type String
             */
            META_FOR_LISTENERS : Aria.FRAMEWORK_PREFIX + 'listener',

            /**
             * Meta used in json to store recursive listeners
             * @type String
             */
            META_FOR_RECLISTENERS : Aria.FRAMEWORK_PREFIX + 'reclistener',

            /**
             * Property name for the parent information container
             * @type String
             */
            OBJECT_PARENT_PROPERTY : Aria.FRAMEWORK_PREFIX + 'parent',

            /**
             * Property name for recursive temporary markers
             * @type String
             */
            TEMP_REC_MARKER : Aria.FRAMEWORK_PREFIX + 'tempRecMarker',

            /**
             * Possible value for the change property when calling listeners. It is used when the key in the object
             * existed before and the value was changed.
             * @type Number
             */
            VALUE_CHANGED : 0,

            /**
             * Possible value for the change property when calling listeners. It is used when the key in the object did
             * not exist before and was added.
             * @type Number
             */
            KEY_ADDED : 1,

            /**
             * Possible value for the change property when calling listeners. It is used when a key was removed in an
             * object.
             * @type Number
             */
            KEY_REMOVED : 2,

            /**
             * Possible value for the change property when calling listeners. It is used for global listeners on arrays,
             * and their parent listener, when an operation which changes the length of the array is done.
             * @type Number
             */
            SPLICE : 3,

            // ERROR MESSAGES:
            INVALID_JSON_CONTENT : "An error occured while loading an invalid JSON content:\ncontext: %1\nJSON content:\n%2",
            NOT_OF_SPECIFIED_DH_TYPE : "Invalid data holder type: expected to be an object or an array. Data holder provided: ",
            INVALID_SPLICE_PARAMETERS : "Invalid splice parameters.",
            INVALID_JSON_SERIALIZER_INSTANCE : "The provided instance of JSON serializer does not have a serialize method."
        },
        $prototype : {
            /**
             * Add a back-reference link from child to parent (knowing parent[property] = child). Recursively add
             * back-references in child if not already done.
             * @param {Object} child Child. (this method does nothing if the child is not a container)
             * @param {Object} parent
             * @param {String} property
             * @private
             */
            __addLinkToParent: function (child, parent, property) {
                if (__isValidContainer(child)) {
                    this.__checkBackRefs(child);
                    // add a reference to the parent in the new property
                    child[parProp].push({
                        parent : parent,
                        property : property
                    });
                    this.$raiseEvent({
                        name : 'aria-parent-metadata-added',
                        child: child,
                        parent: parent,
                        property: property
                    });
                }
            },

            /**
             * This method checks that back references up to container are present in the data model. If not, they are added
             * recursively.
             * @param {Object} container Must already be checked as a container according to __isValidContainer.
             * @private
             */
            __checkBackRefs: function (container) {
                if (container[parProp]) {
                    // back references already present, nothing to do
                    return;
                }
                // back references are not present yet
                container[parProp] = [];
                for (var childName in container) {
                    if (container.hasOwnProperty(childName) && __includePropForBackRef(childName)) {
                        var childValue = container[childName];
                        if (__isValidContainer(childValue)) {
                            this.__checkBackRefs(childValue);
                            // Add the container reference and property name to the child 'aria:parent' array
                            childValue[parProp].push({
                                parent : container,
                                property : childName
                            });
                            this.$raiseEvent({
                                name : 'aria-parent-metadata-added',
                                child: childValue,
                                parent: container,
                                property: childName
                            });
                        }
                    }
                }
            },

            /**
             * Converts an object to a JSON string
             * @param {Object|Array|String|Number|Boolean|Date|RegExp|Function} item item to serialize
             * @param {Object} options options for the serialize method of the serializer - optional
             * @param {Object} serializerInstance instance of a serializer - optional. If not provided, an instance of
             * the default serializer (aria.utils.json.JsonSerializer) is used. If the provided instance does not have a
             * serialize method, an error is raised
             * @return {String} the JSON string. null if the JSON serialization failed
             */
            convertToJsonString : function (item, options, serializerInstance) {
                if (serializerInstance) {
                    if ("serialize" in serializerInstance) {
                        return serializerInstance.serialize(item, options);
                    } else {
                        this.$logError(this.INVALID_JSON_SERIALIZER_INSTANCE);
                        return null;
                    }
                }

                return this.__defaultJsonSerializer.serialize(item, options);
            },

            /**
             * Changes the content of an array, adding new elements while removing old elements.
             * @param {Array} container Array to be modified.
             * @param {Number} index Index at which to start changing the array. If negative, will begin that many
             * elements from the end.
             * @param {Number} howManyRemoved An integer indicating the number of old array elements to remove. If
             * howMany is 0, no elements are removed.
             * @param {...*} var_args The elements to add to the array. If you don't specify any elements, the method
             * simply removes elements from the array.
             * @return {Array} an array containing the items removed from the original array, or null if an error
             * occurred (bad parameters).
             */
            splice : function (container, index, howManyRemoved) {
                var howManyAdded = arguments.length - 3;

                if (!(typeUtils.isArray(container) && typeUtils.isNumber(index) && typeUtils.isNumber(howManyRemoved)
                        && howManyAdded >= 0 && howManyRemoved >= 0)) {
                    this.$logError(this.INVALID_SPLICE_PARAMETERS, [], arguments);
                    return null;
                }

                // Adapt parameters:
                var oldLength = container.length;
                if (index < 0) {
                    // adapt the index value
                    index = oldLength + index;
                    if (index < 0) {
                        index = 0;
                    }
                }
                if (index > oldLength) {
                    index = oldLength;
                }
                if (index + howManyRemoved > oldLength) {
                    howManyRemoved = oldLength - index;
                }
                if (howManyAdded === 0 && howManyRemoved === 0) {
                    // no change
                    return [];
                }

                // call the splice method from JavaScript:
                var arrayPrototype = Array.prototype;
                var removed = arrayPrototype.splice.apply(container, arrayPrototype.slice.call(arguments, 1));

                // do some integrity checks:
                var newLength = container.length;
                this.$assert(526, howManyRemoved == removed.length);
                this.$assert(527, oldLength + howManyAdded - howManyRemoved == newLength);

                // Update back-references:
                if (container[parProp]) {
                    if (howManyRemoved > 0) {
                        // remove the parent info from the removed items
                        for (var i = howManyRemoved - 1; i >= 0; i--) {
                            __removeLinkToParent(removed[i], container, index + i);
                        }
                    }
                    if (howManyAdded > 0) {
                        // add the parent info to the added items:
                        for (var i = index + howManyAdded - 1; i >= index; i--) {
                            this.__addLinkToParent(container[i], container, i);
                        }
                    }
                    if (howManyAdded != howManyRemoved) {
                        // change the parent info of the moved items
                        for (var newIndex = index + howManyAdded, oldIndex = index + howManyRemoved; newIndex < newLength; newIndex++, oldIndex++) {
                            __changeLinkToParent(container[newIndex], container, oldIndex, newIndex);
                        }
                    }
                }

                // notify listeners, in two steps:
                // - first, property-specific listeners, for each index that changed
                // - then global listeners, to notify about splice change

                var listeners = null;
                var length = (howManyAdded == howManyRemoved) ? index + howManyAdded : Math.max(oldLength, newLength);
                for (var i = index; i < length; i++) {
                    listeners = __retrievePropertySpecificListeners(container, i);
                    if (listeners) {
                        var args = {
                            dataHolder : container,
                            dataName : i
                        };
                        if (i >= newLength) {
                            args.change = this.KEY_REMOVED;
                        } else {
                            args.change = this.VALUE_CHANGED;
                            args.newValue = container[i];
                        }
                        if (i < index + howManyRemoved) {
                            // removed value
                            args.oldValue = removed[i - index];
                        } else {
                            // either a moved item, or an item which was beyond the end of the original array
                            args.oldValue = container[i - howManyRemoved + howManyAdded];
                        }
                        __callListeners(listeners, args);
                    }
                }

                listeners = __retrieveListeners(container); // global listeners (not property-specific)
                if (listeners) {
                    __callListeners(listeners, {
                        change : this.SPLICE,
                        dataHolder : container,
                        index : index,
                        removed : removed,
                        added : arrayPrototype.slice.call(arguments, 3)
                    });
                }

                return removed;
            },

            /**
             * Delete a key in Json object (<code>delete container[property]</code>) and make sure all JSON
             * listeners are called.
             * @param {Object} container reference to the data holder object - e.g. data.search.preferedCity
             * @param {String} property name of the key to delete - e.g. '$value'
             * @param {Object} listenerToExclude (optional) potential listener callback belonging to the object that
             * raised the change and which doesn't want to be notified
             * @param {Boolean} throwError default is false
             */
            deleteKey : function (container, property, listenerToExclude, throwError) {
                if (!__isValidContainer(container)) {
                    if (throwError) {
                        throw {
                            code : this.NOT_OF_SPECIFIED_DH_TYPE
                        };
                    } else {
                        this.$logError(this.NOT_OF_SPECIFIED_DH_TYPE, null, container);
                    }
                    return;
                }
                if (container.hasOwnProperty(property)) {
                    var oldVal = container[property];
                    delete container[property];

                    // If the "aria:parent" meta-data is not present, we do not add or remove back-references
                    // to this object. This is only needed when manipulating listeners.
                    if (container[parProp] && __includePropForBackRef(property)) {
                        // if present, remove the reference to the parent from the parent description list of the old
                        // value
                        __removeLinkToParent(oldVal, container, property);
                    }

                    __notifyListeners(container, property, {
                        change : this.KEY_REMOVED,
                        oldValue : oldVal
                    }, listenerToExclude);
                }
            },

            /**
             * Set value in Json object (container[property]) and make sure all JSON listeners are called
             * @param {Object} container reference to the data holder object - e.g. data.search.preferedCity
             * @param {String} property name of the property to set - e.g. '$value'
             * @param {MultiTypes} val the value to set to the property
             * @param {Object} listenerToExclude (optional) potential listener callback belonging to the object that
             * raised the change and which doesn't want to be notified
             * @param {Boolean} throwError default is false
             * @return {MultiTypes} the new value
             */
            setValue : function (container, property, val, listenerToExclude, throwError) {
                // check for interface
                if (!__isValidContainer(container)) {
                    if (throwError) {
                        throw {
                            code : this.NOT_OF_SPECIFIED_DH_TYPE
                        };
                    } else {
                        this.$logError(this.NOT_OF_SPECIFIED_DH_TYPE, null, container);
                    }
                    return;
                }

                var exists = container.hasOwnProperty(property);
                var oldVal = container[property];
                container[property] = val;

                // do nothing if the value did not change or was not created:
                if (oldVal !== val || !exists) {
                    // If the "aria:parent" meta-data is not present, we do not add or remove back-references
                    // to this object. This is only needed when manipulating listeners.
                    if (container[parProp] && __includePropForBackRef(property)) {
                        // if present, remove the reference to the parent from the parent description list of the old
                        // value
                        __removeLinkToParent(oldVal, container, property);

                        // if the new child is a container, add the reference back to container in the child after
                        // checking the child has back-references in its sub-tree
                        this.__addLinkToParent(val, container, property);
                    }

                    __notifyListeners(container, property, {
                        change : exists ? this.VALUE_CHANGED : this.KEY_ADDED,
                        newValue : val,
                        oldValue : oldVal
                    }, listenerToExclude);
                }
                return val;
            },

            /**
             * Get value in Json object (container[property]) and return a default value if no value is defined
             * @param {Array} container reference to the data holder object - e.g. data.search.preferedCity
             * @param {String} property name of the property to set - e.g. '$value'
             * @param {String} defaultValue the default value to set dh property if not found
             * @return {MultiTypes} the value
             */
            getValue : function (container, property, defaultValue) {
                if (!container || !property || !(property in container)) {
                    return defaultValue;
                }
                return container[property];
            },

            /**
             * Adds a listener to an object. The listener is a standard callback which is called when data are modified
             * through setValue. <strong>Note that callback parameter cannot be a function - see the note below</strong>.
             * @param {Object} container reference to the data holder object - e.g. data.search.preferedCity
             * @param {String} property name of a given property in the targeted container. If specified, the callback
             * will be called only if this property is changed.
             * @param {aria.core.CfgBeans:Callback} callback listener callback to add. <strong>Note that
             * JsObject.$callback is not used for performance reasons, so that only the form { fn : {Function}, scope:
             * {Object}, args : {MultiTypes}} is supported for this callback.</strong>
             * @param {Boolean} throwError if true, throws errors instead of logging it.
             * @param {Boolean} recursive If true, the listener will also be called for changes in the whole sub-tree of
             * the container. If false, it will be called only for changes in the container itself.
             */
            addListener : function (container, property, callback, throwError, recursive) {

                // backward compatibility support -> new parameter has been introduced after container.
                if (typeUtils.isObject(property)) {
                    return this.addListener(container, null, property, callback, throwError);
                }

                // choose the appropriate meta name depending on the type
                var meta = __getListenerMetaName(property, recursive);
                if (!__isValidContainer(container)) {
                    if (throwError) {
                        throw {
                            code : this.NOT_OF_SPECIFIED_DH_TYPE
                        };
                    } else {
                        this.$logError(this.NOT_OF_SPECIFIED_DH_TYPE, null, container);
                    }
                    return;
                }

                if (!container[meta]) {
                    container[meta] = [callback];
                } else {
                    // check if not already in the list
                    var listeners = container[meta];
                    if (arrayUtils.indexOf(listeners, callback) > -1) {
                        return; // already in the array
                    }
                    listeners.push(callback);
                }
                if (recursive) {
                    this.__checkBackRefs(container);
                }
            },

            /**
             * Remove a Json listener from a Json object (dh)
             * @param {Object} container reference to the data holder object - e.g. data.search.preferedCity
             * @param {String} property name of a given property in the targeted container. If specified, the callback
             * will be called only if this property is changed.
             * @param {aria.core.CfgBeans:Callback} callback listener callback to remove (must be exactly the same
             * object as the one used in addListener)
             * @param {Boolean} recursive must has the same value as the one used for recursive in addListener
             */
            removeListener : function (container, property, callback, recursive) {

                // backward compatibility support -> new parameter has been introduced after container.
                if (typeUtils.isObject(property)) {
                    return this.removeListener(container, null, property, callback);
                }

                // choose the appropriate meta name depending on the type
                var meta = __getListenerMetaName(property, recursive);
                if (!container || container[meta] == null) {
                    return;
                }
                // retrieve meta object, and index of callback in this container
                var listeners = container[meta], idx = arrayUtils.indexOf(listeners, callback);
                if (idx > -1) {
                    if (listeners.length == 1) {
                        container[meta] = null;
                        delete container[meta];
                        __checkAndRemoveBackRefs(container);
                    } else {
                        listeners.splice(idx, 1);
                    }
                }
            },

            /**
             * Recursively copy a JSON object into another JSON object
             * @param {Object} obj a json object
             * @param {Boolean} rec recursive copy - default true
             * @param {Array} filters if obj is an Object, will copy only keys in new object at first level.
             * @param {Boolean} keepMeta keeps meta data not inserted by aria
             *
             * <pre>
             * copy({
             *     a : 1,
             *     b : 2,
             *     c : 3
             * }, true, ['a', 'b']) = {
             *     a : 1,
             *     b : 2
             * }
             * </pre>
             */
            copy : function (obj, rec, filters, keepMeta) {
                rec = (rec !== false);
                var container = false, res;
                if (typeUtils.isArray(obj)) {
                    res = [];
                    container = true;
                } else if (typeUtils.isObject(obj)) {
                    res = {};
                    container = true;
                }
                if (container) {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            if (key.indexOf(":") != -1) {
                                if (!keepMeta) {
                                    continue;
                                } else {
                                    // meta-data from aria : we never copy them
                                    if (this.isMetadata(key)) {
                                        continue;
                                    }
                                }
                            }

                            if (filters && !arrayUtils.contains(filters, key)) {
                                continue; // filter elements
                            }

                            if (rec) {
                                res[key] = this.copy(obj[key], rec, null, keepMeta);
                            } else {
                                res[key] = obj[key];
                            }
                        }
                    }
                } else if (typeUtils.isDate(obj)) {
                    res = new Date(obj.getTime());
                } else {
                    res = obj;
                }
                return res;
            },

            /**
             * Load a JSON string and return the corresponding object
             * @param {String} str the JSON string
             * @param {Object} ctxt caller object - optional - used to retrieve the caller classpath in case of error
             * @param {String} errMsg the error message to use in case of problem - optional - default:
             * aria.utils.Json.INVALID_JSON_CONTENT
             * @return {Object}
             */
            load : function (str, ctxt, errMsg) {
                var res = null;
                try {
                    str = ('' + str).replace(/^\s/, ''); // remove first spaces
                    res = Aria["eval"]('return (' + str + ');');
                } catch (ex) {
                    res = null;
                    if (!errMsg) {
                        errMsg = this.INVALID_JSON_CONTENT;
                    }
                    if (ctxt && ctxt.$classpath) {
                        ctxt = ctxt.$classpath;
                    }
                    this.$logError(errMsg, [ctxt, str], ex);
                }
                return res;
            },

            /**
             * Injects child elements of a JSON object (src) into another JSON object (target). The elements of the
             * target object that are not present in the src object will remain unchanged. For elements already present,
             * 2 strategies are possible: 1. if merge=true, injection will be recursive so that only new elements of the
             * src object will be added 2. if merge=false (default) elements already present in target will be replaced
             * by elements from the src object
             * @param {Object|Array} src the source JSON structure
             * @param {Object|Array} target the target JSON structure
             * @param {Boolean} merge tells if the injection must be recursive - default: false
             * @return {Boolean} true if the injection was handled correctly
             */
            inject : function (src, target, merge) {

                merge = merge === true;

                var allArray = (typeUtils.isArray(src) && typeUtils.isArray(target));
                var allObject = (typeUtils.isObject(src) && typeUtils.isObject(target));
                var elem;

                if (!allArray && !allObject) {
                    return false;
                }

                if (src === target) {
                    return true;
                }

                if (allArray) {
                    if (!merge) {
                        for (var i = 0, l = src.length; i < l; i++) {
                            target.push(src[i]);
                        }
                    } else {
                        for (var i = 0, l = src.length; i < l; i++) {
                            elem = src[i];
                            if (!target[i]) {
                                target[i] = elem;
                            } else {
                                if (typeUtils.isContainer(elem)) {
                                    // recursive merge
                                    if (!this.inject(elem, target[i], true)) {
                                        // recursive injection is not possible
                                        target[i] = elem;
                                    }
                                } else if (typeUtils.isDate(elem)) {
                                    target[i] = new Date(elem.getTime());
                                } else {
                                    // may be a string, number, boolean, or something else: function ...
                                    target[i] = elem;
                                }
                            }
                        }
                    }
                } else if (allObject) {
                    for (var key in src) {
                        if (src.hasOwnProperty(key)) {
                            elem = src[key];
                            if (!target[key] || !merge) {
                                this.setValue(target, key, elem);
                            } else {
                                if (typeUtils.isContainer(elem)) {
                                    // recursive merge
                                    if (!this.inject(elem, target[key], true)) {
                                        // recursive injection is not possible
                                        this.setValue(target, key, elem);
                                    }
                                } else if (typeUtils.isDate(elem)) {
                                    this.setValue(target, key, new Date(elem.getTime()));
                                } else {
                                    // may be a string, number, boolean, or something else: function ...
                                    this.setValue(target, key, elem);
                                }
                            }
                        }
                    }
                }
                return true;
            },

            /**
             * Checks whether a JSON object is fully contained in another.
             * @param {Object} big the container JSON structure
             * @param {Object} small the contained JSON structure
             * @return {Boolean} true if <i>small</i> is contained in <i>big</i>
             */
            contains : function (big, small) {
                var isBigArray = typeUtils.isArray(big), isBigObject = typeUtils.isObject(big), isSmallArray = typeUtils.isArray(small), isSmallObject = typeUtils.isObject(small);

                if (isBigArray && isSmallArray) {
                    for (var i = 0, l = small.length; i < l; i++) {
                        if (!this.contains(big[i], small[i])) {
                            return false;
                        }
                    }
                } else if (isBigObject && isSmallObject) {
                    for (var key in small) {
                        if (small.hasOwnProperty(key)) {
                            if (key.match(/:/)) {
                                continue; // meta-data: we don't copy them
                            }
                            if (small.hasOwnProperty(key)) {
                                if (!this.contains(big[key], small[key])) {
                                    return false;
                                }
                            }
                        }
                    }
                } else {
                    var allTime = (typeUtils.isDate(big) && typeUtils.isDate(small));
                    if (allTime) {
                        return (small.getTime() === big.getTime());
                    } else {
                        return small === big;
                    }
                }
                return true;
            },

            /**
             * Add an item to an array, optionally giving the index, and notify listeners. If the index is not provided,
             * the item is added at the end of the array.
             * @param {Array} array array to be modified
             * @param {Object} item item to be added
             * @param {Number} index index where to add the item
             */
            add : function (array, item, index) {
                if (index == null) {
                    index = array.length;
                }
                this.splice(array, index, 0, item);
            },

            /**
             * Remove an item from an array at the specified index and notify listeners.
             * @param {Array} array array to be modified
             * @param {Number} index index where to remove the item
             */
            removeAt : function (array, index) {
                this.splice(array, index, 1);
            },

            /**
             * Checks whether a JSON object is equal to another.
             * @param {Object} obj1 the first JSON structure
             * @param {Object} obj2 the other JSON structure
             * @return {Boolean} true if <i>obj1</i> is equal to <i>obj2</i>
             */
            equals : function (obj1, obj2) {
                return this.contains(obj1, obj2) && this.contains(obj2, obj1);
            },

            /**
             * Retrieves all non metadata keys of a JSON object
             * @param {Object} container reference to the data holder object
             * @return {Array} an array containing all non metadata keys of the object
             * @see aria.utils.Object.keys
             */
            keys : function (container) {
                var raw = ariaUtilsObject.keys(container);
                return ariaUtilsArray.filter(raw, function (key) {
                    return !aria.utils.Json.isMetadata(key);
                });
            },

            /**
             * Checks if a property of a JSON object is used as metadata in the framework
             * @param {String} property The property to check (String, Integer or Object)
             * @returns {Boolean} True if the property is a String and it's used as metadata, false otherwise
             */
            isMetadata : function (property) {
                if (!ariaUtilsType.isString(property)) {
                    return false;
                }
                return (property.indexOf(Aria.FRAMEWORK_PREFIX) === 0);
            },

            /**
             * Creates a copy of the object without metadata inside
             * @param {Object} object the object to copy
             * @return {Object}
             */
            removeMetadata : function (object) {
                if (!object || !__isValidContainer(object)) {
                    return object;
                }
                var clone = typeUtils.isArray(object) ? [] : {};
                for (var key in object) {
                    if (!this.isMetadata(key)) {
                        clone[key] = this.removeMetadata(object[key]);
                    }
                }
                return clone;
            }
        }
    });

})();

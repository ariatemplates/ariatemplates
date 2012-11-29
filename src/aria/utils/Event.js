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
    var FOCUSIN = "focusin";
    var FOCUSOUT = "focusout";
    var listeners = [];
    var FN = 2;
    var WFN = 3;
    var EL = 0;
    var TYPE = 1;
    var lastError = null;
    var unloadListeners = null;
    var CAPTURE = 4;
    var CB = 5;
    var CLEANCB = 6;

    /**
     * Utilities for handling Dom event listeners
     */
    Aria.classDefinition({
        $classpath : "aria.utils.Event",
        $dependencies : ["aria.utils.Type", "aria.utils.Callback", "aria.core.Browser"],
        $singleton : true,
        $statics : {
            INVALID_TARGET : "Unable to add '%2' event on element %1"
        },
        $constructor : function () {
            this.typesUtil = aria.utils.Type;
            this.UA = aria.core.Browser;
            this.isIE = this.UA.ie;
            var oSelf = this;
            this._unload = function (e) {
                oSelf._unloadEvent(e);
            };
        },
        $destructor : function () {
            this.reset();
            this._unload = null;
        },
        $prototype : {

            /**
             * This is called to remove all events registered on the window (if any).
             */
            reset : function () {
                if (unloadListeners) {
                    unloadListeners = null;
                    this._simpleRemove(Aria.$window, "unload", this._unload);
                }
                for (var index = listeners.length - 1; index >= 0; index--) {
                    var l = listeners[index];
                    if (l) {
                        this.removeListener(l[EL], l[TYPE], l[FN], index);
                    }
                }
            },

            /**
             * Check that unloadListeners is initialized, and initialize it if it is not the case.
             */
            _checkUnloadListeners : function () {
                if (unloadListeners == null) {
                    unloadListeners = [];
                    this._simpleAdd(Aria.$window, "unload", this._unload);
                }
            },

            /**
             * Handler for the unload event.
             * @param {Object} e dom event
             */
            _unloadEvent : function (e) {
                // call unload listeners
                // Keep a local copy of the reference to unloadListeners because it is possible that a listener calls
                // aria.utils.Event.reset (that's what AriaWindow is doing).
                var list = unloadListeners;
                for (var i = 0, len = list.length; i < len; ++i) {
                    var l = list[i];
                    if (l) {
                        l[CB].call(this.getEvent(e));
                        list[i] = null;
                        l = null;
                    }
                }
            },

            /**
             * Appends an event handler
             * @param {String|HTMLElement|Array} element An id, an element reference, or a collection of ids and/or
             * elements to assign the listener to.
             * @param {String} event The type of event to append
             * @param {aria.utils.Callback|Object} callback The method the event invokes, if callback is of type Object
             * fn property is mandatory
             * @param {Boolean} useCapture capture or bubble phase
             * @return {Boolean} True if the action was successful or defered, false if one or more of the elements
             * could not have the listener attached, or if the operation throws an exception.
             */
            addListener : function (element, event, callback, scope, args, useCapture) {

                if (!callback) {
                    return false;
                }

                if ('mousewheel' == event) {
                    if (this.UA.isIE) {
                        if (element == Aria.$window) {
                            element = element.document;
                        }
                    } else if (!(this.UA.isOpera || this.UA.isSafari || this.UA.isWebkit)) {
                        event = 'DOMMouseScroll';
                    }
                }
                if (!this.typesUtil.isFunction(callback)) {
                    useCapture = scope;
                }
                var capture = ((event == FOCUSIN || event == FOCUSOUT) && !this.UA.ie) ? true : useCapture;
                return this._addListener(element, this._getType(event), callback, scope, args, capture);

            },

            /**
             * Adds a DOM event directly without the caching, cleanup, context adj, etc
             * @param {HTMLElement} element the element to bind the handler to
             * @param {String} event the type of event handler
             * @param {Function} callback the callback to invoke
             * @param {Boolean} capture capture or bubble phase
             * @protected
             */
            _simpleAdd : function () {
                if (Aria.$window) {
                    if (Aria.$window.addEventListener) {
                        return function (element, event, callback, capture) {
                            element.addEventListener(event, callback, (capture));
                        };
                    } else if (Aria.$window.attachEvent) {
                        return function (element, event, callback, capture) {
                            element.attachEvent("on" + event, callback);
                        };
                    }
                }
                return function () {};
            }(),

            /**
             * Appends an event handler. Target elements should already be in the DOM, an error is logged otherwise.
             * @param {String|HTMLElement|Array} element An id, an element reference, or a collection of ids and/or
             * elements to assign the listener to.
             * @param {String} event The type of event to append
             * @param {aria.utils.Callback|Object} callback The method the event invokes, if callback is of type Object
             * fn property is mandatory
             * @param {Boolean} useCapture capture or bubble phase
             * @return {Boolean} True if the action was successful, false if one or more of the elements could not have
             * the listener attached, or if the operation throws an exception.
             * @protected
             */
            _addListener : function (element, event, callback, scope, args, useCapture) {
                if (this._isValidCollection(element)) {
                    var ok = true;
                    for (var i = 0, len = element.length; i < len; ++i) {
                        ok = this._addListener(element[i], event, callback, scope, args, useCapture) && ok;
                    }
                    return ok;
                }

                if (this.typesUtil.isString(element)) {
                    var oElement = this.getElement(element);
                    if (!oElement) {
                        this.$logError(this.INVALID_TARGET, [element, event]);
                        element = oElement;

                        return false;
                    }

                    element = oElement;
                }

                if (!this.typesUtil.isHTMLElement(element)) {
                    // Element should be an html element
                    return false;
                }

                var handler = callback;
                if (!callback.$Callback) {
                    if (!handler.fn || !this.typesUtil.isFunction(handler.fn)) {
                        return false;
                    }
                    if (!handler.scope) {
                        handler.scope = element;
                    }
                    // callback = new aria.utils.Callback(handler);
                }
                var handlerCBInstance = callback;
                if (!callback.$Callback) {
                    handlerCBInstance = new aria.utils.Callback(handler);
                }

                // wrap the function so we can return the obj object
                // when
                // the event fires;
                var wrappedCallback = function (e) {
                    return handlerCBInstance.call(aria.utils.Event.getEvent(e, element));
                };
                var cleanCallback = function () {
                    handlerCBInstance = {
                        call : Aria.empty
                    };
                    wrappedCallback = null;
                    cleanCallback = null;
                    li = null;
                    element = null;
                };
                var li = [element, event, callback, wrappedCallback, useCapture, handlerCBInstance, cleanCallback];

                // we need to make sure we fire registered unload events
                // prior to automatically unhooking them. So we hang on
                // to
                // these instead of attaching them to the window and
                // fire the
                // handles explicitly during our one unload event.
                if ("unload" == event && args !== this) {
                    this._checkUnloadListeners();
                    unloadListeners[unloadListeners.length] = li;
                    return true;
                }

                var index = listeners.length;
                // cache the listener so we can try to automatically
                // unload
                listeners[index] = li;

                try {
                    this._simpleAdd(element, event, wrappedCallback, useCapture);
                } catch (ex) {
                    this.$logError(this.INVALID_TARGET, [element, event], ex);
                    // Clean up the cache
                    this.removeListener(element, event, callback);
                    return false;
                }

                return true;
            },

            /**
             * We want to be able to use getElementsByTagName as a collection to attach a group of events to.
             * Unfortunately, different browsers return different types of collections. This function tests to determine
             * if the object is array-like. It will also fail if the object is an array, but is empty.
             * @param {Object} o the object to test
             * @return {Boolean} true if the object is array-like and populated
             * @protected
             */
            _isValidCollection : function (o) {
                try {
                    return (o && // o is something
                            typeof o !== "string" && // o is not a string
                            o.length && // o is indexed
                            !o.tagName && // o is not an HTML element
                            !o.alert && // o is not a window
                    typeof o[0] !== "undefined");
                } catch (ex) {
                    return false;
                }

            },

            /**
             * Finds the event in the window object, the caller's arguments, or in the arguments of another method in
             * the callstack. This is executed automatically for events registered through the event manager, so the
             * implementer should not normally need to execute this function at all.
             * @param {Object} e the event parameter from the handler
             * @param {HTMLElement} boundElement the element the listener is attached to
             * @return {Object} the event
             */
            getEvent : function (e, boundElement) {
                var ev = e || Aria.$window.event;

                if (!ev) {
                    var Event = Aria.$window.Event;
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c["arguments"][0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }

                return ev;
            },

            /**
             * Checks to see if the type requested is a special type (as defined by the _specialTypes hash), and (if so)
             * returns the special type name.
             * @param {String} type The type to look up
             * @protected
             */
            _getType : function (type) {
                return this._specialTypes[type] || type;
            },

            /**
             * Map of special event types
             * @protected
             */
            _specialTypes : {
                focusin : (aria.core.Browser.isIE ? "focusin" : "focus"),
                focusout : (aria.core.Browser.isIE ? "focusout" : "blur")
            },

            /**
             * Removes an event listener
             * @param {String|HTMLElement|Array} element An id, an element reference, or a collection of ids and/or
             * elements to remove the listener from.
             * @param {String} event the type of event to remove.
             * @param {aria.utils.Callback|Object} callback The method the event invokes, if callback is undefined, then
             * all event handlers for the type of event are removed.
             * @return {Boolean} true if the unbind was successful, false otherwise.
             */
            removeListener : function (element, event, callback) {
                var i, len, li;

                if ('mousewheel' == event) {
                    if (this.UA.isIE) {
                        if (element == Aria.$window) {
                            element = element.document;
                        }
                    } else if (!(this.UA.isOpera || this.UA.isSafari)) {
                        event = 'DOMMouseScroll';
                    }
                }

                event = this._getType(event);

                // The element argument can be a string
                if (this.typesUtil.isString(element)) {
                    element = this.getElement(element);
                    if (!element) {
                        return false;
                    }
                } else if (this._isValidCollection(element)) {
                    var ok = true;
                    for (i = element.length - 1; i > -1; i--) {
                        ok = (this.removeListener(element[i], event, callback) && ok);
                    }
                    return ok;
                }

                if (!callback || !(callback.call || callback.fn)) {
                    // return false;
                    return this.purgeElement(element, false, event);
                }

                if ("unload" == event) {
                    if (unloadListeners) {
                        for (i = unloadListeners.length - 1; i > -1; i--) {
                            li = unloadListeners[i];
                            var cbCheck;
                            if (li && aria.utils.Type.isObject(li[FN]) && !li[FN].$Callback) {
                                cbCheck = ("fn" in callback) && (li[FN].fn == callback.fn);
                            } else {
                                cbCheck = (li[FN] == callback);
                            }
                            if (li && li[0] == element && li[1] == event && cbCheck) {
                                if (li[FN] != li[CB]) {
                                    li[CB].$dispose();
                                }
                                li[CLEANCB]();
                                delete li[CLEANCB];
                                unloadListeners.splice(i, 1);
                                // unloadListeners[i]=null;
                                return true;
                            }
                        }
                    }

                    return false;
                }

                var cacheItem = null;

                // The index is a hidden parameter; needed to remove it
                // from
                // the method signature because it was tempting users to
                // try and take advantage of it, which is not possible.
                var index = arguments[3];

                if ("undefined" === typeof index) {
                    index = this._getCacheIndex(listeners, element, event, callback);
                }

                if (index >= 0) {
                    cacheItem = listeners[index];
                }

                if (!element || !cacheItem) {
                    return false;
                }

                var bCapture = cacheItem[CAPTURE] === true ? true : false;

                try {
                    this._simpleRemove(element, event, cacheItem[WFN], bCapture);
                } catch (ex) {
                    lastError = ex;
                    return false;
                }

                // removed the wrapped handler
                delete listeners[index][WFN];
                if (listeners[index][FN] != listeners[index][CB]) {
                    listeners[index][CB].$dispose();
                }
                listeners[index][CLEANCB]();
                delete listeners[index][CLEANCB];

                // delete listeners[index][this.callback];
                listeners.splice(index, 1);

                return true;

            },

            /**
             * We cache elements bound by id because when the unload event fires, we can no longer use
             * document.getElementById
             * @protected
             * @deprecated Elements are not cached any longer
             */
            getElement : function (id) {
                return (typeof id === "string") ? Aria.$window.document.getElementById(id) : id;
            },

            /**
             * Locating the saved event handler data by function ref
             * @protected
             */
            _getCacheIndex : function (a, element, event, callback) {
                var cbCheck;
                for (var i = 0, l = a.length; i < l; i = i + 1) {
                    var li = a[i];
                    if (li && this.typesUtil.isObject(li[FN]) && !li[FN].$Callback) {
                        cbCheck = ("fn" in callback) && (li[FN].fn == callback.fn);
                    } else {
                        cbCheck = (li[FN] == callback);
                    }
                    if (li && cbCheck && li[EL] == element && li[TYPE] == event) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * Basic remove listener
             * @param {HTMLElement} element the element to bind the handler to
             * @param {String} event the type of event handler
             * @param {Function} callback the callback to invoke
             * @param {Boolean} capture capture or bubble phase
             * @protected
             */
            _simpleRemove : function () {
                if (Aria.$window) {
                    if (Aria.$window.removeEventListener) {
                        return function (element, event, callback, capture) {
                            element.removeEventListener(event, callback, (capture));
                        };
                    } else if (Aria.$window.detachEvent) {
                        return function (element, event, callback) {
                            element.detachEvent("on" + event, callback);
                        };
                    }
                }
                return function () {};
            }(),

            /**
             * Removes all listeners attached to the given element via addListener. Optionally, the node's children can
             * also be purged. Optionally, you can specify a specific type of event to remove.
             * @param {HTMLElement} element the element to purge
             * @param {Boolean} recurse recursively purge this element's children as well. Use with caution.
             * @param {String} event optional type of listener to purge. If left out, all listeners will be removed
             */
            purgeElement : function (element, recurse, event) {
                var oElement = (this.typesUtil.isString(element)) ? this.getElement(element) : element;
                var elementListeners = this.getListeners(oElement, event), i, len;
                if (elementListeners) {
                    for (i = elementListeners.length - 1; i > -1; i--) {
                        var l = elementListeners[i];
                        this.removeListener(oElement, l.type, l.fn);
                    }
                }
                if (recurse && oElement && oElement.childNodes) {
                    for (i = 0, len = oElement.childNodes.length; i < len; ++i) {
                        this.purgeElement(oElement.childNodes[i], recurse, event);
                    }
                }
            },

            /**
             * Returns all listeners attached to the given element via addListener. Optionally, you can specify a
             * specific type of event to return.
             * @param {HTMLElement|String} element the element or element id to inspect
             * @param {String} event optional type of listener to return. If left out, all listeners will be returned
             * @return {Object} the listener. Contains the following fields:
             *
             * <pre>
             * {
             *         type: {String} the type of event
             *         fn: {Function} the callback supplied to addListener
             *         obj: {Object} the custom object supplied to addListener
             *         adjust: {Boolean|Object} whether or not to adjust the default context
             *         scope: {Boolean} the derived context based on the adjust parameter
             *         index: {Number} its position in the Event util listener cache
             * }
             * </pre>
             */
            getListeners : function (element, event) {
                var results = [], searchLists;
                if (!event) {
                    searchLists = [listeners, unloadListeners];
                } else if (event === "unload") {
                    searchLists = [unloadListeners];
                } else {
                    event = this._getType(event);
                    searchLists = [listeners];
                }

                var oElement = (this.typesUtil.isString(element)) ? this.getElement(element) : element;

                for (var j = 0; j < searchLists.length; j = j + 1) {
                    var searchList = searchLists[j];
                    if (searchList) {
                        for (var i = 0, len = searchList.length; i < len; ++i) {
                            var l = searchList[i];
                            if (l && l[EL] === oElement && (!event || event === l[TYPE])) {
                                results.push({
                                    type : l[TYPE],
                                    fn : l[FN],
                                    index : i
                                });
                            }
                        }
                    }
                }

                return (results.length) ? results : null;
            }

        }
    });
})();

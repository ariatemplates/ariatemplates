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
var ariaUtilsEvent = require("./Event");
var ariaDomEvent = require("../DomEvent");
var ariaUtilsIdManager = require("./IdMgr");
var ariaUtilsCallback = require("./Callback");
require("./Array");
var ariaCoreBrowser = require("../core/Browser");
var ariaUtilsAriaWindow = require("./AriaWindow");


/**
 * Contains a reference to elements ready for event delegation, and manage delegation
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.Delegate",
    $singleton : true,
    $events : {
        "elementFocused" : {
            description : "notifies that an element defined inside Aria Templates has received focus",
            properties : {
                focusedElement : "{HTMLElement} element that has received the focus"
            }
        },
        "elementBlurred" : {
            description : "notifies that an element defined inside Aria Templates has lost focus",
            properties : {
                blurredElement : "{HTMLElement} element that has lost the focus"
            }
        }
    },
    $constructor : function () {

        /**
         * This variable is set to true on IE 7 and 8 when the focused element was just removed from the DOM.
         * @type Boolean
         */
        this._focusedElementRemoved = false;

        /**
         * Number of level up to look delegated element. -1 will go to the top.
         * @type Number
         */
        this.depth = -1;

        /**
         * Checks for the CSS Prefixes for compliant browsers
         * @return {String} CSS prefix
         */
        this.checkCSSPrefix = function () {
            // In non-browser environment document might be null
            if (Aria.$window && Aria.$window.document) {
                var div = Aria.$window.document.createElement("div");
                var prefixes = ["ms", "O", "Webkit", "Moz", ""];
                for (var i = 0; i < prefixes.length; i += 1) {
                    var prefix = prefixes[i];
                    if (div.style[prefix + "Transition"] !== undefined) {
                        return prefix;
                    }
                }
            }
            return null;
        };

        /**
         * Delegated events on body.
         * @type Array
         */
        this.delegatedOnBody = ["click", "focus", "blur", "focusin", "focusout", "mousedown", "mouseup", "mousemove",
                "mouseover", "mouseout", "contextmenu", "touchstart", "touchend", "touchmove", "mousewheel", "dblclick"];

        /**
         * Current CSS Prefix for Browser Engine
         * @type String
         */
        this.vendorPrefix = this.checkCSSPrefix();

        // Adding Event Handlers for Moz and Standard compliant browsers
        if (this.vendorPrefix !== null) {
            this.delegatedOnBody.push("transitionend", "animationstart", "animationiteration", "animationend");
        }

        // Mappings for Browser Compliancy
        if (this.vendorPrefix === "O") {
            this.delegatedOnBody.push("oanimationstart", "oanimationiteration", "oanimationend", "otransitionEnd");
        }
        if (this.vendorPrefix === "ms") {
            this.delegatedOnBody.push("MSAnimationStart", "MSAnimationIteration", "MSAnimationEnd", "MSTransitionEnd");
        }

        if (this.vendorPrefix === "Webkit") {
            this.delegatedOnBody.push("webkitAnimationIteration", "webkitAnimationEnd", "webkitAnimationStart", "webkitTransitionEnd");
        }

        /**
         * Delegated events on window. Only on Firefox 3, if focus is not on an element, event are not caught by the
         * body but the window.
         * @type Array
         */
        this.delegatedOnWindow = [];

        var elemDelegationArray = (ariaCoreBrowser.isFirefox && ariaCoreBrowser.majorVersion == 3)? this.delegatedOnWindow : this.delegatedOnBody;
        elemDelegationArray.push("keydown", "keyup", "keypress");

        /**
         * Map of delegated events for gestures and their class paths.
         * @type Object
         */
        this.delegatedGestures = {
            "safetap" : "aria.touch.SafeTap",
            "safetapstart" : "aria.touch.SafeTap",
            "safetapcancel" : "aria.touch.SafeTap",
            "tap" : "aria.touch.Tap",
            "tapstart" : "aria.touch.Tap",
            "tapcancel" : "aria.touch.Tap",
            "singletap" : "aria.touch.SingleTap",
            "singletapstart" : "aria.touch.SingleTap",
            "singletapcancel" : "aria.touch.SingleTap",
            "doubletap" : "aria.touch.DoubleTap",
            "doubletapstart" : "aria.touch.DoubleTap",
            "doubletapcancel" : "aria.touch.DoubleTap",
            "longpress" : "aria.touch.LongPress",
            "longpressstart" : "aria.touch.LongPress",
            "longpresscancel" : "aria.touch.LongPress",
            "dragstart" : "aria.touch.Drag",
            "dragmove" : "aria.touch.Drag",
            "drag" : "aria.touch.Drag",
            "dragcancel" : "aria.touch.Drag",
            "swipe" : "aria.touch.Swipe",
            "swipestart" : "aria.touch.Swipe",
            "swipemove" : "aria.touch.Swipe",
            "swipecancel" : "aria.touch.Swipe",
            "pinch" : "aria.touch.Pinch",
            "pinchstart" : "aria.touch.Pinch",
            "pinchmove" : "aria.touch.Pinch",
            "pinchcancel" : "aria.touch.Pinch"
        };

        /**
         * Root element on which event are listened for the delegatedOnWindow. In IE, the listener needs to be added to
         * the body instead
         * @type HTMLElement
         */
        this.rootListener = null;

        /**
         * Events supported with or without delegation. Any other event should be considered as an error.
         * @type Object
         */
        this.supportedEvents = {
            dblclick : true,
            mouseleave : true,
            mouseenter : true,
            copy : true,
            change : true,
            paste : true,
            cut : true,
            submit : true,
            error : true,
            mousewheel : true,
            scroll : true
        };

        // note that the change event does not bubble on all browsers (e.g.: on IE) but is necessary as it is the only
        // event which is raised when clicking on an option in the select in other browsers (Chrome)
        if (!ariaCoreBrowser.isOldIE) {
            this.delegatedOnBody.push("change", "paste", "cut");
        }

        /**
         * Internal hash map of delegated events. Based on the delegated array, but used to speed up isDelegated
         * @private
         * @type Object
         */
        this._delegatedMap = {};
        var index, l;
        for (index = 0, l = this.delegatedOnBody.length; index < l; index++) {
            var eventName = this.delegatedOnBody[index];
            this._delegatedMap[eventName] = true;
        }
        for (index = 0, l = this.delegatedOnWindow.length; index < l; index++) {
            var eventName = this.delegatedOnWindow[index];
            this._delegatedMap[eventName] = true;
        }
        for (var key in this.delegatedGestures) {
            if (this.delegatedGestures.hasOwnProperty(key)) {
                this._delegatedMap[key] = true;
            }
        }

        // supported through delegation
        for (var key in this._delegatedMap) {
            if (this._delegatedMap.hasOwnProperty(key)) {
                this.supportedEvents[key] = true;
            }
        }

        /**
         * Name of the expando used for event delegation
         * @type String
         */
        this.delegateExpando = "atdelegate";

        /**
         * Map of mapping for event delegation, between an expando and a handler.
         * @private
         * @type Object
         */
        this.__delegateMapping = null;

        /**
         * Unique id manager
         * @private
         * @type aria.utils.IdMgr
         */
        this.__idMgr = new ariaUtilsIdManager("d");

        /**
         * This cache store the dom hierarchy for a start id. It is clean on each add/remove.
         * @private
         * @type Object
         */
        this.__stackCache = null;

        /**
         * List of id removed while executing callback
         * @protected
         * @type Array
         */
        this._changed = null;

        /**
         * Pointer for focus tracking. Updated on any focus and blur event
         * @type HTMLElement
         */
        this._focusTracking = null;

        ariaUtilsAriaWindow.$on({
            "unloadWindow" : this.reset,
            scope : this
        });
    },
    $destructor : function () {
        this.reset(); // must be called before __idMgr is disposed

        this.__idMgr.$dispose();
        this.__idMgr = null;

        ariaUtilsAriaWindow.$unregisterListeners(this);
    },
    $statics : {
        DELEGATE_UTIL_CALLBACK_FAIL : "Error caught in callback for event %1"
    },
    $prototype : {

        /**
         * Remove all event delegation listeners, and make sure we don't store any references to DOM elements.
         */
        reset : function () {
            this.cleanCache();

            var mapping = this.__delegateMapping;
            if (mapping) {

                for (var id in mapping) {
                    if (mapping.hasOwnProperty(id)) {
                        this.remove(id);
                    }
                }

                var body = Aria.$window.document.body;
                var utilEvent = ariaUtilsEvent, index, l;
                for (index = 0, l = this.delegatedOnBody.length; index < l; index++) {
                    utilEvent.removeListener(body, this.delegatedOnBody[index], {
                        fn : this.delegate
                    });
                }
                for (index = 0, l = this.delegatedOnWindow.length; index < l; index++) {
                    utilEvent.removeListener(this.rootListener, this.delegatedOnWindow[index], {
                        fn : this.delegate
                    });
                }
                this.__delegateMapping = null;

                // do this after removing listeners as we need it to remove listeners:
                this.rootListener = null;

                // nullify dom reference
                this._focusTracking = null;

                ariaUtilsAriaWindow.detachWindow();
            }
        },

        /**
         * Check that event name is delegated. If not, raises an error.
         * @param {String} eventName
         * @return {Boolean}
         */
        isDelegated : function (eventName) {
            return this._delegatedMap[eventName];
        },

        /**
         * Plug event listener to be able to listen to delegated events
         * @param {aria.core.CfgBeans:Callback} handler
         * @return {String} id for delegation.
         */
        add : function (handler) {
            this.cleanCache();

            // initialization of delegation manager
            if (!this.__delegateMapping) {
                ariaUtilsAriaWindow.attachWindow();

                var body = Aria.$window.document.body;
                this.rootListener = ariaCoreBrowser.isOldIE ? body : Aria.$window;
                this.__delegateMapping = {};
                var utilEvent = ariaUtilsEvent, index, l;
                for (index = 0, l = this.delegatedOnBody.length; index < l; index++) {
                    utilEvent.addListener(body, this.delegatedOnBody[index], {
                        fn : this.delegate,
                        scope : this
                    });
                }
                for (index = 0, l = this.delegatedOnWindow.length; index < l; index++) {
                    utilEvent.addListener(this.rootListener, this.delegatedOnWindow[index], {
                        fn : this.delegate,
                        scope : this
                    });
                }
            }
            var id = this.__idMgr.getId();
            while (this._changed && this._changed[id]) {
                this._changed[id] = false;
                id = this.__idMgr.getId();
            }
            this.__delegateMapping[id] = new ariaUtilsCallback(handler);
            return id;
        },

        /**
         * Returns markup to insert in a tag to activate event delegation
         * @param {String} id
         */
        getMarkup : function (id) {
            var output = this.delegateExpando + "='" + id + "'";

            // for iOS, see: https://developer.apple.com/library/IOS/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW3
            if (ariaCoreBrowser.isIOS) {
                output += " onclick='void(0)'";
            }

            return output;
        },

        /**
         * Add the delegate expando on an existing dom element
         * @param {HTMLElement} domElt
         * @param {string} id
         */
        addExpando : function (domElt, id) {
            domElt.setAttribute(this.delegateExpando, id);

            // for iOS, refer to method getMarkup
            if (ariaCoreBrowser.isIOS) {
                if (domElt.onclick == null) {
                    domElt.onclick = Aria.empty;
                }
            }
        },

        /**
         * Generate classic "onsomething" markup for event not supported by delegation
         * @param {String} eventName
         * @param {String} callback id
         * @param {Boolean} wrapTarget, if true, wrap target into DOMWrapper
         * @method
         * @return {String}
         */
        getFallbackMarkup : function (eventName, delegateId, wrapTarget) {
            if (ariaCoreBrowser.isOldIE) {
                this.getFallbackMarkup = function (eventName, delegateId, wrapTarget) {
                    wrapTarget = wrapTarget ? "true" : "false";
                    return " on" + eventName + "=\"aria.utils.Delegate.directCall(event, '" + delegateId + "', "
                            + wrapTarget + ", this)\"";
                };
            } else {
                this.getFallbackMarkup = function (eventName, delegateId, wrapTarget) {
                    var calledFunction = "directCall";
                    wrapTarget = wrapTarget ? "true" : "false";

                    if ('mouseleave' == eventName || 'mouseenter' == eventName) {
                        // Mouseleave/enter exists only in IE, we can emulate them in all other browsers
                        eventName = 'mouseleave' == eventName ? 'mouseout' : 'mouseover';
                        calledFunction = "mouseMovement";
                    }

                    return " on" + eventName + "=\"aria.utils.Delegate." + calledFunction + "(event, '" + delegateId
                            + "', " + wrapTarget + ", this)\"";
                };
            }
            return this.getFallbackMarkup(eventName, delegateId, wrapTarget);
        },

        /**
         * Wrap a standard HTMLElement inside a DomEvent or DomEventWrapper
         * @param {HTMLEvent} event Event to wrap
         * @param {Boolean} templatesWrapper True to wrap an aria.templates.DomEventWrapper, False for aria.DomEvent
         * @return {aria.DomEvent}
         */
        __wrapEvent : function (event, templatesWrapper) {
            if (event.$DomEvent) {
                // It's already wrapped
                return event;
            } else {
                return templatesWrapper ? new aria.templates.DomEventWrapper(event) : new ariaDomEvent(event);
            }
        },

        /**
         * Entry point for event that were not delegated
         * @param {HTMLEvent} event HTML Event
         * @param {String} delegateId Id of the delegated callback
         * @param {Boolean} wrapTarget, if true, wrap target into DomEventWrapper
         * @param {HTMLElement} container HTML Element on which the listener is attached
         * @return {Object} Return value of the callback
         */
        directCall : function (event, delegateId, wrapTarget, container) {
            this.$assert(286, this.__delegateMapping);
            var eventWrapper = this.__wrapEvent(event, wrapTarget), result;
            var callback = this.__delegateMapping[delegateId];
            if (callback) {
                result = callback.call(eventWrapper);
            }
            eventWrapper.$dispose();
            return result;
        },

        /**
         * Entry point for mouseenter/leave events that were not delegated
         * @param {HTMLEvent} event HTML Event
         * @param {String} delegateId Id of the delegated callback
         * @param {Boolean} wrapTarget, if true, wrap target into DomEventWrapper
         * @param {HTMLElement} container HTML Element on which the listener is attached
         * @return {Object} Return value of the callback
         */
        mouseMovement : function (event, delegateId, wrapTarget, container) {
            // Fire the event only if we move to an element outside the container
            if (aria.utils.Dom.isAncestor(event.relatedTarget, container) === false) {
                var eventWrapper = this.__wrapEvent(event, wrapTarget);
                eventWrapper.type = event.type == "mouseover" ? "mouseenter" : "mouseleave";
                eventWrapper.setTarget(container);
                return this.directCall(eventWrapper, delegateId, wrapTarget, container);
            }
        },

        /**
         * Remove delegation for a given id.
         * @param {String} id Mapping ID
         */
        remove : function (id) {
            this.cleanCache();

            // store id to identify changes during callback execution
            if (this._changed) {
                this._changed[id] = true;
            }

            if (this.__delegateMapping) {
                this.__delegateMapping[id].$dispose();
                delete this.__delegateMapping[id];
                this.__idMgr.releaseId(id);
            }
        },

        /**
         * Delegate a dom event. Also delegate aria.DomEvent instances
         * @param {Object} evt
         */
        delegate : function (evt) {
            if (!this.__delegateMapping) {
                // there is no event listener
                if (evt.$DomEvent) {
                    evt.$dispose();
                }
                return;
            }

            if (!this.__stackCache) {
                this.__stackCache = {};
            }

            var depth = this.depth, stack = [], cacheStack, expandoValue, target;
            var stopper = Aria.$window.document.body;

            evt = this.__wrapEvent(evt);

            // Retrieve DOM corresponding to a widget
            target = evt.target;

            // flag to distinguish elements defined through aria templates
            var ATflag = false; // stays false if the target has not been generated with AT

            // retrieve dom that might contain delegation
            while (depth && target && target != stopper) {
                if (target.attributes) {
                    expandoValue = target.attributes[this.delegateExpando];
                    if (expandoValue) {
                        ATflag = true;
                        expandoValue = expandoValue.value;
                        cacheStack = this.__stackCache[expandoValue];

                        // search the cache for existing hierachy
                        if (cacheStack) {
                            // find value -> merge with existing hierarchy
                            stack = stack.concat(cacheStack);
                            break;
                        } else {
                            stack.push({
                                expandoValue : expandoValue,
                                target : target
                            });
                        }
                    }
                }
                target = target.parentNode;
                depth--;
            }

            var callback, delegateConfig;

            // will be used to track changes
            var nested = false;
            if (this._changed) {
                nested = true;
            } else {
                this._changed = {};
            }

            for (var i = 0, l = stack.length; i < l; i++) {
                delegateConfig = stack[i];
                expandoValue = delegateConfig.expandoValue;
                target = delegateConfig.target;

                // store hierarchy in cache : index 0 is the start point
                if (i === 0) {
                    this.__stackCache[expandoValue] = stack;
                }

                // if this id has been removed, don't proceed this callback
                if (this._changed[expandoValue]) {
                    continue;
                }

                // retrieve callback (cost nearly nothing, even in big objects)
                callback = this.__delegateMapping[expandoValue];

                evt.delegateTarget = target;

                // only stop bubbling if callback returned false -> strict equal
                // Callback might be null has a sub delegation might have destroyed it
                var result;
                if (callback) {
                    try {
                        result = callback.call(evt);
                    } catch (e) {
                        this.$logError(this.DELEGATE_UTIL_CALLBACK_FAIL, [evt.type], e);
                    }
                }

                // return false or hasStopPropagation stop bubbling
                if (result === false || evt.hasStopPropagation) {
                    break;
                }

                target = null;
            }

            if (!nested) {
                this._changed = null;
            }

            if (result !== false && !evt.hasStopPropagation && aria.templates) {
                // handle global navigation
                var navManager = aria.templates.NavigationManager;
                if (navManager) {
                    navManager.handleGlobalNavigation(evt);
                }
            }

            // focus tracking
            if (evt.type == "focus") {
                this._focusedElementRemoved = false;
                this._focusTracking = evt.target;
                if (this._focusTracking && ATflag) {

                    this.$raiseEvent({
                        name : "elementFocused",
                        focusedElement : this._focusTracking
                    });
                }
            } else if (evt.type == "blur") {

                if (ATflag) {
                    this.$raiseEvent({
                        name : "elementBlurred",
                        blurredElement : this._focusTracking
                    });
                }
                this._focusTracking = null;
            }

            // dispose event
            evt.$dispose();

        },

        /**
         * Clean delegate hierachy cache
         */
        cleanCache : function () {
            if (this.__stackCache) {
                for (var key in this.__stackCache) {
                    if (this.__stackCache.hasOwnProperty(key)) {
                        var stack = this.__stackCache[key];
                        // break dom reference
                        for (var i = 0, l = stack.length; i < l; i++) {
                            stack.target = null;
                            stack.expandoValue = null;
                            delete stack.target;
                            delete stack.expandoValue;
                        }
                        delete this.__stackCache[i];
                    }
                }
                this.__stackCache = null;
            }
        },

        /**
         * Returns current focus element, or null if none or focused on the document body
         * @return {HTMLElement} focues element
         */
        getFocus : function () {
            return this._focusTracking;
        },

        /**
         * This method is intended to be called before focusing any DOM element to apply a work-around for an issue on
         * IE 7 and 8. It gives the focus to document.body if the last focused element was removed from the DOM.<br>
         * If the work-around is not applied, on IE 7 and 8, after removing from the DOM a focused element, the next
         * call to the focus method on a DOM element does not work correctly.
         */
        ieFocusFix : function () {
            if (this._focusedElementRemoved) {
                Aria.$window.document.body.focus();
                this._focusedElementRemoved = false;
            }
        },

        /**
         * This method is intended to be called only on IE 7 and 8 in order notify this class that a focused element was
         * removed from the DOM. Then, the next time the ieFocusFix method is called, a work-around is applied (which is
         * to give the focus to document.body). This method is automatically called from aria.utils.Dom.replaceHTML when
         * it is needed, so in most cases, there is no need to call it directly.
         */
        ieRemovingFocusedElement : function () {
            this._focusedElementRemoved = true;
        }
    }
});

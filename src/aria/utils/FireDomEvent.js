/* jshint maxparams:false */
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
     * Synthetic DOM events
     */

    var typeUtils; // shortcut
    var fireDomEvent;
    var // mouse events supported
    events = {
        click : 1,
        dblclick : 1,
        mouseover : 1,
        mouseout : 1,
        mousedown : 1,
        mouseup : 1,
        mousemove : 1,
        touchstart : 1,
        touchend : 1,
        touchmove : 1,
        dommousescroll : 1,
        mousewheel : 1,
        MSPointerDown : 1,
        MSPointerMove : 1,
        MSPointerUp : 1
    },

    // key events supported
    keyEvents = {
        keydown : 1,
        keyup : 1,
        keypress : 1
    },

    htmlEvents = {
        focus : 1,
        blur : 1,
        change : 1
    };

    /*
     * Note: Intentionally not for YUIDoc generation. Simulates a key event using the given event information to
     * populate the generated event object. This method does browser-equalizing calculations to account for differences
     * in the DOM and IE event models as well as different browser quirks. Note: keydown causes Safari 2.x to crash.
     * @method simulateKeyEvent @private @static @param {HTMLElement} target The target of the given event. @param
     * {String} type The type of event to fire. This can be any one of the following: keyup, keydown, and keypress.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be bubbled up. DOM Level 3 specifies that all key
     * events bubble by default. The default is true. @param {Boolean} cancelable (Optional) Indicates if the event can
     * be canceled using preventDefault(). DOM Level 3 specifies that all key events can be cancelled. The default is
     * true. @param {Window} view (Optional) The view containing the target. This is typically the window object. The
     * default is window. @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys is pressed while the
     * event is firing. The default is false. @param {Boolean} altKey (Optional) Indicates if one of the ALT keys is
     * pressed while the event is firing. The default is false. @param {Boolean} shiftKey (Optional) Indicates if one of
     * the SHIFT keys is pressed while the event is firing. The default is false. @param {Boolean} metaKey (Optional)
     * Indicates if one of the META keys is pressed while the event is firing. The default is false. @param {int}
     * keyCode (Optional) The code for the key that is in use. The default is 0. @param {int} charCode (Optional) The
     * Unicode code for the character associated with the key being used. The default is 0.
     */
    function simulateKeyEvent (target /* :HTMLElement */, type /* :String */, bubbles /* :Boolean */,
            cancelable /* :Boolean */, view /* :Window */, ctrlKey /* :Boolean */, altKey /* :Boolean */,
            shiftKey /* :Boolean */, metaKey /* :Boolean */, keyCode /* :int */, charCode /* :int */) /* :Void */
    {
        var document = Aria.$window.document;

        // check target
        if (!target) {
            fireDomEvent.$logError("simulateKeyEvent(): Invalid target.");
        }

        // check event type
        if (typeUtils.isString(type)) {
            type = type.toLowerCase();
            switch (type) {
                case "textevent" : // DOM Level 3
                    type = "keypress";
                    break;
                case "keyup" :
                case "keydown" :
                case "keypress" :
                    break;
                default :
                    fireDomEvent.$logError("simulateKeyEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            fireDomEvent.$logError("simulateKeyEvent(): Event type must be a string.");
        }

        // setup default values
        if (!typeUtils.isBoolean(bubbles)) {
            bubbles = true; // all key events bubble
        }
        if (!typeUtils.isBoolean(cancelable)) {
            cancelable = true; // all key events can be cancelled
        }
        if (!typeUtils.isObject(view)) {
            view = Aria.$window; // view is typically window
        }
        if (!typeUtils.isBoolean(ctrlKey)) {
            ctrlKey = false;
        }
        if (!typeUtils.isBoolean(altKey)) {
            altKey = false;
        }
        if (!typeUtils.isBoolean(shiftKey)) {
            shiftKey = false;
        }
        if (!typeUtils.isBoolean(metaKey)) {
            metaKey = false;
        }
        if (!typeUtils.isNumber(keyCode)) {
            keyCode = 0;
        }
        if (!typeUtils.isNumber(charCode)) {
            charCode = 0;
        }

        // try to create an event
        var customEvent /* :Event */= null;

        // check for DOM-compliant browsers first
        if (typeUtils.isFunction(document.createEvent)) {

            try {

                // try to create key event
                customEvent = document.createEvent("KeyEvents");

                /*
                 * Interesting problem: Firefox implemented a non-standard version of initKeyEvent() based on DOM Level
                 * 2 specs. Key event was removed from DOM Level 2 and re-introduced in DOM Level 3 with a different
                 * interface. Firefox is the only browser with any implementation of Key Events, so for now, assume it's
                 * Firefox if the above line doesn't error.
                 */
                // @TODO: Decipher between Firefox's implementation and a correct one.
                customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode);

            } catch (ex /* :Error */) {

                /*
                 * If it got here, that means key events aren't officially supported. Safari/WebKit is a real problem
                 * now. WebKit 522 won't let you set keyCode, charCode, or other properties if you use a UIEvent, so we
                 * first must try to create a generic event. The fun part is that this will throw an error on Safari
                 * 2.x. The end result is that we need another try...catch statement just to deal with this mess.
                 */
                try {

                    // try to create generic event - will fail in Safari 2.x
                    customEvent = document.createEvent("Events");

                } catch (uierror /* :Error */) {

                    // the above failed, so create a UIEvent for Safari 2.x
                    customEvent = document.createEvent("UIEvents");

                } finally {

                    customEvent.initEvent(type, bubbles, cancelable);

                    // initialize
                    customEvent.view = view;
                    customEvent.altKey = altKey;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    customEvent.keyCode = keyCode;
                    customEvent.charCode = charCode;

                }

            }

            // fire the event
            target.dispatchEvent(customEvent);

        } else if (typeUtils.isObject(document.createEventObject)) { // IE

            // create an IE event object
            customEvent = document.createEventObject();

            // assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.shiftKey = shiftKey;
            customEvent.metaKey = metaKey;

            /*
             * IE doesn't support charCode explicitly. CharCode should take precedence over any keyCode value for
             * accurate representation.
             */
            customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

            // fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            fireDomEvent.$logError("simulateKeyEvent(): No event simulation framework present.");
        }
    }

    /*
     * Note: Intentionally not for YUIDoc generation. Simulates a mouse or touch event using the given event information
     * to populate the generated event object. This method does browser-equalizing calculations to account for
     * differences in the DOM and IE event models as well as different browser quirks. @method simulateEvent @private
     * @static @param {HTMLElement} target The target of the given event. @param {String} type The type of event to
     * fire. This can be any one of the following: click, dblclick, mousedown, mouseup, mouseout, mouseover, and
     * mousemove, touchstart, touchend, touchmove. @param {Boolean} bubbles (Optional) Indicates if the event can be
     * bubbled up. DOM Level 2 specifies that all mouse and touch events bubble by default. The default is true. @param
     * {Boolean} cancelable (Optional) Indicates if the event can be canceled using preventDefault(). DOM Level 2
     * specifies that all mouse events except mousemove can be cancelled. The default is true for all events except
     * mousemove, for which the default is false. @param {Window} view (Optional) The view containing the target. This
     * is typically the window object. The default is window. @param {int} detail (Optional) The number of times the
     * mouse button has been used. The default value is 1. @param {int} screenX (Optional) The x-coordinate on the
     * screen at which point the event occured. The default is 0. @param {int} screenY (Optional) The y-coordinate on
     * the screen at which point the event occured. The default is 0. @param {int} clientX (Optional) The x-coordinate
     * on the client at which point the event occured. The default is 0. @param {int} clientY (Optional) The
     * y-coordinate on the client at which point the event occured. The default is 0. @param {Boolean} ctrlKey
     * (Optional) Indicates if one of the CTRL keys is pressed while the event is firing. The default is false. @param
     * {Boolean} altKey (Optional) Indicates if one of the ALT keys is pressed while the event is firing. The default is
     * false. @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys is pressed while the event is
     * firing. The default is false. @param {Boolean} metaKey (Optional) Indicates if one of the META keys is pressed
     * while the event is firing. The default is false. @param {int} button (Optional) The button being pressed while
     * the event is executing. The value should be 0 for the primary mouse button (typically the left button), 1 for the
     * terciary mouse button (typically the middle button), and 2 for the secondary mouse button (typically the right
     * button). The default is 0. @param {HTMLElement} relatedTarget (Optional) For mouseout events, this is the element
     * that the mouse has moved to. For mouseover events, this is the element that the mouse has moved from. This
     * argument is ignored for all other events. The default is null.
     */
    function simulateEvent (target /* :HTMLElement */, type /* :String */, bubbles /* :Boolean */,
            cancelable /* :Boolean */, view /* :Window */, detail /* :int */, screenX /* :int */,
            screenY /* :int */, clientX /* :int */, clientY /* :int */, ctrlKey /* :Boolean */,
            altKey /* :Boolean */, shiftKey /* :Boolean */, metaKey /* :Boolean */, button /* :int */,
            relatedTarget /* :HTMLElement */, touches /* :Array */, changedTouches /*: Array */, isPrimary /* :Boolean */) /* :Void */
    {
        var document = Aria.$window.document;

        // check target
        if (!target) {
            fireDomEvent.$logError("simulateEvent(): Invalid target.");
        }

        // check event type
        if (typeUtils.isString(type)) {
            if (!(/^MSPointer/.test(type))) {
                type = type.toLowerCase();
            }

            // make sure it's a supported event
            if (!events[type]) {
                fireDomEvent.$logError("simulateEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            fireDomEvent.$logError("simulateEvent(): Event type must be a string.");
        }

        // setup default values
        if (!typeUtils.isBoolean(bubbles)) {
            bubbles = true; // all events bubble
        }
        if (!typeUtils.isBoolean(cancelable)) {
            cancelable = (type != "mousemove"); // mousemove is the only one that can't be cancelled
        }
        if (!typeUtils.isObject(view)) {
            view = Aria.$window; // view is typically window
        }
        if (!typeUtils.isNumber(detail)) {
            detail = 1; // number of clicks must be at least one
        }
        if (!typeUtils.isNumber(screenX)) {
            screenX = 0;
        }
        if (!typeUtils.isNumber(screenY)) {
            screenY = 0;
        }
        if (!typeUtils.isNumber(clientX)) {
            clientX = 0;
        }
        if (!typeUtils.isNumber(clientY)) {
            clientY = 0;
        }
        if (!typeUtils.isBoolean(ctrlKey)) {
            ctrlKey = false;
        }
        if (!typeUtils.isBoolean(altKey)) {
            altKey = false;
        }
        if (!typeUtils.isBoolean(shiftKey)) {
            shiftKey = false;
        }
        if (!typeUtils.isBoolean(metaKey)) {
            metaKey = false;
        }
        if (!typeUtils.isNumber(button)) {
            button = 0;
        }
        if (!typeUtils.isArray(touches)) {
            touches = undefined;
        }
        if (!typeUtils.isArray(changedTouches)) {
            changedTouches = undefined;
        }
        if (!typeUtils.isBoolean(isPrimary)) {
            isPrimary = true;
        }

        // try to create a event
        var customEvent /* :Event */= null;

        // check for DOM-compliant browsers first
        if (typeUtils.isFunction(document.createEvent)) {

            customEvent = document.createEvent("MouseEvents");

            // Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (customEvent.initMouseEvent) {
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget
                        || null); // guess what? IE9 doesn't like undefined target
            } else { // Safari

                // the closest thing available in Safari 2.x is UIEvents
                customEvent = document.createEvent("UIEvents");
                customEvent.initEvent(type, bubbles, cancelable);
                customEvent.view = view;
                customEvent.detail = detail;
                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.button = button;
                customEvent.relatedTarget = relatedTarget;
            }
            customEvent.touches = generateTouchList(touches);
            customEvent.changedTouches = generateTouchList(changedTouches);
            customEvent.isPrimary = isPrimary;
            customEvent.pageX = clientX;
            customEvent.pageY = clientY;

            /*
             * Check to see if relatedTarget has been assigned. Firefox versions less than 2.0 don't allow it to be
             * assigned via initMouseEvent() and the property is readonly after event creation, so in order to keep
             * YAHOO.util.getRelatedTarget() working, assign to the IE proprietary toElement property for mouseout event
             * and fromElement property for mouseover event.
             */
            if (relatedTarget && !customEvent.relatedTarget) {
                if (type == "mouseout") {
                    customEvent.toElement = relatedTarget;
                } else if (type == "mouseover") {
                    customEvent.fromElement = relatedTarget;
                }
            }

            // fire the event
            target.dispatchEvent(customEvent);

        } else if (typeUtils.isObject(document.createEventObject)) { // IE

            // create an IE event object
            customEvent = document.createEventObject();

            // assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;
            customEvent.touches = touches;
            customEvent.changedTouches = changedTouches;
            customEvent.isPrimary = isPrimary;

            // fix button property for IE's wacky implementation
            switch (button) {
                case 0 :
                    customEvent.button = 1;
                    break;
                case 1 :
                    customEvent.button = 4;
                    break;
                case 2 :
                    // leave as is
                    break;
                default :
                    customEvent.button = 0;
            }

            /*
             * Have to use relatedTarget because IE won't allow assignment to toElement or fromElement on generic
             * events. This keeps YAHOO.util.customEvent.getRelatedTarget() functional.
             */
            customEvent.relatedTarget = relatedTarget;

            // For PTR 03915410 : Change the state on a checkbox, as using createEventObject do not do the job.
            if (target.checked != null) {
                target.checked = !target.checked;
            }

            // fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            fireDomEvent.$logError("simulateEvent(): No event simulation framework present.");
        }
    }

    /*
     * Simulates an HTMLEvent mouse event using the given event information to populate the generated event object. This
     * method does browser-equalizing calculations to account for differences in the DOM and IE event models as well as
     * different browser quirks. Note: fireEvent on IE only triggers the callback on the target, it does not really
     * gives the focus to the element, nor bubbles. Use target.focus() or .blur() if needed @method simulateHtmlEvent
     * @private @static @param {HTMLElement} target The target of the given event. @param {String} type The type of
     * event to fire. This can be any one of the following: click, dblclick, mousedown, mouseup, mouseout, mouseover,
     * and mousemove.
     */
    function simulateHtmlEvent (target /* :HTMLElement */, type /* :String */) /* :Void */
    {
        var document = Aria.$window.document;

        // check target
        if (!target) {
            fireDomEvent.$logError("simulateHtmlEvent(): Invalid target.");
        }

        // check event type
        if (typeUtils.isString(type)) {
            type = type.toLowerCase();

            // make sure it's a supported mouse event
            if (!htmlEvents[type]) {
                fireDomEvent.$logError("simulateHtmlEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            fireDomEvent.$logError("simulateHtmlEvent(): Event type must be a string.");
        }

        // setup default values
        var bubbles = (type === "change"); // change is the only one that bubbles
        var cancelable = false; // all html events are not cancelable

        // try to create an html event
        var customEvent /* :HtmlEvent */= null;

        // check for DOM-compliant browsers first
        if (typeUtils.isFunction(document.createEvent)) {
            // Create an event
            customEvent = document.createEvent("HTMLEvents");
            customEvent.initEvent(type, bubbles, cancelable);

            // fire the event
            target.dispatchEvent(customEvent);
        } else if (typeUtils.isObject(document.createEventObject)) { // IE

            // create an IE event object
            customEvent = document.createEventObject();

            // assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;

            // fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            fireDomEvent.$logError("simulateHtmlEvent(): No event simulation framework present.");
        }
    }

    /**
     * Simulates the event with the given name on a target.
     * @param {HTMLElement} target The DOM element that's the target of the event.
     * @param {String} type The type of event to simulate (i.e., "click").
     * @param {Object} options (Optional) Extra options to copy onto the event object.
     * @return {void}
     * @method simulate
     * @static
     */
    var simulate = function (target, type, options) {

        options = options || {};

        if (events[type]) {
            simulateEvent(target, type, options.bubbles, options.cancelable, options.view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget, options.touches, options.changedTouches, options.isPrimary);
        } else if (keyEvents[type]) {
            simulateKeyEvent(target, type, options.bubbles, options.cancelable, options.view, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
        } else if (htmlEvents[type]) {
            simulateHtmlEvent(target, type, options.bubbles, options.cancelable);
        } else {
            fireDomEvent.$logError("simulate(): Event '" + type + "' can't be simulated.");
        }
    };

    /**
     * Generate an object that looks like a [TouchList](https://developer.mozilla.org/en-US/docs/Web/API/TouchList)
     * The [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) objects inside the list have at least
     * pageX and pageY that if not specified are set equal to clintX and clientY
     * @param {Array} list An array of touch descriptions
     * @return {Array} that looks like a TouchList
     * @private
     * @method generateTouchList
     */
    var generateTouchList = function (list) {
        if (!list || list.length === 0) {
            return list;
        }
        var  touchList = [];
        for (var i = 0; i < list.length; i += 1) {
            var touch = list[i];
            if (!("pageX" in touch)) {
                touch.pageX = touch.clientX;
            }
            if (!("pageY" in touch)) {
                touch.pageY = touch.clientY;
            }
            touchList.push(touch);
        }
        touchList.identifiedTouch = function () {
            return this[0];
        };
        touchList.item = function (i) {
            return this[i];
        };
        return touchList;
    };

    /**
     * Class to simulate DOM events which can bubble in the DOM. (This class comes from Aria)
     * @class aria.utils.FireDomEvent
     */
    Aria.classDefinition({
        $classpath : 'aria.utils.FireDomEvent',
        $singleton : true,
        $dependencies : ['aria.utils.Type', 'aria.core.Browser'],
        $constructor : function () {
            typeUtils = aria.utils.Type;
            fireDomEvent = this;

            // Workaround for the bug in Firefox 3.6 where customEvent.pageX is unsettable
            var browser = aria.core.Browser;
            if (browser.isFirefox && browser.majorVersion == 3) {
                var mouseEventProto = Aria.$window.MouseEvent.prototype;

                this.originalPageXsetter = mouseEventProto.__lookupSetter__('pageX');
                this.originalPageXgetter = mouseEventProto.__lookupGetter__('pageX');
                this.originalPageYsetter = mouseEventProto.__lookupSetter__('pageY');
                this.originalPageYgetter = mouseEventProto.__lookupGetter__('pageY');

                mouseEventProto.__defineSetter__('pageX', function (val) {
                    this.__pageX = val;
                });
                mouseEventProto.__defineGetter__('pageX', function () {
                    return this.__pageX;
                });
                mouseEventProto.__defineSetter__('pageY', function (val) {
                    this.__pageY = val;
                });
                mouseEventProto.__defineGetter__('pageY', function () {
                    return this.__pageY;
                });
            }
        },
        $destructor : function () {
            var browser = aria.core.Browser;
            if (browser.isFirefox && browser.majorVersion == 3) {
                var mouseEventProto = Aria.$window.MouseEvent.prototype;

                mouseEventProto.__defineSetter__('pageX', this.originalPageXsetter);
                mouseEventProto.__defineGetter__('pageX', this.originalPageXgetter);
                mouseEventProto.__defineSetter__('pageY', this.originalPageYsetter);
                mouseEventProto.__defineGetter__('pageY', this.originalPageYgetter);

                this.originalPageXsetter = null;
                this.originalPageXgetter = null;
                this.originalPageYsetter = null;
                this.originalPageYgetter = null;
            }

            typeUtils = null;
            fireDomEvent = null;
        },
        $prototype : {
            /**
             * Cross browser helper to fire an event from a target HTML element. Supported mouse events: - click -
             * dblclick - mouseover - mouseout - mousedown - mouseup - mousemove Supported keyboard events: - keydown -
             * keyup - keypress Supported HTMLEvents: - focus - blur - change Supported member for JSON options (third
             * arguments): - options.bubbles : Indicates if the event can be bubbled up. The default is true. -
             * options.cancelable : Indicates if the event can be canceled using preventDefault(). - options.detail :
             * The number of times the mouse button has been used. The default value is 1. - options.screenX : (mouse
             * event only) The x-coordinate on the screen at which point the event occured. The default is 0. -
             * options.screenY : (mouse event only) The y-coordinate on the screen at which point the event occured. The
             * default is 0. - options.clientX : (mouse event only) The x-coordinate on the client at which point the
             * event occured. The default is 0. - options.clientY : (mouse event only) The y-coordinate on the client at
             * which point the event occured. The default is 0. - options.ctrlKey : Indicates if one of the CTRL keys is
             * pressed while the event is firing. The default is false. - options.altKey : Indicates if one of the ALT
             * keys is pressed while the event is firing. The default is false. - options.shiftKey : Indicates if one of
             * the SHIFT keys is pressed while the event is firing. The default is false. - options.metaKey : Indicates
             * if one of the META keys is pressed while the event is firing. The default is false. - options.button :
             * (mouse event only) The button being pressed while the event is executing. The value should be 0 for the
             * primary mouse button (typically the left button), 1 for the terciary mouse button (typically the middle
             * button), and 2 for the secondary mouse button (typically the right button). The default is 0. -
             * options.relatedTarget : For mouseout events, this is the element that the mouse has moved to. For
             * mouseover events, this is the element that the mouse has moved from. This argument is ignored for all
             * other events. The default is null. - options.keyCode : (keyboard event only) The code for the key that is
             * in use. The default is 0. - options.charCode : (keyboard event only) The Unicode code for the character
             * associated with the key being used. The default is 0.
             * @param {string} eventType Any DOM2 mouse event name ("click", "mousedown",...).
             * @param {HTMLElement} target the tagret element which fire the event
             * @param {object} options JSON object options for click or keyboard events
             */
            fireEvent : function (eventType, target, options) {
                simulate(target, eventType, options);
            },

            /**
             * Simulate a keydown event used inside key navigation.
             * @method
             */
            fireKeydownEventAdaptedForKeyNav : function (target, options) {
                if (aria.core.Browser.isIE || aria.core.Browser.isSafari) {
                    this.fireKeydownEventAdaptedForKeyNav = function (target, options) {
                        // For IE and Safari:
                        simulate(target, "keydown", options);
                    };
                } else {
                    this.fireKeydownEventAdaptedForKeyNav = function (target, options) {
                        // For other browsers than IE and Safari:
                        // Shitty implementation for keynav:
                        // Other browser that safari and IE need to listen to keydown
                        // and keypress, so we need to simulate both of them for these browser (firefox for instance)
                        simulate(target, "keydown", options);
                        simulate(target, "keypress", options);
                    };
                }
                this.fireKeydownEventAdaptedForKeyNav(target, options);
            }
        }
    });
})();

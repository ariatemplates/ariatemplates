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
var Aria = require("./Aria");
var ariaCoreBrowser = require("./core/Browser");

(function () {

    // Map of W3C/IE event properties
    var eventMap = {
        "target" : "srcElement",
        "type" : "type",
        "clientX" : "clientX",
        "clientY" : "clientY",
        "altKey" : "altKey",
        "ctrlKey" : "ctrlKey",
        "shiftKey" : "shiftKey",
        "pageX" : "pageX",
        "pageY" : "pageY",
        "relatedTarget" : "relatedTarget",
        "button" : "button",
        "direction" : "direction",
        "distance" : "distance",
        "duration" : "duration",
        "startX" : "startX",
        "startY" : "startY",
        "endX" : "endX",
        "endY" : "endY",
        "detail" : "detail",
        "wheelDelta" : "wheelDelta",
        "wheelDeltaX" : "wheelDeltaX",
        "wheelDeltaY" : "wheelDeltaY",
        "screenX" : "screenX",
        "screenY" : "screenY",
        "touches" : "touches",
        "changedTouches" : "changedTouches",
        "targetTouches" : "targetTouches",
        "isPrimary" : "isPrimary"
    };

    // Map of special event types
    var specialTypes = {
        focusin : "focus",
        focusout : "blur",
        dommousescroll : "mousewheel",
        webkitanimationstart : "animationstart",
        oanimationstart : "animationstart",
        msanimationstart : "animationstart",
        webkitanimationiteration : "animationiteration",
        oanimationiteration : "animationiteration",
        msanimationiteration : "animationiteration",
        webkitanimationend : "animationend",
        oanimationend : "animationend",
        msanimationend : "animationend",
        webkittransitionend : "transitionend",
        otransitionend : "transitionend",
        mstransitionend : "transitionend"
    };

    /**
     * Checks to see if the type requested is a special type (as defined by the specialTypes hash), and (if so) returns
     * @param {String} type The type to look up
     */
    var getType = function (type) {
        type = type.toLowerCase();
        return specialTypes[type] || type;
    };

    // browsers shortcut
    var isIE8orLess, isGeckoBefore66;

    /**
     * Event wrapper to normalize DOM event handling on all browsers
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.DomEvent',
        $onload : function () {
            // Browser shortcuts are done in the $onload which is executed only once
            isIE8orLess = (ariaCoreBrowser.isIE7 || ariaCoreBrowser.isIE8);
            isGeckoBefore66 = ariaCoreBrowser.isGecko && ariaCoreBrowser.majorVersion < 66;
        },
        /**
         * DomEvent constructor. It is advised to use the getWrapper static method instead of the constructor,
         * especially when dealing with a widget hierarchy which handles dom events at several levels in the hierarchy.
         * @param {DOMEvent} evt
         */
        $constructor : function (evt) {
            var domEventCopy = (evt.$DomEvent != null);
            // objCopy = true happens when creating a DomEventWrapper from a DomEvent object

            // initialize the object property - cf. eventMap
            if (!domEventCopy && isIE8orLess && Aria.$window.event) {

                evt = Aria.$window.event;
                // create all object properties from the map
                for (var k in eventMap) {
                    if (eventMap.hasOwnProperty(k)) {
                        this[k] = evt[eventMap[k]];
                    }
                }
                if (evt.type == "mouseout") {
                    this.relatedTarget = evt["toElement"];
                } else if (evt.type == "mouseover") {
                    this.relatedTarget = evt["fromElement"];
                }
                // TODO: convert evt.button values (not the same in IE/Safari/FF)
            } else {
                // W3C event - duplicate event values
                for (var k in eventMap) {
                    if (eventMap.hasOwnProperty(k)) {
                        this[k] = evt[k];
                    }
                }
            }

            this.type = getType(evt.type);
            // TODO keyCode / charCode should be homogenized between IE and other browsers
            // What must be implemented: (cf. http://www.quirksmode.org/js/keys.html)
            // keyCode=keyboard key code (e.g. 'A' and 'a' have the same key code: 65)
            // charCode=ASCII value of the resulting character (i.e. 'A'=65 'a'=97
            this.charCode = 0;
            this.keyCode = 0;
            if (this.type == 'keydown' || this.type == 'keyup') {
                this.keyCode = evt.keyCode;
                this.isSpecialKey = this.isSpecialKey(this.keyCode, evt);
            } else if (this.type == 'keypress') {
                // In case of a keypress event the "keycode"
                // is different from the keyup or keydown situation
                // We use keyCode OR charCode to calculate it
                var baseKeyCode = evt.keyCode || evt.charCode;

                /*
                 * We need to calculate the corresponding keycode ... On gecko browsers, charcode is usually used and
                 * has the same value as the non-gecko keycode version For special keys such as TAB, ENTER, DELETE,
                 * BACKSPACE, ARROWS, function keys ... the evt.keycode is valid, should be used, without any offset
                 * applied. So if evt.keyCode is defined on gecko browsers we have to skip applying an offset to the
                 * keycode
                 */
                var skipOffset = isGeckoBefore66 && evt.keyCode;
                this.keyCode = baseKeyCode;

                if (!skipOffset) {

                    // default
                    this.keyCode = baseKeyCode;

                    // before 32 > strange chars
                    // 32 > space, stays the same
                    if (baseKeyCode > 32 && baseKeyCode < 38) {
                        this.keyCode = baseKeyCode + 16;
                    }
                    if (baseKeyCode == 38) {
                        this.keyCode = 55;
                    }
                    if (baseKeyCode == 40) {
                        this.keyCode = 57;
                    }
                    /*
                    *  if (baseKeyCode == 39) { this.keyCode = 56; } if (baseKeyCode == 41) { this.keyCode = 48; }
                    */
                    if (baseKeyCode > 41 && baseKeyCode < 48) {
                        // / to * range
                        this.keyCode = baseKeyCode + 64;
                    }
                    if (baseKeyCode > 47 && baseKeyCode < 58) {
                        // 0 to 9 range
                        this.keyCode = baseKeyCode + 48;
                    } /*
                    * if (baseKeyCode == 58) { this.keyCode = 59; } // 59 > 59 if (baseKeyCode == 60) {
                    * this.keyCode = 188; } if (baseKeyCode == 61) { this.keyCode = 107; } if (baseKeyCode == 62) {
                    * this.keyCode = 190; } if (baseKeyCode == 62) { this.keyCode = 191; } if (baseKeyCode == 64) {
                    * this.keyCode = 50; }
                    */
                    // 65 -> 90 A - Z

                    if (baseKeyCode > 96 && baseKeyCode < 123) {
                        // 'a' to 'z' range - transform to 65-90 range
                        this.keyCode = baseKeyCode - 32;
                    }
                }
                this.charCode = baseKeyCode;

                this.isSpecialKey = this.isSpecialKey(this.keyCode, evt);
            }

            /**
             * Stop propagation for this event. Should not be modified directly (use the stopPropagation method).
             * @type Boolean
             */
            this.hasStopPropagation = false;

            /**
             * Prevent default for this event. Should not be modified directly (use the preventDefault method).
             * @type Boolean
             */
            this.hasPreventDefault = false;

            /**
             * Cancel any default action associated with the event
             * @param {Boolean} stopPropagation tells if event propagation must also be stopped - default: false
             * @method
             */
            this.preventDefault = !evt.preventDefault ? function (stopPropagation) {
                this.hasPreventDefault = true;
                evt.returnValue = false;
                if (stopPropagation === true) {
                    this.stopPropagation();
                }
            } : function (stopPropagation) {
                this.hasPreventDefault = true;
                evt.preventDefault();
                if (stopPropagation === true) {
                    this.stopPropagation();
                }
            };

            /**
             * Prevent the event from bubbling
             * @method
             */
            this.stopPropagation = !evt.stopPropagation ? function () {
                this.hasStopPropagation = true;
                evt.cancelBubble = true;
            } : function () {
                this.hasStopPropagation = true;
                evt.stopPropagation();
            };

            /**
             * Needs to be here in order to access the closure variable 'evt'
             * @private
             */
            this._dispose = function () {
                evt = null;
                this.preventDefault = null;
                this.stopPropagation = null;
            };

        },
        $destructor : function () {
            if (this._dispose) {
                this.target = null;
                this.delegateTarget = null;
                this._dispose();
            }
        },
        $prototype : {
            /**
             * getWrapper knows that this object is an aria.domEvent object through the following variable. It should
             * not change.
             * @type Boolean
             * @protected
             */
            _ariaDomEvent : true,

            /**
             * The number of times getWrapper has been called with this object as a parameter minus the number of time
             * disposeWrapper has been called on this object.
             * @type Integer
             * @protected
             */
            _wrapperNumber : 0,

            /**
             * If this object was created through aria.DomEvent.getWrapper, the disposeWrapper method should be used
             * instead of $dispose when this object is no longer necessary.
             */
            disposeWrapper : function () {
                if (this._wrapperNumber === 0) {
                    this.$dispose();
                } else {
                    this._wrapperNumber--;
                }
            },

            /**
             * Modify the target element of this event.
             * @param {HTMLElement} target New event target
             */
            setTarget : function (target) {
                this.target = target;
            }
        },
        $statics : {
            /**
             * Return a wrapper on the event passed as a parameter. The parameter can either be already a wrapper, in
             * which case the parameter is returned without other object creation, or an event from the dom, in which
             * case a wrapper is created.
             *
             * <pre>
             * Instead of using the following code:
             *     _dom_onmouseover : function (evt) {
             *              this.$Widget._dom_onmouseover.call(this,evt);
             *              var domEvt = new aria.DomEvent(evt);
             *              ...
             *              domEvt.$dispose();
             *     }
             * The following code should be used, so that only one DomEvt object is created per event,
             * event when calling the parent method:
             *     _dom_onmouseover : function (evt) {
             *                 var domEvt = aria.DomEvent.getWrapper(evt);
             *                 this.$Widget._dom_onmouseover.call(this,domEvt);
             *                 ...
             *                 domEvt.disposeWrapper();
             *     }
             * </pre>
             *
             * @param {DOMEvent|aria.DomEvent} evt The event from the dom or a wrapper on it.
             * @return {aria.DomEvent} domEvt An aria.domEvent object representing the event.
             */
            getWrapper : function (evt) {
                if (evt && evt._ariaDomEvent) {
                    evt._wrapperNumber++;
                    return evt;
                } else {
                    return new aria.DomEvent(evt);
                }
            },

            /**
             * Special key keycodes
             * @type Number
             */
            KC_BACKSPACE : 8,
            KC_TAB : 9,
            KC_NUM_CENTER : 12,
            KC_ENTER : 13,
            KC_RETURN : 13,
            KC_SHIFT : 16,
            KC_CTRL : 17,
            KC_CONTROL : 17,
            KC_ALT : 18,
            KC_PAUSE : 19,
            KC_CAPS_LOCK : 20,
            KC_ESCAPE : 27,
            KC_SPACE : 32,
            KC_PAGEUP : 33,
            KC_PAGE_UP : 33,
            KC_PAGEDOWN : 34,
            KC_PAGE_DOWN : 34,
            KC_END : 35,
            KC_HOME : 36,
            KC_LEFT : 37,
            KC_ARROW_LEFT : 37,
            KC_UP : 38,
            KC_ARROW_UP : 38,
            KC_RIGHT : 39,
            KC_ARROW_RIGHT : 39,
            KC_DOWN : 40,
            KC_ARROW_DOWN : 40,
            KC_PRINT_SCREEN : 44,
            KC_INSERT : 45,
            KC_DELETE : 46,
            KC_ZERO : 48,
            KC_ONE : 49,
            KC_TWO : 50,
            KC_THREE : 51,
            KC_FOUR : 52,
            KC_FIVE : 53,
            KC_SIX : 54,
            KC_SEVEN : 55,
            KC_EIGHT : 56,
            KC_NINE : 57,
            KC_A : 65,
            KC_B : 66,
            KC_C : 67,
            KC_D : 68,
            KC_E : 69,
            KC_F : 70,
            KC_G : 71,
            KC_H : 72,
            KC_I : 73,
            KC_J : 74,
            KC_K : 75,
            KC_L : 76,
            KC_M : 77,
            KC_N : 78,
            KC_O : 79,
            KC_P : 80,
            KC_Q : 81,
            KC_R : 82,
            KC_S : 83,
            KC_T : 84,
            KC_U : 85,
            KC_V : 86,
            KC_W : 87,
            KC_X : 88,
            KC_Y : 89,
            KC_Z : 90,
            KC_CONTEXT_MENU : 93,
            KC_NUM_ZERO : 96,
            KC_NUM_ONE : 97,
            KC_NUM_TWO : 98,
            KC_NUM_THREE : 99,
            KC_NUM_FOUR : 100,
            KC_NUM_FIVE : 101,
            KC_NUM_SIX : 102,
            KC_NUM_SEVEN : 103,
            KC_NUM_EIGHT : 104,
            KC_NUM_NINE : 105,
            KC_MULTIPLY : 106,
            KC_PLUS : 107,
            KC_MINUS : 109,
            KC_PERIOD : 110,
            KC_DIVISION : 111,
            KC_DIVIDE : 111,
            KC_F1 : 112,
            KC_F2 : 113,
            KC_F3 : 114,
            KC_F4 : 115,
            KC_F5 : 116,
            KC_F6 : 117,
            KC_F7 : 118,
            KC_F8 : 119,
            KC_F9 : 120,
            KC_F10 : 121,
            KC_F11 : 122,
            KC_F12 : 123,

            /**
             * Static method indicating if a key code corresponds to a special key generally used to navigate or control
             * the user input
             * @param {Number} kc the key code (cf. onkeyup/onkeydown)
             * @param {Object} specials Object that tells if ctrlKey and altKey are pressed
             * @return {Boolean} true if kc corresponds to a special key
             */
            isSpecialKey : function (kc, specials) {
                // changed for PTR04462051 as spaces were included and this was breaking the AutoComplete widget.
                if (kc > 32 && kc < 41) {
                    return true; // space, page or arrow
                }
                if (kc == 8 || kc == 9 || kc == 13 || kc == 27) {
                    return true; // special escape or control keys
                }
                // changed for PTR04462051 as hyphens were included and this was breaking the AutoComplete widget.
                if (kc == 45 || kc == 46) {
                    return false; // insert or delete
                }
                /*
                 * not a special key, just / * - + if (kc == 106 || kc == 107 || kc == 109 || kc == 111) { return true; }
                 */
                // If we are holding a special key (ctrl, alt, ...) and typing any other key, it's a special key
                if (specials.ctrlKey && kc != this.KC_CTRL) {
                    return true;
                }
                if (specials.altKey && kc != this.KC_ALT) {
                    return true;
                }
                if (kc >= 112 && kc <= 123) {
                    // F1 .. F12
                    return true;
                }

                return false;
            },

            /**
             * Static method indicating if a key code corresponds to a navigation key (apart from TAB and ENTER, these
             * keys don't correspond to printable chars)
             * @param {Number} kc the key code (cf. onkeyup/onkeydown)
             * @return {Boolean} true if kc corresponds to a special key
             */
            isNavigationKey : function (kc) {
                if (kc > 32 && kc < 41) {
                    return true; // page or arrow
                }
                if (kc == 9 || kc == 13 || kc == 27) {
                    return true; // tab, enter or escape
                }
                return false;
            },

            /**
             * Returns an object with appropriate
             * @param {String} type
             * @param {HTMLElement} target
             */
            getFakeEvent : function (type, target) {
                var evt = new aria.DomEvent({
                    type : type
                });
                evt.type = type;
                evt.target = target;
                return evt;
            }
        }
    });
})();

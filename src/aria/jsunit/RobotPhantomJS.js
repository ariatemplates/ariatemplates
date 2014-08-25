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
var ariaJsunitIRobot = require("./IRobot");
var ariaCoreTimer = require("../core/Timer");


/**
 * This class is still experimental, its interface may change without notice. Implementation of the aria.jsunit.IRobot
 * interface through calls to the PhantomJS sendEvent method (made available through attester).
 * @private
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.jsunit.RobotPhantomJS',
    $implements : [ariaJsunitIRobot],
    $singleton : true,
    $constructor : function () {
        /**
         * X position of the viewport in PhantomJS screen coordinates.
         * @type Number
         */
        this.offsetX = 0;

        /**
         * Y position of the viewport in PhantomJS screen coordinates.
         * @type Number
         */
        this.offsetY = 32; // height of the header in attester

        var robot;
        if (Aria.$frameworkWindow) {
            /**
             * Reference to the PhantomJS robot object.
             */
            this._robot = robot = Aria.$frameworkWindow.top.phantomJSRobot;
        }
        if (!robot) {
            return;
        }

        /**
         * Reference to the PhantomJS sendEvent method.
         */
        this._sendEvent = this._robot.sendEvent;

        /**
         * True if the shift key is currently pressed.
         */
        this._keyShift = false;

        /**
         * Last position of the mouse, in PhantomJS screen coordinates.
         */
        this._lastMousePosition = {
            x : 0,
            y : 0
        };

        // importing keys from the robot:
        var keys = this.KEYS;
        var robotKeys = robot.keys;
        for (var key in robotKeys) {
            if (robotKeys.hasOwnProperty(key)) {
                var name = "VK_" + key.toUpperCase();
                if (!keys[name]) {
                    keys[name] = robotKeys[key];
                }
            }
        }
        keys.VK_CTRL = robotKeys.Control;
    },
    $statics : {
        MOUSEWHEEL_NOT_IMPLEMENTED : "mouseWheel is not implemented",

        BUTTONS : {
            16 : "left",
            8 : "middle",
            4 : "right"
        },

        /**
         * Set of keys accepted by the keyPress and keyRelease methods.
         * @type Object
         */
        KEYS : {
            "VK_SPACE" : " ",
            "VK_BACK_SPACE" : "\b",
            "VK_MULTIPLY" : "*",
            "VK_PLUS" : "+",
            "VK_MINUS" : "-",
            "VK_PERIOD" : ".",
            "VK_SLASH" : "/",
            "VK_SEMICOLON" : ";",
            "VK_COLON" : ":",
            "VK_EQUALS" : "=",
            "VK_COMMA" : ",",
            "VK_BACK_QUOTE" : "`",
            "VK_BACK_SLASH" : "\\",
            "VK_QUOTE" : "'",
            "VK_QUOTEDBL" : '"',
            "VK_LEFT_PARENTHESIS" : "(",
            "VK_RIGHT_PARENTHESIS" : ")"
        }
    },
    $prototype : {
        $init : function (proto) {
            var keys = proto.KEYS;
            var lastLetter = "Z".charCodeAt(0);
            for (var code = "A".charCodeAt(0); code <= lastLetter; code++) {
                var value = String.fromCharCode(code);
                keys['VK_' + value.toUpperCase()] = value.toLowerCase();
            }
            for (var i = 0; i < 10; i++) {
                keys['VK_' + i] = "" + i;
            }
        },

        /**
         * Returns true if this implementation of the robot is usable, and false if it is not usable.
         */
        isUsable : function () {
            return !!this._robot;
        },

        /**
         * Initializes the robot. Do not call any other method of the robot (except isUsable) before calling this method
         * and waiting for it to call its callback.
         * @param {aria.core.CfgBeans:Callback} callback called when the robot is ready to be used.
         */
        initRobot : function (cb) {
            if (this.isUsable()) {
                this.$callback(cb);
            }
        },

        /**
         * Translates a mouse position from coordinates relative to the viewport to PhantomJS screen coordinates.
         * @param {Object} position position given as an object with x and y properties, in viewport coordinates
         * @return {Object} position given as an object with x and y properties, in PhantomJS screen coordinates
         */
        _translateCoordinates : function (position) {
            return {
                x : position.x + this.offsetX,
                y : position.y + this.offsetY
            };
        },

        /**
         * Sets the mouse position, with coordinates relative to the viewport.
         * @param {Object} position position where to set the mouse (given as an object with x and y properties, in
         * viewport coordinates)
         * @param {aria.core.CfgBeans:Callback} callback
         */
        mouseMove : function (position, callback) {
            var translatedPosition = this._translateCoordinates(position);
            this.absoluteMouseMove(translatedPosition, callback);
        },

        /**
         * Sets the mouse position, with PhantomJS screen coordinates.
         * @param {Object} position position where to set the mouse (given as an object with x and y properties, in
         * PhantomJS screen coordinates)
         * @param {aria.core.CfgBeans:Callback} callback
         */
        absoluteMouseMove : function (position, callback) {
            var lastPosition = this._lastMousePosition;
            lastPosition.x = position.x;
            lastPosition.y = position.y;
            this._sendEvent('mousemove', position.x, position.y);
            this._callCallback(callback);
        },

        /**
         * Smoothly moves the mouse from one position to another, with coordinates relative to the viewport.
         * @param {Object} fromPosition initial position where to set the mouse first (given as an object with x and y
         * properties, in viewport coordinates)
         * @param {Object} toPosition final position of mouse (given as an object with x and y properties, in viewport
         * coordinates)
         * @param {Number} duration Time in ms for the mouse move.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        smoothMouseMove : function (from, to, duration, cb) {
            var translatedFromPosition = this._translateCoordinates(from);
            var translatedToPosition = this._translateCoordinates(to);
            this.smoothAbsoluteMouseMove(translatedFromPosition, translatedToPosition, duration, cb);
        },

        /**
         * Smoothly moves the mouse from one position to another, with PhantomJS screen coordinates.
         * @param {Object} fromPosition initial position where to set the mouse first (given as an object with x and y
         * properties, in PhantomJS screen coordinates)
         * @param {Object} toPosition final position of mouse (given as an object with x and y properties, in PhantomJS
         * screen coordinates)
         * @param {Number} duration Time in ms for the mouse move.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        smoothAbsoluteMouseMove : function (from, to, duration, cb) {
            this.absoluteMouseMove(from, {
                fn : this._stepSmoothAbsoluteMouseMove,
                scope : this,
                resIndex : -1,
                args : {
                    from : from,
                    to : to,
                    duration : duration,
                    cb : cb,
                    endTime : new Date().getTime() + duration
                }
            });
        },

        /**
         * Performs the next mouse move (this method is used by smoothAbsoluteMouseMove).
         * @param {Object} args
         */
        _stepSmoothAbsoluteMouseMove : function (args) {
            var howCloseToEnd = (args.endTime - new Date().getTime()) / args.duration;
            var toPosition = args.to;
            if (howCloseToEnd < 0) {
                this.absoluteMouseMove(toPosition, args.cb);
                return;
            }
            var fromPosition = args.from;
            this.absoluteMouseMove({
                x : howCloseToEnd * fromPosition.x + (1 - howCloseToEnd) * toPosition.x,
                y : howCloseToEnd * fromPosition.y + (1 - howCloseToEnd) * toPosition.y
            }, {
                fn : this._stepSmoothAbsoluteMouseMove,
                scope : this,
                resIndex : -1,
                args : args
            });
        },

        /**
         * Simulates a mouse button press.
         * @param {Number} button Button to be pressed (should be the value of aria.jsunit.Robot.BUTTONx_MASK, with x
         * replaced by 1, 2 or 3).
         * @param {aria.core.CfgBeans:Callback} callback
         */
        mousePress : function (button, cb) {
            var lastPosition = this._lastMousePosition;
            this._sendEvent('mousedown', lastPosition.x, lastPosition.y, this.BUTTONS[button]);
            this._callCallback(cb);
        },

        /**
         * Simulates a mouse button released.
         * @param {Number} button Button to be released (should be the value of aria.jsunit.Robot.BUTTONx_MASK, with x
         * replaced by 1, 2 or 3).
         * @param {aria.core.CfgBeans:Callback} callback
         */
        mouseRelease : function (button, cb) {
            var lastPosition = this._lastMousePosition;
            this._sendEvent('mouseup', lastPosition.x, lastPosition.y, this.BUTTONS[button]);
            this._callCallback(cb);
        },

        /**
         * This method is not implemented. It logs an error.
         */
        mouseWheel : function (wheelAmt, cb) {
            this.$logError(this.MOUSEWHEEL_NOT_IMPLEMENTED);
        },

        /**
         * Simulates a keyboard key press.
         * @param {MultiTypes} key specifies which key should be pressed. It can be any value among the ones in the KEYS
         * property.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        keyPress : function (keyCode, cb) {
            if (keyCode == this.KEYS.VK_SHIFT) {
                this._keyShift = true;
            }
            if (keyCode == this.KEYS.VK_CTRL) {
                this._keyCtrl = true;
            }
            if (typeof keyCode == "string" && this._keyShift) {
                keyCode = keyCode.toUpperCase();
            }
            if (keyCode == this.KEYS.VK_ALT) {
                this._keyAlt = true;
            }
            this._sendEvent('keydown', keyCode, null, null, this._getModifier());
            this._callCallback(cb);
        },

        /**
         * Simulates a keyboard key release.
         * @param {MultiTypes} key specifies which key should be released. It can be any value among the ones in the
         * KEYS property.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        keyRelease : function (keyCode, cb) {
            if (typeof keyCode == "string" && this._keyShift) {
                keyCode = keyCode.toUpperCase();
            }
            if (keyCode == this.KEYS.VK_SHIFT) {
                this._keyShift = false;
            }
            if (keyCode == this.KEYS.VK_CTRL) {
                this._keyCtrl = false;
            }
            if (keyCode == this.KEYS.VK_ALT) {
                this._keyAlt = false;
            }
            this._sendEvent('keyup', keyCode, null, null, this._getModifier());
            this._callCallback(cb);
        },

        /**
         * Return the modifier for phantomjs See
         * https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#wiki-webpage-sendEvent for more information
         */
        _getModifier : function () {
            var modifier = 0;

            if (this._keyCtrl) {
                modifier |= 0x04000000;
            }

            if (this._keyShift) {
                modifier |= 0x02000000;
            }

            if (this._keyAlt) {
                modifier |= 0x08000000;
            }

            return modifier;
        },

        /**
         * Calls the callback after some delay.
         * @param {aria.core.CfgBeans.Calllback} callback
         */
        _callCallback : function (cb) {
            ariaCoreTimer.addCallback({
                fn : this.$callback,
                scope : this,
                args : cb,
                delay : 200
            });
        }
    }
});

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
var ariaUtilsDom = require("../utils/Dom");
var ariaCoreTimer = require("../core/Timer");
var ariaCoreBrowser = require("../core/Browser");

/**
 * This class contains an implementation of the aria.jsunit.IRobot interface which uses the Selenium Java Robot tool.
 * For this implementation to be usable, the browser must have been started with the Selenium Java Robot tool, which is
 * available at the following address: https://github.com/ariatemplates/selenium-java-robot
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.jsunit.RobotJavaSelenium',
    $extends : require("./RobotJava"),
    $implements : [require("./IRobot")],
    $singleton : true,
    $constructor : function () {
        this.$RobotJava.constructor.call(this);

        this._robotInitialized = false;

        /**
         * Offset to add to the X coordinates.
         * @type Number
         */
        this.offsetX = 0;

        /**
         * Offset to add to the Y coordinates.
         * @type Number
         */
        this.offsetY = 0;

        if (Aria.$frameworkWindow.top.attester && Aria.$frameworkWindow.top.location !== Aria.$frameworkWindow.location) {
            // Aria.$frameworkWindow.top.location === Aria.$frameworkWindow.location means we are not running
            // in the attester iframe, so there is no need to apply the extra offset.
            // Otherwise, we are running in an iframe. Let's apply the offset:
            this.offsetY = 32; // height of the header in attester
        }

        // This is updated in _offsetRecevied
        this._offset = {
            x : NaN,
            y : NaN
        };
    },
    $events : {
        "robotInitialized" : "Raised when the robot initialization has been done."
    },
    $statics : {
        ROBOT_ERROR : "An error occurred in the robot: %1"
    },
    $prototype : {

        /**
         * Return true if the robot is most likely usable.
         */
        isUsable : function () {
            return !!Aria.$frameworkWindow.top.SeleniumJavaRobot;
        },

        /**
         * Initialize the robot, if not already done. This must be called before any other method on the robot.
         * @param {aria.core.CfgBeans:Callback} callback callback to be called when the robot is ready to be used.
         */
        initRobot : function (cb) {
            if (!this._robot) {
                this._robot = Aria.$frameworkWindow.top.SeleniumJavaRobot;
                this._robot.getOffset({
                    fn : this._offsetReceived,
                    scope : this
                });
            }
            if (cb) {
                if (this._robotInitialized) {
                    this.$callback(cb);
                } else {
                    this.$onOnce({
                        "robotInitialized" : cb
                    });
                }
            }
        },

        _getScreenPos : function () {
            var window = Aria.$frameworkWindow;
            return {
                x : window.screenX != null ? window.screenX : window.screenLeft,
                y : window.screenY != null ? window.screenY : window.screenTop
            };
        },

        _offsetReceived : function (response) {
            if (response.success) {
                var res = response.result;
                var screenPos = this._getScreenPos();
                // Removes the current position on the screen so that, if the window is moved,
                // adding later the new position on the screen will give the correct coordinates.
                this._offset.x = res.x - screenPos.x;
                this._offset.y = res.y - screenPos.y;
            } else {
                this.$logError(this.ROBOT_ERROR, [response.result]);
            }
            if (!this._robotInitialized) {
                this._robotInitialized = true;
                this.$raiseEvent("robotInitialized");
            }
        },

        _callCallback : function (response, cb) {
            if (!response.success) {
                this.$logError(this.ROBOT_ERROR, [response.result]);
            }
            this.$callback(cb);
        },

        viewportToAbsolute : function (position) {
            var screenPos = this._getScreenPos();
            var offset = this._offset;
            return {
                x : screenPos.x + offset.x + this.offsetX + position.x,
                y : screenPos.y + offset.y + this.offsetY + position.y
            };
        },

        absoluteMouseMove : function (position, cb) {
            this._robot.mouseMove(position.x, position.y, {
                scope : this,
                fn : this._callCallback,
                args : cb
            });
        },

        absoluteSmoothMouseMove : function (from, to, duration, cb) {
            this._robot.smoothMouseMove(from.x, from.y, to.x, to.y, duration, {
                scope : this,
                fn : this._callCallback,
                args : cb
            });
        },

        mouseMove : function (position, cb) {
            var viewport = ariaUtilsDom._getViewportSize();
            if (position.x < 0 || position.y < 0 || position.x > viewport.width || position.y > viewport.height) {
                // FIXME: log error correctly
                this.$logWarn("MouseMove position outside of the viewport.");
                // return;
            }
            this.absoluteMouseMove(this.viewportToAbsolute(position), cb);
        },

        smoothMouseMove : function (from, to, duration, cb) {
            var viewport = ariaUtilsDom._getViewportSize();
            if (from.x < 0 || from.y < 0 || from.x > viewport.width || from.y > viewport.height || to.x < 0 || to.y < 0
                    || to.x > viewport.width || to.y > viewport.height) {
                // FIXME: log error correctly
                this.$logWarn("smoothMouseMove from or to position outside of the viewport.");
                // return;
            }
            this.absoluteSmoothMouseMove(this.viewportToAbsolute(from), this.viewportToAbsolute(to), duration, cb);
        },

        mousePress : function (buttons, cb) {
            this._robot.mousePress(buttons, {
                scope : this,
                fn : this._callCallback,
                args : cb
            });
        },

        mouseRelease : function (buttons, cb) {
            this._robot.mouseRelease(buttons, {
                scope : this,
                fn : this._callCallback,
                args : cb
            });
        },

        mouseWheel : function (wheelAmt, cb) {
            this._robot.mouseWheel(wheelAmt, {
                scope : this,
                fn : this._callCallback,
                args : cb
            });
        },

        keyPress : function (keyCode, cb) {
            // IE sometimes miss some keystrokes, that's why we are adding a 100 ms
            // delay before each keypress (which experimentally seems to help...)
            // http://answers.microsoft.com/en-us/ie/forum/ie8-windows_other/internet-explorer-missing-keystroke-problem/1bee2ec3-828c-4a3d-8b05-638e44baf0a8
            ariaCoreTimer.addCallback({
                fn : this._keyPress,
                scope : this,
                args : {
                    keyCode : keyCode,
                    cb : cb
                },
                delay : ariaCoreBrowser.isIE ? 100 : 1
            });
        },

        _keyPress : function (args) {
            this._robot.keyPress(args.keyCode, {
                scope : this,
                fn : this._callCallback,
                args : args.cb
            });
        },

        keyRelease : function (keycode, cb) {
            this._robot.keyRelease(keycode, {
                scope : this,
                fn : this._callCallback,
                args : cb
            });
        }
    }
});

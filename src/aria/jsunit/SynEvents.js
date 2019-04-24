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
var ariaJsunitRobot = require("./Robot");
var ariaUtilsType = require("../utils/Type");
var ariaUtilsJson = require("../utils/Json");
var ariaCoreTimer = require("../core/Timer");
var ariaJsunitHelpersExecuteFactory = require("./helpers/ExecuteFactory");

/**
 * Layer on top of aria.jsunit.Robot to allow higher-level input (involving DOM elements). (This class is still
 * experimental currently, and is marked private for that reason)
 * @private
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.SynEvents",
    $singleton : true,
    $constructor : function () {
        this._robot = ariaJsunitRobot;
    },
    $destructor : function () {
        this._robot = null;
    },
    $prototype : {
        _keys : {
            "CTRL" : "CONTROL",
            "\t" : "TAB",
            " " : "SPACE",
            "\b" : "BACK_SPACE",
            "\r" : "ENTER",
            "*" : "MULTIPLY",
            "+" : "PLUS",
            "-" : "MINUS",
            "." : "PERIOD",
            "/" : "SLASH",
            ";" : "SEMICOLON",
            ":" : "COLON",
            "=" : "EQUALS",
            "," : "COMMA",
            "`" : "BACK_QUOTE",
            "\\" : "BACK_SLASH",
            "'" : "QUOTE",
            '"' : "QUOTEDBL",
            "(" : "LEFT_PARENTHESIS",
            ")" : "RIGHT_PARENTHESIS"
        },

        _methods : {
            // robot actions:
            "initRobot" : 0,
            "mouseMove" : 1,
            "smoothMouseMove" : 3,
            "absoluteMouseMove" : 1,
            "mousePress" : 1,
            "mouseRelease" : 1,
            "mouseWheel" : 1,
            "keyPress" : 1,
            "keyRelease" : 1,

            // higher-level actions:
            "ensureVisible" : 1,
            "focus" : 1,
            "waitFocus" : 1,
            "pause" : 1,

            // higher level inputs:
            "click" : 1,
            "type" : 2,
            "move" : 2,
            "drag" : 2,

            "execute" : 1
        },

        execute : ariaJsunitHelpersExecuteFactory.createExecuteFunction(function (methodName) {
            var args = this._methods[methodName];
            if (args != null) {
                var scope = this[methodName] ? this : (this._robot[methodName] ? this._robot : this._robot.robot);
                return {
                    args: args,
                    scope: scope,
                    fn: scope[methodName]
                };
            }
        }),

        ensureVisible : function (domElt, cb) {
            domElt = this._resolveHTMLElement(domElt);
            aria.utils.Dom.scrollIntoView(domElt);
            // TODO: check if the item was really made visible
            this.$callback(cb);
        },

        focus : function (domElt, cb) {
            domElt = this._resolveHTMLElement(domElt);
            domElt.focus();
            this.waitFocus(domElt, cb);
        },

        waitFocus : function (domElt, cb) {
            var self = this;
            var stopTesting = new Date().getTime() + 5000;
            var check = function () {
                var activeElement = Aria.$window.document.activeElement;
                if (activeElement === domElt) {
                    domElt = null;
                    self.$callback(cb);
                } else if (new Date().getTime() > stopTesting) {
                    self.$logError("Timeout while waiting for an element to be focused: %1", [domElt
                            ? domElt.tagName
                            : domElt], domElt);
                } else {
                    setTimeout(check, 100);
                }
            };
            setTimeout(check, 100);
        },

        pause : function (duration, cb) {
            ariaCoreTimer.addCallback({
                fn : this.$callback,
                scope : this,
                args : cb,
                delay : duration
            });
        },

        /**
         * Do a click somewhere on the screen.
         * @param {Object|HTMLElement|String} where
         * @param {aria.core.CfgBeans:Callback} cb
         */
        click : function (where, cb) {
            where = this._resolvePosition(where);
            if (where == null) {
                return;
            }
            this.$logDebug("click: %1,%2", [where.x, where.y]);
            this.execute([["mouseMove", where], ["mousePress", this._robot.BUTTON1_MASK], ["pause", 100],
                    ["mouseRelease", this._robot.BUTTON1_MASK]], cb);
        },

        type : function (domElt, text, cb) {
            var seq = [];
            if (domElt) {
                domElt = this._resolveHTMLElement(domElt);
                seq.push(["focus", domElt]);
            }
            var parts = text.match(/(\[[^\]]+\])|([^\[])/g);
            for (var i = 0, l = parts.length; i < l; i++) {
                var key = parts[i];
                var shift = false;
                var keyPress = true;
                var keyRelease = true;
                if (key.length > 1) {
                    // remove '[' and ']', and convert to upper case
                    key = key.substr(1, key.length - 2).toUpperCase();
                    if (/^<.*>$/.test(key)) {
                        // only keyPress
                        keyRelease = false;
                    } else if (/^>.*<$/.test(key)) {
                        // only keyRelease
                        keyPress = false;
                    }
                    if (!(keyPress && keyRelease)) {
                        key = key.substr(1, key.length - 2);
                    }
                    key = key.replace(/-/g, "_"); // replace - by _
                } else {
                    // press shift for a upper case character
                    shift = (key != key.toLowerCase());
                    key = key.toUpperCase();
                }
                var replaceKey = this._keys[key];
                if (replaceKey != null) {
                    key = replaceKey;
                }
                key = this._robot.robot.KEYS["VK_" + key];
                if (key == null) {
                    this.$logError("Unknown key: %1", [parts[i]]);
                    continue;
                }
                if (shift) {
                    seq.push(["keyPress", this._robot.robot.KEYS.VK_SHIFT]);
                }
                if (keyPress) {
                    seq.push(["keyPress", key]);
                }
                if (keyRelease) {
                    seq.push(["keyRelease", key]);
                }
                if (shift) {
                    seq.push(["keyRelease", this._robot.robot.KEYS.VK_SHIFT]);
                }
            }
            this.$logDebug("type: %1", [ariaUtilsJson.convertToJsonString(text)]);
            this.execute(seq, cb);
        },

        move : function (options, from, cb) {
            var duration = options.duration || 2000;
            var to = options.to;
            to = this._resolvePosition(to);
            from = from ? this._resolvePosition(from) : to;
            if (from == null || to == null) {
                // error is already logged
                return;
            }
            this.$logDebug("move: %1,%2 -> %3,%4", [from.x, from.y, to.x, to.y]);
            this._robot.robot.smoothMouseMove(from, to, duration, cb);
        },

        drag : function (options, from, cb) {
            var to = options.to;
            to = this._resolvePosition(to);
            from = from ? this._resolvePosition(from) : to;
            if (from == null || to == null) {
                // error is already logged
                return;
            }
            var seq = [["mouseMove", from], ["mousePress", this._robot.BUTTON1_MASK], ["move", options, from],
                    ["mouseRelease", this._robot.BUTTON1_MASK]];
            this.$logDebug("drag");
            this.execute(seq, cb);

        },

        _resolvePosition : function (position) {
            var domUtils = aria.utils.Dom;
            var res;
            if (ariaUtilsType.isString(position)) {
                // it is a string, resolve it to an HTML element
                position = this._resolveHTMLElement(position);
            }
            if (ariaUtilsType.isHTMLElement(position)) {
                // put the mouse on the center of the element
                // TODO: check if the item is really visible
                var geometry = domUtils.getGeometry(position);
                res = {
                    x : geometry.x + geometry.width / 2,
                    y : geometry.y + geometry.height / 2
                };
            } else if (position.hasOwnProperty("x") && position.hasOwnProperty("y")) {
                res = position;
            } else {
                // FIXME: log error correctly
                this.$logError("Invalid position.");
                return null;
            }
            return res;
        },

        _resolveGeometry : function (geometry) {
            var domUtils = aria.utils.Dom;
            var res;
            if (ariaUtilsType.isString(geometry)) {
                // it is a string, resolve it to an HTML element
                geometry = this._resolveHTMLElement(geometry);
            }
            if (ariaUtilsType.isHTMLElement(geometry)) {
                res = domUtils.getGeometry(geometry);
                // TODO: check if the item is really visible
            } else if (geometry.hasOwnProperty("x") && geometry.hasOwnProperty("y") &&
                    geometry.hasOwnProperty("width") && geometry.hasOwnProperty("height")) {
                res = geometry;
            } else {
                // FIXME: log error correctly
                this.$logError("Invalid position.");
                return null;
            }
            return res;
        },

        _resolveHTMLElement : function (element) {
            var res;
            if (ariaUtilsType.isString(element)) {
                // it is a string, resolve it to an HTML element
                res = aria.utils.Dom.getElementById(element);
                if (res == null) {
                    // FIXME: log error correctly
                    this.$logError("HTML element was not found.");
                    return null;
                }
            } else if (ariaUtilsType.isHTMLElement(element)) {
                res = element;
            } else {
                // FIXME: log error correctly
                this.$logError("Invalid HTML element.");
                return null;
            }
            return res;
        }
    }
});

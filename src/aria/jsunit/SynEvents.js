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

/**
 * Layer on top of aria.jsunit.Robot to allow higher-level input (involving DOM elements). (This class is still
 * experimental currently, and is marked private for that reason)
 * @class aria.jsunit.SynEvents
 * @private
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.SynEvents',
    $singleton : true,
    $dependencies : ['aria.jsunit.Robot'],
    $constructor : function () {
        this._robot = aria.jsunit.Robot;
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
            "pause" : 1,

            // higher level inputs:
            "click" : 1,
            "type" : 2,
            "move" : 2,
            "drag" : 2,

            "execute" : 1
        },

        execute : function (array, cb) {
            this._executeCb(0, {
                array : array,
                curIdx : 0,
                cb : cb
            });
        },

        _executeCb : function (unused, args) {
            var array = args.array;
            var curIdx = args.curIdx;
            if (args.curIdx >= array.length) {
                this.$callback(args.cb);
            } else {
                var callParams = array[curIdx];
                var cb = args.curIdx++;
                if (!aria.utils.Type.isArray(callParams)) {
                    this.$logError("Not an array");
                    return;
                }
                var methodName = callParams.shift();
                var nbParams = this._methods[methodName];
                if (nbParams == null) {
                    this.$logError("Bad action");
                    return;
                }
                if (nbParams != callParams.length) {
                    // FIXME: log error correctly
                    this.$logError("Bad number of parameters");
                    return;
                }
                // add the callback parameter before calling the method:
                callParams[nbParams] = {
                    fn : this._executeCb,
                    scope : this,
                    args : args
                };
                var scope = this[methodName] ? this : (this._robot[methodName] ? this._robot : this._robot.robot);
                scope[methodName].apply(scope, callParams);
            }
        },

        ensureVisible : function (domElt, cb) {
            domElt = this._resolveHTMLElement(domElt);
            aria.utils.Dom.scrollIntoView(domElt);
            // TODO: check if the item was really made visible
            this.$callback(cb);
        },

        focus : function (domElt, cb) {
            domElt = this._resolveHTMLElement(domElt);
            domElt.focus();
            this.$callback(cb);
        },

        pause : function (duration, cb) {
            aria.core.Timer.addCallback({
                fn : this.$callback,
                scope : this,
                args : cb,
                delay : duration
            });
        },

        /**
         * Do a click somewhere on the screen.
         * @param {} where
         * @param {} cb
         */
        click : function (where, cb) {
            where = this._resolvePosition(where);
            if (where == null) {
                return;
            }
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
            this.execute(seq, cb);

        },

        _resolvePosition : function (position) {
            var domUtils = aria.utils.Dom;
            var res;
            if (aria.utils.Type.isString(position)) {
                // it is a string, resolve it to an HTML element
                position = this._resolveHTMLElement(position);
            }
            if (aria.utils.Type.isHTMLElement(position)) {
                // put the mouse on the center of the element
                // TODO: check if the item is really visible
                var geometry = domUtils.getGeometry(position);
                res = {
                    x : geometry.x + geometry.width / 2,
                    y : geometry.y + geometry.height / 2
                }
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
            if (aria.utils.Type.isString(geometry)) {
                // it is a string, resolve it to an HTML element
                geometry = this._resolveHTMLElement(geometry);
            }
            if (aria.utils.Type.isHTMLElement(geometry)) {
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
            if (aria.utils.Type.isString(element)) {
                // it is a string, resolve it to an HTML element
                res = aria.utils.Dom.getElementById(element);
                if (res == null) {
                    // FIXME: log error correctly
                    this.$logError("HTML element was not found.");
                    return null;
                }
            } else if (aria.utils.Type.isHTMLElement(element)) {
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
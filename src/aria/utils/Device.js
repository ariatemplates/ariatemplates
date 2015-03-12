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
var ariaUtilsArray = require("../utils/Array");
var ariaCoreBrowser = require("../core/Browser");
var UserAgent = require("../core/useragent/UserAgent");
var ariaUtilsEvent = require("./Event");
var ariaUtilsDom = require("./Dom");



module.exports = Aria.classDefinition({
    $classpath : "aria.utils.Device",
    $singleton : true,
    $events : {
        "orientationchange" : {
            description : "This event is fired when there is orientation change on the device",
            properties : {
                "isPortrait" : "Boolean value indicating that the screen's orientation is portrait"
            }
        }
    },

    $constructor : function () {
        /**
         * Previous orientation value to check if event should be raised (value changed or not).
         * @type Boolean
         * @private
         */
        this._previousIsPortrait = this.isPortrait(true);

        this.init();
    },
    $prototype : {


        /**
         * Makes the class work with the given user agent.
         *
         * <p>
         * If no user agent is given, current browser's one is taken.
         * </p>
         *
         * @param {String} userAgent The user agent to take into account in this class
         *
         * @return {Object} The user agent wrapper used to compute the properties (see <em>aria.core.useragent.UserAgent.getUserAgentInfo</em>)
         */
        init : function (userAgent) {
            var userAgentWrapper = ariaCoreBrowser.init(userAgent);

            this.__userAgentWrapper = userAgentWrapper;

            return userAgentWrapper;
        },

        /**
         * Returns the model of the device, if any.
         *
         * @return {String} The model of the device if any, an empty otherwise
         */
        model : function() {
            var model = this.__userAgentWrapper.results.device.model;

            if (model != null) {
                return model;
            }

            return "";
        },

        /**
         * Returns the vendor of the device, if any.
         *
         * @return {String} The device vendor if any, an empty otherwise
         */
        vendor: function () {
            var vendor = this.__userAgentWrapper.results.device.vendor;

            if (vendor != null) {
                return vendor;
            }

            return "";
        },

        /**
         * Returns the device name, which is a mix of model and vendor properties when available.
         *
         * <p>
         * The format is the following: <em>vendor - model</em>
         * </p>
         *
         * @return {String} The device name or an empty string if no information at all is available
         */
        deviceName: function() {
            var parts = [
                this.vendor(),
                this.model()
            ];

            for (var index = parts.length - 1; index >= 0; index--) {
                var part = parts[index];
                if (part == null || part.length == null || part.length <= 0) {
                    parts.splice(index, 1);
                }
            }

            var deviceName = parts.join(" - ");

            return deviceName;
        },

        /**
         * Checks whether it is a phone device rather than a tablet.
         *
         * <p>
         * We consider that if a mobile operating system is detected but nothing tells that is is a tablet, by default the device is a mobile phone.
         * </p>
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isPhone : function () {
            // -------------------------------------------- result initial value

            var result = false;

            // -------------------------------------------------- standard check

            var deviceType = this.__userAgentWrapper.results.device.type;

            if (!result) {
                if (deviceType != null) {
                    result = UserAgent.normalizeName(deviceType) == "mobile";
                }
            }

            // --------------------------------------------------- special cases

            if (!result) {
                if (!this.isTablet()) {
                    result = ariaCoreBrowser.isAndroid
                    || ariaCoreBrowser.isBlackBerry
                    || ariaCoreBrowser.isIOS
                    || ariaCoreBrowser.isSymbian
                    || ariaCoreBrowser.isWindowsPhone
                    || UserAgent.normalizeName(ariaCoreBrowser.osName) == "webos"
                    ;
                }
            }

            // ---------------------------------------------------------- result

            return !!result;
        },

        /**
         * Checks whether the device is a tablet device rather than a phone.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isTablet : function () {
            // -------------------------------------------- result initial value

            var result = false;

            // -------------------------------------------------- standard check

            var deviceType = this.__userAgentWrapper.results.device.type;
            if (!result) {
                if (deviceType != null) {
                    result = UserAgent.normalizeName(deviceType) == "tablet";
                }
            }

            // --------------------------------------------------- special cases

            if (!result) {
                var userAgent = this.__userAgentWrapper.ua.toLowerCase();
                result = /(iPad|SCH-I800|GT-P1000|GT-P1000R|GT-P1000M|SGH-T849|SHW-M180S|android 3.0|xoom|NOOK|playbook|tablet|silk|kindle|GT-P7510)/i.test(userAgent);
            }

            // ---------------------------------------------------------- result

            return !!result;
        },

        /**
         * Checks whether the computer is a mobile device.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isDevice : function () {
            return this.isPhone() || this.isTablet();
        },

        /**
         * Checks whether the computer is a desktop.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isDesktop : function () {
            return !(this.isDevice());
        },

        /**
         * Checks whether it is a touch device.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isTouch : function () {
            var isTouch = false;

            if (ariaCoreBrowser.isBlackBerry) {
                if (!ariaUtilsArray.contains([9670, 9100, 9105, 9360, 9350, 9330, 9320, 9310, 9300, 9220, 9780, 9700, 9650], +this.model())) {
                    isTouch = true;
                }
            } else {
                var window = Aria.$window;

                if (('ontouchstart' in window) || window.DocumentTouch && window.document instanceof window.DocumentTouch) {
                    isTouch = true;
                }
            }

            return !!isTouch;
        },

        /**
         * Override the $on function to only listen to resize (for orientation changes) when needed.
         *
         * @override
         */
        $on : function () {
            ariaUtilsEvent.addListener(Aria.$window, "resize", {
                fn : this._onResize,
                scope : this
            });
            this._previousIsPortrait = this.isPortrait();
            this.$JsObject.$on.apply(this, arguments);
        },

        /**
         * Checks device orientation and raises event accordingly.
         * @private
         */
        _onResize : function() {
            var isPortrait = this.isPortrait();
            if (isPortrait !== this._previousIsPortrait) {
                this.$raiseEvent({
                    name : "orientationchange",
                    isPortrait : isPortrait
                });
                this._previousIsPortrait = isPortrait;
            }
        },

        /**
         * Returns <em>true</em> if the device's orientation is portrait, <em>false</em> if it is landscape.
         *
         * @return {Boolean}
         */
        isPortrait : function () {
            var dim = ariaUtilsDom.getViewportSize();
            return dim.height > dim.width;
        },

        /**
         * Checks whether the cursor moved with a trackball or trackpad.
         *
         * @return {Boolean} <em>true</em> if so, <em>false</em> otherwise
         */
        isClickNavigation : function () {
            return ariaCoreBrowser.isBlackBerry;
        }
    }
});

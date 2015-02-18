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
Aria.classDefinition({
    $classpath : "test.aria.utils.DeviceTest",
    $dependencies : ["aria.utils.Device", "aria.core.Browser", "aria.utils.Array", "aria.utils.FrameATLoader", "aria.utils.Function"],
    $extends : "aria.jsunit.TestCase",

    $constructor : function () {
        this.$TestCase.constructor.call(this);

        this.originalWindow = Aria.$window;

        this._tmpWindow = null;
    },

    $destructor : function () {
        this.originalWindow = null;

        this.$TestCase.$destructor.call(this);
    },

    $prototype : {
        tearDown : function () {
            this.reset();
        },

        /**
         * Resets everything altered for testing purposes.
         */
        reset : function () {
            Aria.$window = this.originalWindow;

            aria.utils.Device._styleCache = {};
        },

        testTouch : function () {
            var Browser = aria.core.Browser;
            var Device = aria.utils.Device;

            // -----------------------------------------------------------------

            // The touch function relies on the presence of ontouchstart or DocumentTouch
            Aria.$window = {
                "ontouchstart" : Aria.empty
            };
            this.assertTrue(Device.isTouch(), "Windows with ontouchstart should be touch");

            // -----------------------------------------------------------------

            this.reset();
            var documentTouch = function () {};
            Aria.$window = {
                "DocumentTouch" : documentTouch,
                document : new documentTouch()
            };
            this.assertTrue(Device.isTouch(), "Windows with DocumentTouch should be touch");

            // -----------------------------------------------------------------
            // Blackberry 9100

            this.reset();
            Aria.$window = {};
            var originalBrowserBlackBerry = Browser.isBlackBerry;

            Browser.isBlackBerry = true;
            Device.init("BlackBerry9100/4.6.0.31 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/100");
            this.assertFalse(Device.isTouch(), "BlackBerry device should be touch");

            Browser.isBlackBerry = originalBrowserBlackBerry;
        },

        // Phantom does not handle windows resizing, so we'll use an iframe for orientation tests instead

        _fakeNewWindow : function (width, height) {
            if (this._tmpWindow == null) {
                this._tmpWindow = Aria.$window.document.createElement("iframe");
                Aria.$window.document.body.appendChild(this._tmpWindow);
            }
            this._tmpWindow.style.width = width+"px";
            this._tmpWindow.style.height = height+"px";
        },

        testAsyncOrientation : function () {
            this._fakeNewWindow(40, 80);
            aria.utils.FrameATLoader.loadAriaTemplatesInFrame(this._tmpWindow, {
                fn : this._orientation1,
                scope : this
            });
        },

        _orientation1 : function () {
            this._tmpWindow.contentWindow.Aria.load({
                classes: [
                    "aria.utils.Device"
                ],
                oncomplete: {
                    fn : this._orientation2,
                    scope : this
                }
            });
        },

        _orientation2 : function () {
            this.assertTrue(this._tmpWindow.contentWindow.aria.utils.Device.isPortrait(), "Initial viewport orientation should be reported as portrait");

            var that = this;
            this.eventRaised = false;

            this._tmpWindow.contentWindow.aria.utils.Device.$raiseEvent = function (e) {
                if (e.name == "orientationchange") {
                    that.eventRaised = true;
                }
            };

            this._tmpWindow.contentWindow.aria.utils.Device.$on({
                "orientationchange" : function(){},
                scope : this
            });

            this._fakeNewWindow(400, 800);
            setTimeout(aria.utils.Function.bind(this._orientation3, this), 50);
        },

        _orientation3 : function () {
            this.assertFalse(this.eventRaised, "Different viewport size with same orientation: event shouldn't be raised");

            this._fakeNewWindow(80, 40);
            setTimeout(aria.utils.Function.bind(this._orientation4, this), 50);
        },

        _orientation4 : function () {
            this.assertTrue(this.eventRaised, "Different viewport size with different orientation: event should be raised");
            this._tmpWindow.parentNode.removeChild(this._tmpWindow);
            this.notifyTestEnd("testAsyncOrientation");
        },

        testClickNavigation : function () {
            // Only BlackBerries are clickable navigation

            var Browser = aria.core.Browser;
            var Device = aria.utils.Device;

            var originalBrowserBlackBerry = Browser.isBlackBerry;

            // -----------------------------------------------------------------

            Browser.isBlackBerry = true;
            this.assertTrue(Device.isClickNavigation(), "BlackBerry should be clickable");
            Browser.isBlackBerry = originalBrowserBlackBerry;

            // -----------------------------------------------------------------

            this.reset();
            Browser.isBlackBerry = false;
            this.assertFalse(Device.isClickNavigation(), "Non BlackBerry shouldn't be clickable");
            Browser.isBlackBerry = originalBrowserBlackBerry;
        },

        /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1397) */
        testDeprecation : function() {
            var Device = aria.utils.Device;

            // -----------------------------------------------------------------

            Device.init();
            if (!aria.core.Browser.supportsPropertyDescriptors()) {
                return;
            }

            // -----------------------------------------------------------------

            var properties = Device._deprecatedProperties;

            aria.utils.Array.forEach(properties, function(property) {
                var name = property.name;
                var type = property.type;
                var loggingMessage = property.loggingMessage;

                // -------------------------------------------------------------

                if (type == "attribute") {
                    var dummy = Device[name];
                } else {
                    Device[name]();
                }

                // -------------------------------------------------------------

                this.assertErrorInLogs(loggingMessage, 1);
            }, this);
        }
        /* BACKWARD-COMPATIBILITY-END (GitHub #1397) */
    }
});

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


module.exports = Aria.classDefinition({
    $classpath : "aria.utils.Orientation",
    $singleton : true,
    $events : {
        "change" : {
            description : "This event is fired when there is orientation change on the device",
            properties : {
                "screenOrientation" : "Current Orientation of the device",
                "isPortrait" : "Boolean values to tell if the screen is portrait"
            }
        }
    },

    /**
     * Adding a listener while initializing Orientation to listen to the native orientationchange event.
     */
    $constructor : function () {
        var window = Aria.$window;
        if (typeof(window.orientation) != "undefined") { // check if browser support orientation change
            this.screenOrientation = window.orientation;
            this.isPortrait = this.__isPortrait();

            // start listening native event orinetationchange.
            ariaUtilsEvent.addListener(window, "orientationchange", {
                fn : this._onOrientationChange,
                scope : this
            });
        }
    },

    $destructor : function () {
        ariaUtilsEvent.removeListener(Aria.$window, "orientationchange", {
            fn : this._onOrientationChange
        });
    },

    $prototype : {

        /**
         * Callback executed after orientation of the device is changed. This raises a wrapper event for the native
         * event orientationchange and provides properties screenOrientation which is exact value of window.orientation
         * and additional variable isPortrait to tell if device orientation is portrait
         * @protected
         */
        _onOrientationChange : function () {
            this.screenOrientation = Aria.$window.orientation;
            this.isPortrait = this.__isPortrait();
            // raise event "change" to notify about orientation change along with properties for current orientation
            this.$raiseEvent({
                name : "change",
                screenOrientation : this.screenOrientation,
                isPortrait : this.isPortrait
            });
        },

        /**
         * Returns a boolean value to signify if the device orientation is portrait.
         * @private
         * @return {Boolean}
         */
        __isPortrait : function () {
            if (Aria.$window.orientation % 180 === 0) {
                return true;
            } else {
                return false;
            }
        }
    }
});

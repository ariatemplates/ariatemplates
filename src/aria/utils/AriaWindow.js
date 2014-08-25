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


/**
 * This class manages changes to Aria.$window and page navigation in Aria.$window.
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.AriaWindow',
    $singleton : true,
    $constructor : function () {
        /**
         * Counter of Aria.$window usages. This is incremented by attachWindow and decremented by detachWindow.
         * @type Number
         * @private
         */
        this._windowUsages = 0;
    },
    $destructor : function () {
        this._unloadWindow();
    },
    $events : {
        "attachWindow" : "This event is raised when Aria Templates is starting to store references on Aria.$window (when a call of attachWindow makes the counter pass from 0 to 1).",
        "unloadWindow" : "This event is raised when setWindow is called with a different window, or if the document is unloaded (for example on page navigation), and only if the window is used by Aria Templates (the counter is non-zero). Listeners should do the necessary to remove references to elements inside the Aria.$window.",
        "detachWindow" : "This event is raised when Aria Templates no longer stores references on Aria.$window (when a call of detachWindow makes the counter pass from 1 to 0)."
    },
    $statics : {
        NEGATIVE_WINDOW_USAGES : "Calls to attachWindow/detachWindow lead to a negative counter: %1. The counter will be reset to 0.",
        WINDOW_STILL_USED_AFTER_UNLOAD : "Counter is not null after raising unloadWindow: %1. The counter will be reset to 0.",
        ALREADY_UNLOADING_WINDOW : "Aria.$window is already being unloaded."
    },
    $prototype : {
        /**
         * Notifies the framework that Aria.$window is being stored or used in some way that can last some time. This
         * increments a usage counter. To notify the framework that Aria.$window is no longer used, please call
         * detachWindow to decrement the counter.
         */
        attachWindow : function () {
            this._windowUsages++;
            if (this._windowUsages === 1) {
                ariaUtilsEvent.addListener(Aria.$window, "unload", {
                    fn : this._unloadWindow,
                    scope : this
                });
                this.$raiseEvent("attachWindow");
            }
        },
        /**
         * Notifies the framework that Aria.$window is no longer stored or used by the caller (after a previous call to
         * attachWindow). This decrements the usage counter.
         */
        detachWindow : function () {
            if (this._windowUsages <= 0) {
                this.$logError(this.NEGATIVE_WINDOW_USAGES, [this._windowUsages - 1]);
            } else {
                this._windowUsages--;
            }
            if (this._windowUsages === 0 && !this._isUnloadingWindow) {
                this._raiseDetachWindow();
            }
        },

        /**
         * Raises the detachWindow event and unregisters the unload event from Aria.$window.
         * @private
         */
        _raiseDetachWindow : function () {
            this.$assert(42, this._windowUsages === 0);
            this.$raiseEvent("detachWindow");
            ariaUtilsEvent.removeListener(Aria.$window, "unload", {
                fn : this._unloadWindow,
                scope : this
            });
            ariaUtilsEvent.reset();
        },

        /**
         * Raises the unloadWindow event, makes sure the usage counter is reset to 0, then raises the detachWindow
         * event.
         * @private
         */
        _unloadWindow : function () {
            if (this._isUnloadingWindow) {
                this.$logError(this.ALREADY_UNLOADING_WINDOW);
                return;
            }
            if (!this.isWindowUsed()) {
                return;
            }
            this._isUnloadingWindow = true;
            try {
                this.$raiseEvent("unloadWindow");
                if (this._windowUsages > 0) {
                    this.$logError(this.WINDOW_STILL_USED_AFTER_UNLOAD, [this._windowUsages]);
                    this._windowUsages = 0;
                }
                this._raiseDetachWindow();
            } finally {
                this._isUnloadingWindow = false;
            }
        },
        /**
         * Setter method to change Aria.$window. Aria.$window should never be changed directly, this method should be
         * called instead. If the new window is different from the previous one, calling this method raises the
         * unloadWindow event, then changes the reference in Aria.$window.
         * @param {Object} window new window object to be stored in Aria.$window
         */
        setWindow : function (window) {
            if (window === Aria.$window) {
                return;
            }
            this._unloadWindow();
            Aria.$window = window;
        },

        /**
         * Returns true if Aria.$window is being used currently inside the framework.
         * @return {Boolean}
         */
        isWindowUsed : function () {
            return this._windowUsages > 0;
        }

    }
});

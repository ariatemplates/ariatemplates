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
 * This class handles asynchronous callbacks and gives the possibility to associate an object
 * (scope) to the callback function - which is not possible with setTimeout(...) It also creates a unique id that
 * can be used to cancel the callback
 */
Aria.classDefinition({
    $classpath : "aria.core.Timer",
    $singleton : true,
    $constructor : function () {
        /**
         * List or callbacks currently defined (indexed by callback id) Items have the following form:
         *
         * <pre>
         * '456' : { // callback internal id
         *    fn : cb.fn,
         *    scope : cb.scope,
         *    delay : delay,
         *    args : args,
         *    cancelId : 123456413
         * }
         * </pre>
         *
         * @type Map
         * @private
         */
        this._callbacks = {};

        /**
         * Association map between interval/timeout ids and internal ids Items have the following form:
         *
         * <pre>
         * '4578912156'
         * : '456' // key=timeout id, value=internal callback id
         * </pre>
         *
         * @type Map
         * @private
         */
        this._cancelIds = {};

        /**
         * Callback counter - automatically reset to 0 when reaches _MAX_COUNT
         * @type Integer
         * @private
         */
        this._cbCount = 0;

        /**
         * Running total of callbacks as they are added and removed.
         * @type Integer
         * @private
         */
        this._numberOfCallbacks = 0;
    },
    $destructor : function () {
        this.callbacksRemaining();
    },
    $statics : {
        // ERROR MESSAGES:
        TIMER_CB_ERROR : "Uncaught exception in Timer callback (%1)",
        TIMER_CB_ERROR_ERROR : "Uncaught exception in Timer callback error handler (%1)"
    },
    $prototype : {
        _MAX_COUNT : 100000,

        /**
         * Checks if any callbacks are remaining, if there are then logs an error and cancels the callback.
         * @public
         */
        callbacksRemaining : function () {
            var callbacks = this._callbacks;
            if (this._numberOfCallbacks > 0) {
                var item;
                for (var i in callbacks) {
                    item = callbacks[i];
                    /*
                     * this.$logError("10013_TIMER_CB_ERROR", [ "A callback exists after the test has been destroyed: " +
                     * item.scope.$classpath, this.$classpath]);
                     */
                    this.cancelCallback(i + '-' + item.cancelId);
                }
            }
        },

        /**
         * Create a new callback and return a callback id note: callbacks are automatically removed from the list once
         * executed. <code>
         * aria.core.Timer.addCallback({
         *     fn : obj.method, // mandatory
         *     scope : obj, // mandatory
         *     onerror : obj2.method2 // callback error handler - optional - default: Timer error log
         *     onerrorScope : obj2 // optional - default: Timer or scope if onError is provided
         *     delay : 100, // optional - default: 1ms
         *     args : {x:123} // optional - default: null
         * });
         * </code>
         * @param {Object} cb the callback description
         * @return {String} cancel id
         */
        addCallback : function (cb) {
            // TODO: check mandatory attributes and log error if pb
            this.$assert(74, cb && cb.scope && cb.fn); // temporary solution
            var onerror = (cb.onerror) ? cb.onerror : null;
            var onerrorScope = (cb.onerrorScope) ? cb.onerrorScope : null;
            // create new cb
            this._cbCount++;
            this._numberOfCallbacks++;
            var delay = (cb.delay > 0) ? cb.delay : 1;
            var args = (cb.args) ? cb.args : null;
            this._callbacks["" + this._cbCount] = {
                fn : cb.fn,
                scope : cb.scope,
                delay : delay,
                args : args,
                onerror : onerror,
                onerrorScope : onerrorScope
            };
            var cbCount = this._cbCount;
            var cancelId = setTimeout(function () {
                aria.core.Timer._execCallback(cbCount);
            }, delay);
            this._cancelIds["" + cancelId] = this._cbCount;
            this._callbacks["" + this._cbCount].cancelId = cancelId;

            // we return a combination of internal id + cancelId to check that we are
            // not given an old id when cancelCallback is called
            var returnId = this._cbCount + "-" + cancelId;

            // reset count to avoid large nbr pb
            if (this._cbCount > this._MAX_COUNT) {
                this._cbCount = 0;
            }
            return returnId;
        },

        /**
         * Function called by the setTimeout callback when the delay time has expired
         * @param {Integer} cbId the internal callback id
         * @protected
         */
        _execCallback : function (cbId) {
            var id = "" + cbId;
            var cb = this._callbacks[id];
            if (cb) {
                // delete callback
                this._deleteCallback(id, true); // must be done before calling the callback so that callbacksRemaining
                // can be called in the callback

                try {
                    // execute callback
                    cb.fn.call(cb.scope, cb.args);
                } catch (ex) {
                    if (cb.onerror != null && typeof(cb.onerror == 'function')) {

                        try {
                            var scope = (cb.onerrorScope != null) ? cb.onerrorScope : cb.scope;
                            cb.onerror.call(scope, ex, cb);
                        } catch (ex2) {
                            this.$logError(this.TIMER_CB_ERROR_ERROR, [id], ex2);
                        }

                    } else {
                        this.$logError(this.TIMER_CB_ERROR, [id], ex);
                    }
                }
                cb.fn = null;
                cb.scope = null;
                cb.onerror = null;
                cb.onerrorScope = null;
            }

        },

        /**
         * Cancel a callback if not already executed
         * @param {String} cancelId returned by the addCallback() method
         */
        cancelCallback : function (cancelId) {
            var arr = cancelId.split('-');
            var idx = arr[0];
            var winCancelId = parseInt(arr[1], 10);
            clearTimeout(winCancelId);
            this._deleteCallback(idx);
        },

        /**
         * Internal method to cleanup and delete a callback from the stack
         * @param {String} cbIdx
         * @protected
         */
        _deleteCallback : function (cbIdx, skipNullify) {
            var cb = this._callbacks['' + cbIdx];
            if (cb) {
                // delete cancel id entry
                delete this._cancelIds["" + cb.cancelId];
                this._numberOfCallbacks--;
                delete this._callbacks['' + cbIdx];
                if (!skipNullify) {
                    cb.fn = null;
                    cb.scope = null;
                    cb.onerror = null;
                    cb.onerrorScope = null;
                }
            }
        }
    }
});

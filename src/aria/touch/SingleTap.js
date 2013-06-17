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
 * Contains delegated handler for a single tap event. It has to be used on elements which are also listening to
 * doubletap, since listening to tap is non sense in that case.
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.SingleTap",
    $extends : "aria.touch.Gesture",
    $statics : {
        /**
         * The move tolerance to validate the gesture.
         * @type Integer
         */
        MARGIN : 10,
        /**
         * The delay before validating the gesture, after the end event.
         * @type Integer
         */
        FINAL_DELAY : 250
    },
    $prototype : {
        /**
         * Initial listeners for the SingleTap gesture.
         * @protected
         */
        _getInitialListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchstart,
                        cb : {
                            fn : this._singleTapStart,
                            scope : this
                        }
                    }];
        },

        /**
         * Additional listeners for the SingleTap gesture.
         * @protected
         */
        _getAdditionalListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchmove,
                        cb : {
                            fn : this._singleTapMove,
                            scope : this
                        }
                    }, {
                        evt : this.touchEventMap.touchend,
                        cb : {
                            fn : this._singleTapEnd,
                            scope : this
                        }
                    }];
        },

        /**
         * The fake events raised during the SingleTap lifecycle.
         * @protected
         */
        _getFakeEventsMap : function () {
            return {
                start : "singletapstart",
                cancel : "singletapcancel",
                finalize : "singletap"
            };
        },

        /**
         * SingleTap start mgmt: gesture is started if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _singleTapStart : function (event) {
            if (this.timerId) {
                // Cancels the current gesture if a start event occurs during the FINAL_DELAY ms period.
                return this._singleTapFinalCancel(event);
            } else {
                var status = this._gestureStart(event);
                return (status == null)
                        ? (event.returnValue != null) ? event.returnValue : !event.defaultPrevented
                        : status;
            }
        },

        /**
         * singleTap move mgmt: gesture continues if only one touch and if the move is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _singleTapMove : function (event) {
            var position = aria.touch.Event.getPositions(event);
            if (this.MARGIN >= this._calculateDistance(this.startData.positions[0].x, this.startData.positions[0].y, position[0].x, position[0].y)) {
                var status = this._gestureMove(event);
                return (status == null) ? this._singleTapCancel(event) : status;
            } else {
                return this._singleTapCancel(event);
            }
        },

        /**
         * SingleTap end mgmt: if only one touch, the gesture will be finalized FINAL_DELAY ms later, if no start event
         * in between.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _singleTapEnd : function (event) {
            var status = this._gestureEnd(event);
            if (status != null) {
                this.timerId = aria.core.Timer.addCallback({
                    fn : this._singleTapFinalize,
                    scope : this,
                    delay : this.FINAL_DELAY,
                    args : event
                });
                return status;
            } else {
                return this._singleTapCancel(event);
            }
        },

        /**
         * SingleTap cancellation.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _singleTapCancel : function (event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            return this._gestureCancel(event);
        },

        /**
         * SingleTap finalization by firing the fake "singletap" event
         * @param {Object} event the original event
         * @protected
         */
        _singleTapFinalize : function (event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            this._raiseFakeEvent(event, this._getFakeEventsMap().finalize);
        },

        /**
         * SingleTap cancellation outside the lifecycle window.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _singleTapFinalCancel : function (event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            return this._raiseFakeEvent(event, this._getFakeEventsMap().cancel);
        }
    }
});

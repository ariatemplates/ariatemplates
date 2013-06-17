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
 * Contains delegated handler for a drag event
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.Drag",
    $extends : "aria.touch.Gesture",
    $prototype : {
        /**
         * Initial listeners for the Drag gesture.
         * @protected
         */
        _getInitialListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchstart,
                        cb : {
                            fn : this._dragStart,
                            scope : this
                        }
                    }];
        },

        /**
         * Additional listeners for the Drag gesture.
         * @protected
         */
        _getAdditionalListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchmove,
                        cb : {
                            fn : this._dragMove,
                            scope : this
                        }
                    }, {
                        evt : this.touchEventMap.touchend,
                        cb : {
                            fn : this._dragEnd,
                            scope : this
                        }
                    }];
        },

        /**
         * The fake events raised during the Drag lifecycle.
         * @protected
         */
        _getFakeEventsMap : function () {
            return {
                dragstart : "dragstart",
                dragmove : "dragmove",
                dragend : "drag",
                cancel : "dragcancel"
            };
        },

        /**
         * Drag start mgmt: gesture is started if only one touch, first fake event to be fired with the first move.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _dragStart : function (event) {
            var alreadyStarted = this.currentData != null;
            var status = this._gestureStart(event);
            if (status == null && alreadyStarted) {
                // if the gesture has already started, it has to be cancelled
                this.currentData = {
                    positions : aria.touch.Event.getPositions(event),
                    time : (new Date()).getTime()
                };
                return this._raiseFakeEvent(event, this._getFakeEventsMap().cancel);
            } else {
                return status == null
                        ? ((event.returnValue != null) ? event.returnValue : !event.defaultPrevented)
                        : status;
            }
        },

        /**
         * Tap move mgmt: gesture starts/continues if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _dragMove : function (event) {
            var alreadyStarted = this.currentData != null;
            var status = this._gestureMove(event);
            if (status != null) {
                // Gesture starts
                var eventName = this._getFakeEventsMap().dragstart;
                if (alreadyStarted) {
                    // Gesture moves
                    eventName = this._getFakeEventsMap().dragmove;
                }
                return this._raiseFakeEvent(event, eventName);
            } else {
                this.currentData = null;
                return (alreadyStarted) ? this._gestureCancel(event) : (event.returnValue != null)
                        ? event.returnValue
                        : !event.defaultPrevented;
            }
        },

        /**
         * Drag end mgmt: gesture ends if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _dragEnd : function (event) {
            var alreadyStarted = this.currentData != null;
            var status = this._gestureEnd(event);
            if (alreadyStarted) {
                return (status == null)
                        ? ((event.returnValue != null) ? event.returnValue : !event.defaultPrevented)
                        : this._raiseFakeEvent(event, this._getFakeEventsMap().dragend);
            } else {
                return (event.returnValue != null) ? event.returnValue : !event.defaultPrevented;
            }

        }
    }
});

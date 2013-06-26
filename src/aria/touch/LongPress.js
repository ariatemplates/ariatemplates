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
 * Contains delegated handler for a long press event.
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.LongPress",
    $extends : "aria.touch.Gesture",
    $statics : {
        /**
         * The move tolerance to validate the gesture.
         * @type Integer
         */
        MARGIN : 10,
        /**
         * The duration for the press.
         * @type Integer
         */
        PRESS_DURATION: 1000
    },
    $prototype : {
        /**
         * Initial listeners for the LongPress gesture.
         * @return {Array}
         * @protected
         */
        _getInitialListenersList: function() {
            return [{evt: this.touchEventMap.touchstart, cb: {fn : this._longPressStart, scope : this}}];
        },

        /**
         * Additional listeners for the LongPress gesture.
         * @return {Array}
         * @protected
         */
        _getAdditionalListenersList: function() {
            return [{evt: this.touchEventMap.touchmove, cb: {fn : this._longPressMove, scope : this}},
                    {evt: this.touchEventMap.touchend, cb: {fn : this._longPressCancel, scope : this}}];
        },

        /**
         * The fake events raised during the LongPress lifecycle.
         * @return {Object}
         * @protected
         */
        _getFakeEventsMap : function() {
            return {start: "longpressstart", cancel: "longpresscancel", finalize: "longpress"};
        },

        /**
         * LongPress start mgmt: gesture is started if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _longPressStart : function (event) {
            var status = this._gestureStart(event);
            if (status != null) {
                this.timerId = aria.core.Timer.addCallback({
                    fn : this._longPressFinalize,
                    scope : this,
                    delay : this.PRESS_DURATION,
                    args : event
                });
                return status;
            }
            else {
                if (this.timerId) {
                    return this._longPressCancel(event);
                }
                else {
                    return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
                }
            }
        },

        /**
         * LongPress move mgmt: gesture continues if only one touch and if the move is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _longPressMove : function(event) {
            var position = aria.touch.Event.getPositions(event);
            if (this.MARGIN >= this._calculateDistance(this.startData.positions[0].x, this.startData.positions[0].y, position[0].x, position[0].y)) {
                var status = this._gestureMove(event);
                return (status == null)? this._longPressCancel(event): status;
            }
            else {
                return this._longPressCancel(event);
            }
        },

        /**
         * LongPress cancellation, occurs if wrong start or move (see above), or if an end event occurs before the end of the timer.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _longPressCancel : function (event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            return this._gestureCancel(event);
        },

        /**
         * LongPress finalization by firing the fake "longpress" event
         * @param {Object} event the original event
         * @protected
         */
        _longPressFinalize: function (event) {
            if (this.timerId) {
                aria.core.Timer.cancelCallback(this.timerId);
                this.timerId = null;
            }
            this._gestureEnd(event);
            this._raiseFakeEvent(event, this._getFakeEventsMap().finalize);
        }
    }
});

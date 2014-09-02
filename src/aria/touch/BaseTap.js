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
var ariaTouchGesture = require("./Gesture");


/**
 * Contains delegated handler for a tap event
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.touch.BaseTap",
    $extends : ariaTouchGesture,
    $statics : {
        /**
         * The move tolerance to validate the gesture.
         * @type Integer
         */
        MARGIN : 10
    },
    $prototype : {
        /**
         * Initial listeners for the Tap gesture.
         * @protected
         */
        _getInitialListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchstart,
                        cb : {
                            fn : this._tapStart,
                            scope : this
                        }
                    }];
        },

        /**
         * Additional listeners for the Tap gesture.
         * @protected
         */
        _getAdditionalListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchmove,
                        cb : {
                            fn : this._tapMove,
                            scope : this
                        }
                    }, {
                        evt : this.touchEventMap.touchend,
                        cb : {
                            fn : this._tapEnd,
                            scope : this
                        }
                    }];
        },

        /**
         * Tap start mgmt: gesture is started if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _tapStart : function (event) {
            var status = this._gestureStart(event);
            return (status == null)
                    ? ((event.returnValue != null) ? event.returnValue : !event.defaultPrevented)
                    : status;
        },

        /**
         * Tap move mgmt: gesture continues if only one touch and if the move is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _tapMove : function (event) {
            var position = aria.touch.Event.getPositions(event);
            if (this.MARGIN >= this._calculateDistance(this.startData.positions[0].x, this.startData.positions[0].y, position[0].x, position[0].y)) {
                var status = this._gestureMove(event);
                return (status == null) ? this._gestureCancel(event) : status;
            } else {
                return this._gestureCancel(event);
            }
        },

        /**
         * Tap end mgmt: gesture ends if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _tapEnd : function (event) {
            var status = this._gestureEnd(event);
            return (status == null) ? this._gestureCancel(event) : (event.returnValue != null)
                    ? event.returnValue
                    : !event.defaultPrevented;
        }
    }
});

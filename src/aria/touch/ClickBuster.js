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
var ariaTouchEvent = require("./Event");
var ariaCoreBrowser = require("../core/Browser");


/**
 * Contains delegated handler for a tap event
 */
module.exports = Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.ClickBuster",
    $statics : {
        RADIO : 25,
        DELAY : 500
    },
    $constructor : function () {
        this.isDesktop = ariaCoreBrowser.DesktopView;
        this.lastEvt = null;
    },
    $prototype : {
        registerTap : function (event) {
            this.lastEvt = {
                pos : {
                    x : event.detail.currentX,
                    y : event.detail.currentY
                },
                date : new Date()
            };
        },
        preventGhostClick : function (event) {
            if (this._alreadyHandled(event)) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
            return true;
        },

        _alreadyHandled : function (e) {
            var position = ariaTouchEvent.getPositions(e)[0];
            return (this.lastEvt && this._isShortDelay(this.lastEvt.date, new Date()) && this._isSameArea(this.lastEvt.pos, position));
        },

        _isSameArea : function (pos1, pos2) {
            return (Math.abs(pos1.x - pos2.x) < this.RADIO && Math.abs(pos1.y - pos2.y) < this.RADIO);
        },

        _isShortDelay : function (date1, date2) {
            return (date2 - date1 <= this.DELAY);
        }
    }
});

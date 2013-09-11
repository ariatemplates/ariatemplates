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
 * Script display for profile informations
 * @class aria.utils.ProfilingDisplayScript
 */
Aria.tplScriptDefinition({
    $classpath : 'aria.utils.ProfilingDisplayScript',
    $prototype : {
        zoomIn : function () {
            this.scale = this.scale / 2;
            this.$refresh();
        },

        zoomOut : function () {
            this.scale = this.scale * 2;
            this.$refresh();
        },

        close : function () {
            aria.utils.Profiling.hideProfilingData();
        },

        getPosition : function (value) {
            if (value < this.timeBegin) {
                return this.leftShift;
            }
            return (value - this.timeBegin) / this.scale + this.leftShift;
        },

        getLength : function (value, start) {
            var deltaStart = start - this.timeBegin;
            if (deltaStart < 0) {
                value += deltaStart;
            }
            if (value <= 0) {
                return 0;
            }
            return value / this.scale;
        },

        isTimeRangeVisible : function (start, length) {
            return start + length >= this.timeBegin;
        },

        isTimeRangeListVisible : function (list) {
            for (var i = 1, l = list.length; i < list.length; i++) {
                if (this.isTimeRangeVisible(list[i].start, list[i].length)) {
                    return true;
                }
            }
            return false;
        },

        getTimeFromPosition : function (value) {
            return (value - this.leftShift) * this.scale + this.timeBegin;
        },

        toggleChecked : function () {
            this.showAllMsg = !this.showAllMsg;
            this.$refresh();
        },

        mouseDown : function (evt) {
            // TODO: remove this horrible hack to have the position:
            var refPos = aria.utils.Dom.calculatePosition(aria.utils.Profiling._displayDiv.firstChild);
            var position = evt.clientX - refPos.left;
            if (aria.core.Browser.isIE7) {
                position -= 2;
            }

            var correspondingTime = this.getTimeFromPosition(position - this.marginLeft);
            if (correspondingTime < this.timeBegin) {
                return;
            }
            if (evt.altKey && !evt.ctrlKey && !evt.shiftKey) {
                this.timeBegin = correspondingTime;
                this.$refresh();
            } else if (!evt.altKey) {
                if (evt.ctrlKey && !evt.shiftKey) {
                    this.verticalBarTime1 = correspondingTime;
                } else if (evt.shiftKey && !evt.ctrlKey) {
                    this.verticalBarTime2 = correspondingTime;
                } else {
                    return;
                }
                this.$refresh({
                    section : "verticalBars"
                });
            } else {
                return;
            }
            evt.preventDefault(true);
        },

        resetTimeOrigin : function () {
            this.timeBegin = 0;
            this.$refresh();
        }
    }
});
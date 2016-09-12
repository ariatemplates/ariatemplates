/*
 * Copyright 2014 Amadeus s.a.s.
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
var Aria = require("ariatemplates/Aria");

module.exports = Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.calendar.rangeCalendar.RangeCalendar2TplScript",
    $prototype : {
        $dataReady : function () {
            if (!this.data.activeDate) {
                this.$json.setValue(this.data, "activeDate", "fromDate");
            }
        },

        clickDisplayDate : function (evt, fieldName) {
            this.$json.setValue(this.data, "activeDate", fieldName);
        },

        calendarSelectDate : function (evt) {
            var firstActiveDate = this.data.activeDate;
            var newActiveDate = this.data.activeDate == "toDate" ? "fromDate" : "toDate";
            var values = {
                fromDate : this.data.fromDate,
                toDate : this.data.toDate
            };
            values[firstActiveDate] = evt.date;
            if (values.fromDate && values.toDate && values.fromDate > values.toDate) {
                values[newActiveDate] = null;
            }
            this.$json.setValue(this.data, "activeDate", newActiveDate);
            this.$json.setValue(this.data, "fromDate", values.fromDate);
            this.$json.setValue(this.data, "toDate", values.toDate);
            this.$json.setValue(this.data, "fromDateCalendar", values.fromDate);
            this.$json.setValue(this.data, "toDateCalendar", values.toDate);
            this.$json.setValue(this.data, "mouseOverPreviewDisabled", true);
            evt.cancelDefault = true;
        },

        calendarMouseOver : function (evt) {
            if (this.mouseOutTimeout) {
                clearTimeout(this.mouseOutTimeout);
                this.mouseOutTimeout = null;
            }
            var values = {
                fromDate : this.data.fromDate,
                toDate : this.data.toDate
            };
            values[this.data.activeDate] = evt.date;
            var mouseOverPreviewDisabled = values.fromDate && values.toDate && values.fromDate > values.toDate;
            if (mouseOverPreviewDisabled) {
                values = {
                    fromDate : this.data.fromDate,
                    toDate : this.data.toDate
                };
            }
            this.$json.setValue(this.data, "fromDateCalendar", values.fromDate);
            this.$json.setValue(this.data, "toDateCalendar", values.toDate);
            this.$json.setValue(this.data, "mouseOverPreviewDisabled", mouseOverPreviewDisabled);
        },
        calendarMouseOut : function (evt) {
            var self = this;
            if (this.mouseOutTimeout) {
                clearTimeout(this.mouseOutTimeout);
                this.mouseOutTimeout = null;
            }
            evt.cancelDefault = !this.data.mouseOverPreviewDisabled;
            this.mouseOutTimeout = setTimeout(function () {
                self.mouseOutTimeout = null;
                self.$json.setValue(self.data, "mouseOverPreviewDisabled", true);
                self.$json.setValue(self.data, self.data.activeDate + "Calendar", self.data[self.data.activeDate]);
            }, 100);
        }

    }
});
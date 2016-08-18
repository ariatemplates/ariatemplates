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
var Aria = require("../../Aria");

/**
 * TODOC
 * @class aria.widgets.calendar.CalendarTemplateScript
 */
module.exports = Aria.tplScriptDefinition({
    $classpath : 'aria.widgets.calendar.CalendarTemplateScript',
    $prototype : {
        onModuleEvent : function (evt) {
            if (evt.name == "update") {
                var valueInfos = evt.properties['value'];
                var rangesInfos = evt.properties['ranges'];
                var optimizedUpdate = (evt.propertiesNbr == 1 && (valueInfos || rangesInfos))
                        || (evt.propertiesNbr == 2 && valueInfos && rangesInfos);
                if (optimizedUpdate) {
                    if (rangesInfos) {
                        var changedPositions = rangesInfos.changedPositions;
                        for (var i = 0, l = changedPositions.length; i < l; i++) {
                            this.updateClass(changedPositions[i]);
                        }
                    }
                    if (valueInfos) {
                        this.updateClass(valueInfos.oldValuePosition);
                        this.updateClass(valueInfos.newValuePosition);
                        if (evt.propertyshowShortcuts) {
                            this.$refresh({
                                section : "selectedDay"
                            });
                        }
                    }
                } else {
                    this.$refresh();
                }
            }
        },

        updateClass : function (position) {
            if (position == null || position.month == null) {
                return;
            }
            var weekWrapper = this.$getChild("month_" + position.month.monthKey, position.weekInMonthIndex);
            var dayWrapper = weekWrapper.getChild((this.settings.showWeekNumbers ? 1 : 0) + position.dayInWeekIndex);
            dayWrapper.classList.setClassName(this.getClassForDay(position.day));
            if (this.settings.waiAria) {
                dayWrapper.setAttribute("aria-selected", !!position.day.isSelected);
            }
            dayWrapper.$dispose();
            weekWrapper.$dispose();
        },

        clickDay : function (evt) {
            var date = evt.target.getData("date");
            if (date) {
                var jsDate = new Date(parseInt(date, 10));
                this.moduleCtrl.dateClick({
                    date : jsDate
                });
            }
        },

        getClassForDay : function (day) {
            var res = [];
            var baseCSS = this.skin.baseCSS;
            res.push(baseCSS + "day");
            res.push(baseCSS + "mouseOut");
            if (day.isWeekend && day.isSelectable) {
                res.push(baseCSS + "weekEnd");
            }
            if (day.isSelected) {
                res.push(this.skin.selectedClass);
            }
            if (day.isToday) {
                res.push(baseCSS + "today");
            }
            res.push(day.isSelectable ? baseCSS + "selectable" : baseCSS + "unselectable");
            var ranges = day.ranges;
            if (ranges) {
                for (var i = 0, l = ranges.length; i < l; i++) {
                    var curRangeLink = ranges[i];
                    var className = curRangeLink.range.classes[curRangeLink.positionInRange];
                    if (className) {
                        res.push(className);
                    }
                }
            }
            return res.join(' ');
        },

        mouseOverDay : function (evt) {
            var date = evt.target.getData("date");
            if (date) {
                var jsDate = new Date(parseInt(date, 10));
                var preventDefault = this.moduleCtrl.dateMouseOver({
                    date : jsDate
                });
                if (!preventDefault) {
                    evt.target.classList.setClassName(evt.target.classList.getClassName().replace(this.skin.baseCSS
                            + "mouseOut", this.skin.baseCSS + "mouseOver"));
                }
            }
        },

        mouseOutDay : function (evt) {
            var date = evt.target.getData("date");
            if (date) {
                var jsDate = new Date(parseInt(date, 10));
                var preventDefault = this.moduleCtrl.dateMouseOut({
                    date : jsDate
                });
                if (!preventDefault) {
                    evt.target.classList.setClassName(evt.target.classList.getClassName().replace(this.skin.baseCSS
                            + "mouseOver", this.skin.baseCSS + "mouseOut"));
                }
            }
        }
    }
});

/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.action.sortindicator.onclick.OnclickCallbackTplScript",
    $statics : {
        weekDays : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        months : ["JAN", "FEB", "MAR", "APR", "JUN", "JUL", "SEP", "OCT", "NOV", "DEC"]
    },
    $prototype : {
        onModuleEvent : function (evt) {
            switch (evt.name) {
                case "searchTypeChanged" :
                    this.data.avail = null;
                    this.$refresh();
                    break;
                case "result_selectionChanged" :
                    this.$refresh();
                    break;
                default :
            }
        },

        onClickCb : function (evt) {
            this.data.isClicked = true;
        },

        /**
         * Try to select the default class for the given segment if default class is not present for the segment, or no
         * default class is provided, first class is returned
         * @param {} segment
         * @param {} defaultClass
         * @return {} selected class for segment
         */
        getClassForSegment : function (segment, defaultClass) {
            var classes = segment.classes, classesLength = classes.length, classForSegment = null;

            if (classesLength > 0) {
                classForSegment = classes[0].rbd;

                if (defaultClass != null) {
                    for (var i = 0; i < classesLength; i++) {
                        if (classes[i].rbd == defaultClass) {
                            classForSegment = defaultClass;
                            break;
                        }
                    }
                }
            }

            return classForSegment;
        },

        /**
         * Get the array of selected classes for a given recommendation, trying to select a default class if no default
         * class is provided, first available class for first segment is used as default class
         * @param {} recommendation
         * @param {} defaultClass
         * @return {}
         */
        getSelectedClasses : function (recommendation, defaultClass) {
            var segments = recommendation.segments, segmentsLength = segments.length, selectedClasses;

            if (segments && segments.length > 0) {
                selectedClasses = [];

                var firstSegment = segments[0];
                if (!defaultClass) {
                    defaultClass = firstSegment.classes[0].rbd;
                }
                selectedClasses.push(defaultClass);

                for (var i = 1; i < segmentsLength; i++) {
                    selectedClasses.push(this.getClassForSegment(segments[i], defaultClass));
                }
            }

            return selectedClasses;
        },

        getDefaultSelection : function (bound) {
            var recommendations = bound.recommendations;

            if (recommendations && recommendations.length) {
                var selectedClasses = this.getSelectedClasses(recommendations[0]);
                return {
                    recommendation : 0,
                    classes : selectedClasses
                };
            }

        },

        getSelection : function (boundIndex) {
            var data = this.data.avail, selections = data.selections;
            if (!selections) {
                selections = [];
                data.selections = selections;
            }

            var selectionForBound = selections[boundIndex];

            if (!selectionForBound) {
                selectionForBound = this.getDefaultSelection(data.prices[0].bounds[boundIndex]);
                selections[boundIndex] = selectionForBound;
            }

            return selectionForBound;
        },

        setDisplayedBound : function (evt, args) {
            var index = args;
            this.data.avail.displayedBound = index;
            this.$refresh();
        },

        onTableClick : function (evt, args) {
            var boundIndex = args;

            var target = evt.target;

            var rbd = target.getData("rbd", true);
            if (rbd != null) {
                var recommendation = target.getData("recommendation", true);
                var segment = target.getData("segment", true);

                this.selectClass(boundIndex, recommendation, segment, rbd);
            }
        },

        selectClass : function (boundIndex, recoIndex, segmentIndex, rbd) {
            var currentSelection = this.data.avail.selections[boundIndex];
            var recommendation = this.data.avail.bounds[boundIndex].recommendations[recoIndex];

            if (currentSelection.recommendation != recoIndex || segmentIndex === 0) {
                var defaultClass = (segmentIndex === 0) ? rbd : null;
                var selectedClasses = this.getSelectedClasses(recommendation, defaultClass);
                currentSelection.classes = selectedClasses;

                currentSelection.recommendation = recoIndex;
            }

            currentSelection.classes[segmentIndex] = rbd;
            this.$refresh({
                section : "bound" + boundIndex
            });
        },

        getFlightNumber : function (segment) {
            var flightNumber = [segment.airline];
            if (segment.operatingAirline && segment.operatingAirline != -1) {
                flightNumber.push(":");
                flightNumber.push(segment.operatingAirline);
            }
            flightNumber.push(" ");
            flightNumber.push(segment.flightNumber);

            return flightNumber.join("");
        },

        getAirlineTooltip : function (segment) {
            var airlines = this.data.avail.dictionary.airlines;
            var airline = segment.airline;
            var operatingAirline = segment.operatingAirline;

            var tooltip = [airline, airlines[airline]];

            if (operatingAirline && operatingAirline != -1) {
                tooltip.push("|");
                tooltip.push(operatingAirline);
                tooltip.push(airlines[operatingAirline]);
            }

            return tooltip.join(" ");
        },

        getDayDelta : function (date1, date2) {
            var day1 = (date1 - date1 % 86400000) / 86400000;
            var day2 = (date2 - date2 % 86400000) / 86400000;
            var dayDelta = day1 - day2;
            return (dayDelta > 0) ? "+" + dayDelta : dayDelta;
        },

        formatDuration : function (duration) {
            duration = parseInt(duration, 10);

            // duration is returned in minutes by the BE
            var minutes = duration % 60;
            var hours = (duration - minutes) / 60;

            var formattedDuration = [];

            if (hours < 10) {
                hours = "0" + hours;
            }
            formattedDuration.push(hours);

            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            formattedDuration.push(minutes);

            return formattedDuration.join(":");
        },

        toggleSort : function (evt, args) {
            var view = args.view;
            var sortName = args.sort;
            var sortFunction = null;
            switch (sortName) {
                case "SortByIndex" :
                    sortFunction = this.sortByIndex;
                    break;
                case "SortByFlightNumber" :
                    sortFunction = this.sortByFlightNumber;
                    break;
                case "SortByDepCity" :
                    sortFunction = this.sortByDepCity;
                    break;
                case "SortByArrCity" :
                    sortFunction = this.sortByArrCity;
                    break;
                case "SortByDepTime" :
                    sortFunction = this.sortByDepTime;
                    break;
                case "SortByArrTime" :
                    sortFunction = this.sortByArrTime;
                    break;
                case "SortByStops" :
                    sortFunction = this.sortByStops;
                    break;
                case "SortByDuration" :
                    sortFunction = this.sortByDuration;
                    break;
                case "SortByAircraft" :
                    sortFunction = this.sortByAircraft;
                    break;
                default :
                    break;
            }

            view.toggleSortOrder(sortName, sortFunction);

            this.$refresh();
            return false;
        },

        sortByIndex : function (o) {
            var recommendation = o.value;
            return recommendation.index;
        },

        sortByFlightNumber : function (o) {
            var recommendation = o.value;
            var segment = recommendation.segments[0];
            return [segment.airline, (segment.operatingAirline) ? segment.operatingAirline : "", segment.flightNumber].join("");
        },

        sortByDepCity : function (o) {
            var recommendation = o.value;
            var departure = recommendation.segments[0].departure;
            return [departure.location, departure.terminal].join("");
        },

        sortByArrCity : function (o) {
            var recommendation = o.value;
            var segments = recommendation.segments;
            var arrival = segments[segments.length - 1].arrival;
            return [arrival.location, arrival.terminal].join("");
        },

        sortByDepTime : function (o) {
            var recommendation = o.value;
            var departure = recommendation.segments[0].departure;
            return departure.date;
        },

        sortByArrTime : function (o) {
            var recommendation = o.value;
            var segments = recommendation.segments;
            var arrival = segments[segments.length - 1].arrival;
            return arrival.date;
        },

        sortByStops : function (o) {
            var recommendation = o.value;
            var segment = recommendation.segments[0];
            return segment.stops;
        },

        sortByDuration : function (o) {
            var recommendation = o.value;
            return parseInt(recommendation.duration, 10);
        },

        sortByAircraft : function (o) {
            var recommendation = o.value;
            var segment = recommendation.segments[0];
            return segment.equipment;
        },

        selectRecommendation : function (evt, indexes) {
            // refresh -- later: access the DOM and change the css
            this.moduleCtrl.result_selectRecommendation(indexes.combinationID, indexes.recommID, indexes.boundID);
        }
    }
});

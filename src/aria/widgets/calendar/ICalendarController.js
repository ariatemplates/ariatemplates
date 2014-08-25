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
var ariaTemplatesIModuleCtrl = require("../../templates/IModuleCtrl");


/**
 * Public interface for the calendar controller.
 * @class aria.widgets.calendar.ICalendarController
 */
module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.widgets.calendar.ICalendarController',
    $extends : ariaTemplatesIModuleCtrl,
    $events : {
        "focusChanged" : {
            description : "Raised when the focus changed.",
            properties : {
                "focus" : "Contains the current value of the focus property.",
                "cancelDefault" : "If true, prevent the default focus visual notification."
            }
        },
        "update" : {
            description : "Raised when one or more calendar settings have changed and the data model has been updated.",
            properties : {
                "properties" : "Map of properties which have changed in the settings. This map must stay read-only.",
                "propertiesNbr" : "Number of properties which have changed in the settings."
            }
        },
        "dateClick" : {
            description : "Raised when the user clicked on a date in the calendar.",
            properties : {
                "date" : "Date which the user clicked on.",
                "cancelDefault" : ""
            }
        },
        "keyevent" : {
            description : "Raised when the keyevent method is called, which is normally when the user has pressed a key. A listener of this event can change some of the event properties to change the default behavior.",
            properties : {
                "charCode" : "",
                "keyCode" : "",
                "increment" : "",
                "incrementUnit" : "",
                "refDate" : "",
                "date" : "",
                "cancelDefault" : "Set this property to true if some action is done on this key when receiving this event, so that the key propagation and the default action of the browser on this key is canceled."
            }
        }
    },
    $interface : {
        /**
         * Navigate to the next page, the previous page or to a specific date.
         */
        navigate : function (evt, args) {},

        /**
         * Select a specific day in the calendar.
         */
        selectDay : function (args) {},

        /**
         * Update the calendar.
         */
        update : function () {},

        /**
         * Notify the calendar controller that a key has been pressed. The controller reacts by sending a keyevent
         * event. Upon receiving that event, listeners can either ignore it, which leads to the default action being
         * executed when returning from the event, or they can override the default action by changing event properties.
         * @param {Object} Any object with the charCode and keyCode properties which specify which key has been pressed.
         * Any other property in this object is ignored.
         * @return {Boolean} true if the default action should be canceled, false otherwise
         */
        keyevent : function (evtInfo) {},

        /**
         * Notify the calendar controller that the user has clicked on a date.
         */
        dateClick : function (args) {},

        /**
         * Return information about the position of the given JavaScript date in the calendar data model.
         * @param {Date} JavaScript date
         * @return {aria.widgets.calendar.CfgBeans.DatePosition} position of the date in the calendar data model, or
         * null if the date cannot be found in the current calendar data model.
         */
        getDatePosition : function (jsDate) {},

        /**
         * Notify the calendar controller that the focus changed, and give the new value of the focus.
         * @param {Boolean} calendarFocused new value of the focus.
         * @return {Boolean} if true, the default focus visual notification should not be displayed
         */
        notifyFocusChanged : function (calendarFocused) {}
    }
});

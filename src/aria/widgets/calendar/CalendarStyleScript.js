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
var Aria = require("../../Aria");

module.exports = Aria.tplScriptDefinition({
    $classpath : 'aria.widgets.calendar.CalendarStyleScript',
    $prototype : {

        isSet : function (value) {
            // "undefined" is an accepted value to specify that the corresponding CSS
            // should property should not be defined at all
            return value != null && value != "undefined";
        },

        getStyleFor : function (skinClass, propertyName) {
            var defaultValues = this[propertyName + "Default"] || {};
            var newObject = skinClass[propertyName] || {};
            return {
                // existing properties:
                backgroundColor : newObject.backgroundColor || defaultValues.backgroundColor,
                color : newObject.color || defaultValues.color,
                borderColor : newObject.borderColor || defaultValues.borderColor,
                // new properties:
                fontWeight : newObject.fontWeight || defaultValues.fontWeight,
                borderStyle : newObject.borderStyle || defaultValues.borderStyle,
                fontStyle : newObject.fontStyle || defaultValues.fontStyle
            };
        }
    }
});

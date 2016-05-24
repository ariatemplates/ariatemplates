/*
 * Copyright 2015 Amadeus s.a.s.
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
var LCResourcesHandler = require("ariatemplates/resources/handlers/LCResourcesHandler");

module.exports = Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.wai.iconLabel.IconLabelTplScript",
    $constructor : function () {
        this.acHandler = new LCResourcesHandler();
        this.acHandler.setSuggestions([{
                    label : 'Paris',
                    code : 'Paris'
                }, {
                    label : 'Pau',
                    code : 'Pau'
                }, {
                    label : 'Pessac',
                    code : 'Pessac'
                }, {
                    label : 'Perpignan',
                    code : 'Perpignan'
                }, {
                    label : 'Pierrelatte',
                    code : 'Pierrelatte'
                }, {
                    label : 'Plaisir',
                    code : 'Plaisir'
                }, {
                    label : 'Poitiers',
                    code : 'Poitiers'
                }, {
                    label : 'Pontoise',
                    code : 'Pontoise'
                }]);
    },
    $destructor : function () {
        this.acHandler.$dispose();
        this.acHandler = null;
    },
    $prototype: {
        waiSuggestionsStatusGetter : function (number) {
           if (number === 0) {
               return "There is no suggestion.";
           } else {
               return (number == 1 ? "There is one suggestion" : "There are " + number + " suggestions") + ", use up and down arrow keys to navigate and enter to validate.";
           }
       },

       waiSuggestionAriaLabelGetter : function (object) {
           return object.value.label + " " + (object.index + 1) + " of " + object.total;
       }
    }
});

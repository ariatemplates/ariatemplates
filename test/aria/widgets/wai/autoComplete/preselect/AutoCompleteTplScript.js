/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.autoComplete.preselect.AutoCompleteTplScript",
    $constructor : function () {
        this.acHandler = new LCResourcesHandler({
            labelMatchAtWordBoundaries: true,
            sortingMethod: function (a, b) {
                return (a.label < b.label)
                        ? -1
                        : (a.label > b.label) ? 1 : 0;
            }
        });
        this.acHandler.setSuggestions([{
                label : 'Austria +43',
                code : 'AT'
            }, {
                label : 'France +33',
                code : 'FR'
            }, {
                label : 'United Kingdom +44',
                code : 'GB'
            }, {
                label : 'Israel +972',
                code : 'IL'
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
               var remainingSuggestions = number - 1;
               if (remainingSuggestions === 0) {
                   return "There is no other suggestion. Press enter to accept it or change your entry.";
               }
               return (remainingSuggestions === 1 ? "There is 1 other suggestion" : "There are " + remainingSuggestions + " other suggestions") + ", use up and down arrow keys to navigate and enter to validate.";
           }
       },

       waiSuggestionAriaLabelGetter : function (object) {
           return object.value.label + " " + (object.index + 1) + " of " + object.total;
       }
    }
});

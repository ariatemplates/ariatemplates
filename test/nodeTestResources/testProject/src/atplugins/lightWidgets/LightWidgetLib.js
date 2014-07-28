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

(function () {
    var basePackage = "atplugins.lightWidgets";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : "atplugins.lightWidgets.LightWidgetLib",
        $extends : "aria.widgetLibs.WidgetLib",
        $singleton : true,
        $prototype : {
            widgets : {
                "TextInput" : "atplugins.lightWidgets.textinput.TextInputWithOnChange",
                "DatePicker" : "atplugins.lightWidgets.datepicker.DatePicker",
                "DateField" : "atplugins.lightWidgets.datefield.DateField",
                "AutoComplete" : "atplugins.lightWidgets.autocomplete.Autocomplete",
                "Calendar" : "atplugins.lightWidgets.calendar.Calendar"
            }
        }
    });
})();
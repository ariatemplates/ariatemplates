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
    $classpath : "test.aria.templates.keyboardNavigation.DialogNavTestCaseTplScript",

    $constructor : function () {
        aria.templates.NavigationManager.addGlobalKeyMap({
            key : "ESCAPE",
            callback : {
                fn : function () {
                    this.data.escapeEvts++;
                },
                scope : this
            }
        });
    },

    $destructor : function () {
        aria.templates.NavigationManager.removeGlobalKeyMap({
            key : "ESCAPE"
        });
    },

    $prototype : {
        clickHandler : function () {
            var holder = this.data;
            var propName = "dialogOpen";

            this.$json.setValue(holder, propName, !holder[propName]);
        }
    }
});

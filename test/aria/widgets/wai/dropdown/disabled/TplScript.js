/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.dropdown.disabled.TplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $constructor : function () {
        this.items = [{
                    label : "Touch device",
                    code : "Touch device",
                    value : "Touch device"
                }, {
                    label : "Desktop device",
                    code : "Desktop device",
                    value : "Desktop device"
                }];
    },
    $destructor : function () {
        if (this.acHandler) {
            this.acHandler.$dispose();
            this.acHandler = null;
        }
    },
    $prototype : {
        getAutoCompleteHandler : function () {
            if (!this.acHandler) {
                var acHandler = new aria.resources.handlers.LCResourcesHandler();
                acHandler.setSuggestions(this.items);
                this.acHandler = acHandler;
            }
            return this.acHandler;
        }
    }
});

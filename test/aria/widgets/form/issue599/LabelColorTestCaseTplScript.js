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

Aria.tplScriptDefinition({
    $classpath : "test.aria.widgets.form.issue599.LabelColorTestCaseTplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $destructor : function () {
        if (this.resourcesHandler) {
            this.resourcesHandler.$dispose();
            this.resourcesHandler = null;
        }
    },
    $prototype : {
        getWidgetConfig : function (id, cfg) {
            cfg = cfg || {};
            cfg.id = id;
            cfg.labelWidth = 100;
            cfg.label = id;
            cfg.bind = {
                disabled : {
                    to : id + "_disabled",
                    inside : this.data
                }
            };
            return cfg;
        },

        getResourcesHandler : function () {
            if (!this.resourcesHandler) {
                this.resourcesHandler = new aria.resources.handlers.LCResourcesHandler();
            }
            return this.resourcesHandler;
        }
    }
});
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
    $classpath : "test.aria.templates.css.ctxtMgr.MainScript",
    $dependencies : ["aria.templates.RefreshManager"],
    $prototype : {
        next : function () {
            var next = (this.data.step + 1) % this.data.configuration.length;
            var nextConfiguration = this.data.configuration[next];

            aria.templates.RefreshManager.stop();
            this.$json.setValue(this.data, "step", next);

            for (var template in this.data) {
                if (this.data.hasOwnProperty(template) && !this.$json.isMetadata(template)
                        && template.charAt(0) === "T") {
                    if (aria.utils.Array.indexOf(this.data.configuration[next], template) > -1) {
                        this.$json.setValue(this.data, template, true);
                    } else {
                        this.$json.setValue(this.data, template, false);
                    }
                }
            }
            aria.templates.RefreshManager.resume();
        }
    }
});

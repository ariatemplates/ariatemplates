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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiselect.labelsToTrim.LabelsToTrim",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            value : ["D", "B", "V"],
            options : [{
                        value : "D",
                        label : "Donizetti "
                    }, {
                        value : "B",
                        label : "Bellini "
                    }, {
                        value : "V",
                        label : " Verdi "
                    }],
            popup : false
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Json.setValue(this.data, "popup", true);
            aria.core.Timer.addCallback({
                fn : this._afterPopupOpen,
                scope : this
            });
        },

        _afterPopupOpen : function () {
            this.assertJsonEquals(this.data.value, ["D", "B", "V"]);
            this.end();
        }
    }
});

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
    $classpath : "test.aria.widgets.form.textinput.errorTooltipPosition.ErrorTooltipPositionTestCaseTplScript",
    $dependencies : ["aria.utils.Data", "aria.utils.validators.Mandatory"],
    $destructor : function () {
        aria.utils.Data.unsetValidator(this.data, "value");
        this.validator.$dispose();
    },
    $prototype : {
        $dataReady : function () {
            var validator = this.validator = new aria.utils.validators.Mandatory("This field is mandatory");
            if (!this.data.value) {
                this.$json.setValue(this.data, "value", "");
            }
            aria.utils.Data.setValidator(this.data, "value", validator);
            aria.utils.Data.validateModel(this.data);
        }
    }
});

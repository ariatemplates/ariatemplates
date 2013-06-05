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
    $classpath : "test.aria.widgets.form.datepicker.errorstate.DatePickerTplScript",
    $prototype : {
        refresh : function () {
            this.$refresh({
                filterSection : "datepickers"
            });
        },
        clear : function () {
            // DatePicker 1
            this.$json.setValue(this.data, "invalid1", "");
            this.$json.setValue(this.data, "value1", null);
            // DatePicker 2
            this.$json.setValue(this.data, "invalid2", "");
            this.$json.setValue(this.data, "value2", null);
        },
        clearInvalidText : function () {
            // DatePicker 1
            this.$json.setValue(this.data, "invalid1", "");
            // DatePicker 2
            this.$json.setValue(this.data, "invalid2", "");
        },
        setInvalidText : function () {
            // DatePicker 1
            this.$json.setValue(this.data, "invalid1", "b");
            // DatePicker 2
            this.$json.setValue(this.data, "invalid2", "b");
        },
        setValidValue : function () {
            // DatePicker 1
            this.$json.setValue(this.data, "value1", new Date(2000, 12, 1));
            // DatePicker 2
            this.$json.setValue(this.data, "value2", new Date(2000, 12, 1));
        }
    }
});